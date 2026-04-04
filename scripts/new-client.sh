#!/usr/bin/env bash
#
# Usage:
#   bash scripts/new-client.sh <client-slug> [--ref <url>]
#   bash scripts/new-client.sh <client-slug> --concept <name> [--ref <url>]
#
# Creates a new client branch from main, or a concept branch from a client branch.
# Safe to run from any branch. Does NOT switch your working tree.
#
# Examples:
#   bash scripts/new-client.sh little-campus
#   bash scripts/new-client.sh little-campus --ref https://littlecampus.com
#   bash scripts/new-client.sh little-campus --concept bold-colors
#   bash scripts/new-client.sh little-campus --concept minimal --ref https://example.com/minimal
#
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage:"
  echo "  bash scripts/new-client.sh <client-slug> [--ref <url>]"
  echo "  bash scripts/new-client.sh <client-slug> --concept <name> [--ref <url>]"
  echo ""
  echo "  <client-slug>       Lowercase kebab-case identifier (e.g. little-campus)"
  echo "  --concept <name>    Create a concept/option branch off the client branch"
  echo "  --ref <url>         Optional reference URL for design direction"
  exit 1
fi

SLUG="$1"
REF_URL="null"
CONCEPT=""
shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref)
      REF_URL="\"$2\""
      shift 2
      ;;
    --concept)
      CONCEPT="$2"
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

if [ -n "$CONCEPT" ]; then
  if ! echo "$CONCEPT" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
    echo "Error: concept name must be lowercase kebab-case (e.g. bold-colors)"
    exit 1
  fi

  CLIENT_BRANCH="client/${SLUG}"
  BRANCH="client/${SLUG}/concept/${CONCEPT}"
  BASE_REF="$CLIENT_BRANCH"

  echo "=== New Concept Branch ==="
  echo "  Client:  $SLUG"
  echo "  Concept: $CONCEPT"
  echo "  Branch:  $BRANCH"
  echo "  Base:    $CLIENT_BRANCH"
else
  BRANCH="client/${SLUG}"
  BASE_REF="origin/main"

  echo "=== New Client Setup ==="
  echo "  Slug:   $SLUG"
  echo "  Branch: $BRANCH"
fi
echo ""

git fetch origin main

if [ -n "$CONCEPT" ]; then
  git fetch origin "$CLIENT_BRANCH" 2>/dev/null || true
  if ! git show-ref --verify --quiet "refs/heads/${CLIENT_BRANCH}" 2>/dev/null && \
     ! git show-ref --verify --quiet "refs/remotes/origin/${CLIENT_BRANCH}" 2>/dev/null; then
    echo "Error: Client branch '${CLIENT_BRANCH}' not found. Create the client first."
    exit 1
  fi

  if ! git show-ref --verify --quiet "refs/heads/${CLIENT_BRANCH}" 2>/dev/null; then
    git branch "$CLIENT_BRANCH" "origin/${CLIENT_BRANCH}"
  fi
  BASE_REF="$CLIENT_BRANCH"
fi

if git show-ref --verify --quiet "refs/heads/${BRANCH}" 2>/dev/null || \
   git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}" 2>/dev/null; then
  echo "Error: Branch '${BRANCH}' already exists."
  exit 1
fi

git branch "$BRANCH" "$BASE_REF"
echo "Created branch: $BRANCH"

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

git worktree add "$TEMP_DIR" "$BRANCH" --quiet

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PRETTY_NAME=$(echo "$SLUG" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

if [ -n "$CONCEPT" ]; then
  PRETTY_CONCEPT=$(echo "$CONCEPT" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
  cat > "$TEMP_DIR/src/data/client.json" <<EOF
{
  "clientId": "${SLUG}",
  "clientName": "${PRETTY_NAME}",
  "branch": "${BRANCH}",
  "isBase": false,
  "isConcept": true,
  "conceptName": "${PRETTY_CONCEPT}",
  "parentBranch": "${CLIENT_BRANCH}",
  "referenceUrl": ${REF_URL},
  "deploy": {
    "provider": null,
    "projectId": null,
    "productionBranch": null,
    "url": null
  },
  "createdAt": "${NOW}",
  "notes": "Concept: ${PRETTY_CONCEPT} for ${PRETTY_NAME}"
}
EOF
else
  cat > "$TEMP_DIR/src/data/client.json" <<EOF
{
  "clientId": "${SLUG}",
  "clientName": "${PRETTY_NAME}",
  "branch": "${BRANCH}",
  "isBase": false,
  "isConcept": false,
  "conceptName": null,
  "parentBranch": null,
  "referenceUrl": ${REF_URL},
  "deploy": {
    "provider": null,
    "projectId": null,
    "productionBranch": null,
    "url": null
  },
  "createdAt": "${NOW}",
  "notes": ""
}
EOF
fi

cat > "$TEMP_DIR/src/data/build-state.json" <<EOF
{
  "stage": "not-started",
  "completedStages": [],
  "currentCohort": 0,
  "cohorts": {},
  "sitemapApproved": false,
  "styleTileApproved": false,
  "notes": "Client: ${PRETTY_NAME}$([ -n "$CONCEPT" ] && echo " — Concept: ${PRETTY_CONCEPT}")"
}
EOF

cd "$TEMP_DIR"
git add src/data/client.json src/data/build-state.json

if [ -n "$CONCEPT" ]; then
  git commit -m "initialize concept: ${PRETTY_CONCEPT} for ${PRETTY_NAME}"
else
  git commit -m "initialize client: ${PRETTY_NAME}"
fi

cd -

git worktree remove "$TEMP_DIR" --force 2>/dev/null || true

echo ""
echo "=== Branch ready ==="
echo ""
echo "Next steps:"
echo ""

if [ -n "$CONCEPT" ]; then
  echo "  Set up worktree:"
  echo "    git worktree add ../clients/${SLUG}--${CONCEPT} ${BRANCH}"
  echo "    cd ../clients/${SLUG}--${CONCEPT}"
  echo "    npm install"
  echo ""
  echo "  When the client picks this concept, merge it into the main client branch:"
  echo "    git checkout ${CLIENT_BRANCH}"
  echo "    git merge ${BRANCH}"
else
  echo "  Option A — Git worktree (recommended for multi-client):"
  echo "    git worktree add ../clients/${SLUG} ${BRANCH}"
  echo "    cd ../clients/${SLUG}"
  echo "    npm install"
  echo ""
  echo "  Option B — Checkout in this workspace:"
  echo "    git checkout ${BRANCH}"
  echo ""
  echo "  Create concept branches for design options:"
  echo "    bash scripts/new-client.sh ${SLUG} --concept bold-colors"
  echo "    bash scripts/new-client.sh ${SLUG} --concept minimal"
fi
