#!/usr/bin/env bash
#
# Usage: bash scripts/new-client.sh <client-slug> [--ref <url>]
#
# Creates a new client branch from main and initializes client.json.
# Safe to run from any branch. Does NOT switch your working tree.
#
# Examples:
#   bash scripts/new-client.sh little-campus
#   bash scripts/new-client.sh little-campus --ref https://littlecampus.com
#
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: bash scripts/new-client.sh <client-slug> [--ref <url>]"
  echo ""
  echo "  <client-slug>   Lowercase kebab-case identifier (e.g. little-campus)"
  echo "  --ref <url>     Optional reference URL for the client site"
  exit 1
fi

SLUG="$1"
BRANCH="client/${SLUG}"
REF_URL="null"

shift
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref)
      REF_URL="\"$2\""
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if ! echo "$SLUG" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
  echo "Error: client slug must be lowercase kebab-case (e.g. little-campus)"
  exit 1
fi

echo "=== New Client Setup ==="
echo "  Slug:   $SLUG"
echo "  Branch: $BRANCH"
echo ""

git fetch origin main

if git show-ref --verify --quiet "refs/heads/${BRANCH}" 2>/dev/null || \
   git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}" 2>/dev/null; then
  echo "Error: Branch '${BRANCH}' already exists."
  echo "If you want to resume work, check it out directly or add a worktree."
  exit 1
fi

git branch "$BRANCH" origin/main
echo "Created branch: $BRANCH"

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

git worktree add "$TEMP_DIR" "$BRANCH" --quiet

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PRETTY_NAME=$(echo "$SLUG" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

cat > "$TEMP_DIR/src/data/client.json" <<EOF
{
  "clientId": "${SLUG}",
  "clientName": "${PRETTY_NAME}",
  "branch": "${BRANCH}",
  "isBase": false,
  "referenceUrl": ${REF_URL},
  "createdAt": "${NOW}",
  "notes": ""
}
EOF

cat > "$TEMP_DIR/src/data/build-state.json" <<EOF
{
  "stage": "not-started",
  "completedStages": [],
  "currentCohort": 0,
  "cohorts": {},
  "sitemapApproved": false,
  "styleTileApproved": false,
  "notes": "Client: ${PRETTY_NAME}"
}
EOF

cd "$TEMP_DIR"
git add src/data/client.json src/data/build-state.json
git commit -m "initialize client: ${PRETTY_NAME}"
cd -

git worktree remove "$TEMP_DIR" --force 2>/dev/null || true

echo ""
echo "=== Client branch ready ==="
echo ""
echo "Next steps:"
echo ""
echo "  Option A — Git worktree (recommended for multi-client):"
echo "    git worktree add ../clients/${SLUG} ${BRANCH}"
echo "    cd ../clients/${SLUG}"
echo ""
echo "  Option B — Checkout in this workspace:"
echo "    git checkout ${BRANCH}"
echo ""
echo "  Then start the build workflow in Claude."
