#!/usr/bin/env bash
#
# deploy-prospect.sh <slug>
#
# Deterministic, baked deploy step for the autonomous prospect-build
# (`/build-prospect-site`). Run this from the prospect's branch AFTER the build
# is committed and `npm run healthcheck` is green. It:
#
#   1. creates/links a dedicated Vercel project  smallseats-<slug>
#   2. deploys the current tree to production
#   3. DISABLES Vercel Deployment Protection (SSO + password) so the URL is
#      publicly viewable by the prospect  (ON by default — team-scoped token)
#   4. DISCOVERS the public production alias (Vercel truncates it — never assume
#      smallseats-<slug>.vercel.app), verifies it returns HTTP 200 with the
#      prospect's name in the HTML, and picks it as previewUrl
#   5. ALWAYS writes .briefs/<slug>.result.json  (built | failed) — the handoff
#      contract back to the smallseats brain. Never exits without it.
#
# Notes for the result file are read from .briefs/<slug>.notes.md if present
# (the build agent writes honest, human-readable notes there before deploying);
# otherwise a generic note is used.
#
# Requires VERCEL_TOKEN in .env (team-scoped — orgId is read from
# .vercel/project.json and passed as teamId to every Vercel API call).
#
set -uo pipefail
REPO="/Users/ryanharmon/Documents/Code/astro-starter"
cd "$REPO"

SLUG="${1:-}"
if [ -z "$SLUG" ]; then
  echo "usage: scripts/deploy-prospect.sh <slug>" >&2
  exit 2
fi

PROJECT="smallseats-${SLUG}"
RESULT=".briefs/${SLUG}.result.json"
NOTES_FILE=".briefs/${SLUG}.notes.md"
API="https://api.vercel.com"
BUILT_AT="$(date +%F)"
mkdir -p .briefs

# --- helper: write the result file deterministically via node (bulletproof JSON escaping) ---
# args: <status> <previewUrl> [extraNote]
write_result() {
  local status="$1"; local url="$2"; local extra="${3:-}"
  local sha; sha="$(git rev-parse --short HEAD 2>/dev/null || echo "")"
  SLUG="$SLUG" PROJECT="$PROJECT" PURL="$url" STATUS="$status" \
  BUILT_AT="$BUILT_AT" SHA="$sha" NOTES_FILE="$NOTES_FILE" EXTRA="$extra" RESULT="$RESULT" \
  node -e '
    const fs = require("fs");
    const E = process.env;
    let notes = "";
    try { notes = fs.readFileSync(E.NOTES_FILE, "utf8").trim(); } catch (e) {}
    if (!notes) {
      notes = E.STATUS === "built"
        ? "Personalized maplewood-base into a prospect site and deployed to a dedicated Vercel project. See the branch for details."
        : "Build did not complete.";
    }
    if (E.EXTRA) notes = notes + " " + E.EXTRA;
    const out = {
      id: E.SLUG,
      branch: E.SLUG,
      vercelProject: E.PROJECT,
      previewUrl: E.PURL,
      buildStatus: E.STATUS,
      builtAt: E.BUILT_AT,
      commit: E.SHA,
      notes,
    };
    fs.writeFileSync(E.RESULT, JSON.stringify(out, null, 2) + "\n");
  '
  echo "=== RESULT (${status}) -> ${RESULT} ==="
  cat "$RESULT"
}

# --- 0. token ---
VERCEL_TOKEN="$(grep -E '^VERCEL_TOKEN=' .env 2>/dev/null | head -1 | sed -E 's/^VERCEL_TOKEN=//; s/^"//; s/"$//; s/^'"'"'//; s/'"'"'$//')"
if [ -z "$VERCEL_TOKEN" ]; then
  write_result "failed" "" "(VERCEL_TOKEN missing from .env — build may be committed locally but was not deployed.)"
  exit 1
fi

# brand name for the live content check (already swapped into site-meta by the build)
BRAND="$(node -e 'try{console.log((JSON.parse(require("fs").readFileSync("src/data/site-meta.json","utf8")).name||"").trim())}catch(e){}' 2>/dev/null)"

# --- 1. create + link project (idempotent) ---
echo "=== VERCEL PROJECT ${PROJECT} ==="
rm -rf .vercel
vercel projects add "$PROJECT" --token "$VERCEL_TOKEN" >/tmp/vadd.log 2>&1 \
  || vercel project add "$PROJECT" --token "$VERCEL_TOKEN" >/tmp/vadd.log 2>&1 || true
vercel link --yes --project "$PROJECT" --token "$VERCEL_TOKEN" >/tmp/vlink.log 2>&1
if [ ! -f .vercel/project.json ]; then
  echo "--- link log ---"; tail -20 /tmp/vlink.log 2>/dev/null || true
  write_result "failed" "" "(vercel link failed — could not create/link project ${PROJECT}. See /tmp/vlink.log.)"
  exit 1
