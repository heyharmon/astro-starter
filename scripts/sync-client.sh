#!/usr/bin/env bash
#
# Usage: bash scripts/sync-client.sh [<client-slug>]
#
# Merges the latest main into a client branch.
#
# If <client-slug> is provided, operates on client/<slug>.
# If omitted, reads the current branch from client.json.
#
# Safe to run from any branch — uses a temporary worktree to perform the merge
# so your current working directory is not affected.
#
# Examples:
#   bash scripts/sync-client.sh little-campus
#   cd ../clients/little-campus && bash scripts/sync-client.sh
#
set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)

if [ $# -ge 1 ]; then
  SLUG="$1"
  BRANCH="client/${SLUG}"
else
  CLIENT_JSON="${REPO_ROOT}/src/data/client.json"
  if [ ! -f "$CLIENT_JSON" ]; then
    echo "Error: No client slug provided and no client.json found."
    exit 1
  fi
  IS_BASE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('${CLIENT_JSON}','utf8')).isBase)")
  if [ "$IS_BASE" = "true" ]; then
    echo "Error: You are on the base/main branch. Provide a client slug."
    echo "Usage: bash scripts/sync-client.sh <client-slug>"
    exit 1
  fi
  BRANCH=$(node -e "console.log(JSON.parse(require('fs').readFileSync('${CLIENT_JSON}','utf8')).branch)")
  SLUG=$(node -e "console.log(JSON.parse(require('fs').readFileSync('${CLIENT_JSON}','utf8')).clientId)")
fi

echo "=== Syncing client: ${SLUG} ==="
echo "  Branch: ${BRANCH}"
echo ""

git fetch origin main
git fetch origin "${BRANCH}" 2>/dev/null || true

if ! git show-ref --verify --quiet "refs/heads/${BRANCH}" 2>/dev/null && \
   ! git show-ref --verify --quiet "refs/remotes/origin/${BRANCH}" 2>/dev/null; then
  echo "Error: Branch '${BRANCH}' not found locally or on remote."
  exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/${BRANCH}" 2>/dev/null; then
  git branch "${BRANCH}" "origin/${BRANCH}"
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "$BRANCH" ]; then
  echo "Already on ${BRANCH}, merging main directly..."
  git merge origin/main --no-edit
  echo ""
  echo "=== Sync complete (direct merge) ==="
  exit 0
fi

TEMP_DIR=$(mktemp -d)
trap 'git worktree remove "$TEMP_DIR" --force 2>/dev/null || true; rm -rf "$TEMP_DIR"' EXIT

git worktree add "$TEMP_DIR" "$BRANCH" --quiet
cd "$TEMP_DIR"

if git merge origin/main --no-edit; then
  echo ""
  echo "=== Sync complete ==="
  echo "Merged main into ${BRANCH} successfully."
else
  echo ""
  echo "=== Merge conflicts detected ==="
  echo "Resolve conflicts in: $TEMP_DIR"
  echo "Then commit and remove the worktree:"
  echo "  cd $TEMP_DIR"
  echo "  # resolve conflicts"
  echo "  git add . && git commit"
  echo "  cd - && git worktree remove $TEMP_DIR"
  trap - EXIT
  exit 1
fi