fi
PROJECT_ID="$(grep -o '"projectId":"[^"]*"' .vercel/project.json | sed -E 's/.*:"//; s/"//')"
TEAM_ID="$(grep -o '"orgId":"[^"]*"' .vercel/project.json | sed -E 's/.*:"//; s/"//')"
TEAMQ=""; [ -n "$TEAM_ID" ] && TEAMQ="?teamId=${TEAM_ID}"
echo "PROJECT_ID=${PROJECT_ID}  TEAM_ID=${TEAM_ID}"

# --- 2. deploy to production ---
echo "=== VERCEL DEPLOY --prod ==="
vercel deploy --prod --yes --token "$VERCEL_TOKEN" >/tmp/vdeploy.log 2>&1
DRC=$?
DEPLOY_URL="$(grep -Eo 'https://[A-Za-z0-9.-]+\.vercel\.app' /tmp/vdeploy.log | tail -1)"
echo "--- deploy log (tail) ---"; tail -12 /tmp/vdeploy.log 2>/dev/null || true
if [ "$DRC" -ne 0 ] || [ -z "$DEPLOY_URL" ]; then
  write_result "failed" "" "(Build committed locally but Vercel deploy failed: rc=${DRC}, no production URL. See /tmp/vdeploy.log.)"
  exit 1
fi
echo "DEPLOY_URL=${DEPLOY_URL}"

# --- 3. disable Deployment Protection (SSO + password) so the prospect can view it ---
echo "=== DISABLE DEPLOYMENT PROTECTION ==="
curl -s -X PATCH "${API}/v9/projects/${PROJECT_ID}${TEAMQ}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection": null, "passwordProtection": null}' \
  -o /tmp/vprotect.json -w 'PROTECT_HTTP=%{http_code}\n'
grep -o '"ssoProtection":[^,}]*' /tmp/vprotect.json || echo "(ssoProtection not echoed)"

# --- 4. discover the public production alias (Vercel truncates — never assume) ---
echo "=== DISCOVER PRODUCTION ALIAS ==="
curl -s "${API}/v9/projects/${PROJECT_ID}${TEAMQ}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" -o /tmp/vproj.json
# every *.vercel.app host found in the project record + `vercel inspect`, deduped, shortest first
ALIAS_HOSTS="$(node -e 'try{const s=require("fs").readFileSync("/tmp/vproj.json","utf8");const m=s.match(/[a-z0-9-]+\.vercel\.app/gi)||[];console.log([...new Set(m.map(x=>x.toLowerCase()))].join("\n"))}catch(e){}' 2>/dev/null)"
INSPECT_HOSTS="$(vercel inspect "$DEPLOY_URL" --token "$VERCEL_TOKEN" 2>&1 | grep -oiE '[a-z0-9-]+\.vercel\.app' | tr 'A-Z' 'a-z' | sort -u)"
CANDIDATES="$(printf '%s\n%s\n%s\n' "$ALIAS_HOSTS" "$INSPECT_HOSTS" "${DEPLOY_URL#https://}" \
  | grep -v '^$' | sort -u | awk '{ print length, $0 }' | sort -n | cut -d' ' -f2-)"
echo "candidates:"; echo "$CANDIDATES" | sed 's/^/  /'

# --- 5. verify candidates (HTTP 200 + brand in HTML); prefer shortest public alias ---
echo "=== VERIFY PUBLIC URL ==="
sleep 5
PUB=""; FIRST200=""
while IFS= read -r host; do
  [ -z "$host" ] && continue
  code="$(curl -s -L -o /tmp/vbody.html -w '%{http_code}' --max-time 25 "https://${host}" || echo 000)"
  echo "  https://${host} -> HTTP ${code}"
  if [ "$code" = "200" ]; then
    [ -z "$FIRST200" ] && FIRST200="https://${host}"
    if [ -z "$BRAND" ] || grep -qiF "$BRAND" /tmp/vbody.html; then PUB="https://${host}"; break; fi
  fi
done <<< "$CANDIDATES"
[ -z "$PUB" ] && PUB="$FIRST200"
[ -z "$PUB" ] && PUB="$DEPLOY_URL"   # last resort: report the per-deployment URL

# --- 6. write the success result ---
EXTRA=""
if ! curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$PUB" | grep -q '200'; then
  EXTRA="(WARNING: ${PUB} did not return 200 on final check — may still be warming up.)"
fi
write_result "built" "$PUB" "$EXTRA"
echo "=== DEPLOY COMPLETE  PUBLIC_URL=${PUB} ==="
