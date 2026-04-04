#!/usr/bin/env bash
#
# Lists all client branches and their worktree status.
#
set -euo pipefail

echo "=== Client Branches ==="
echo ""

git fetch --all --quiet 2>/dev/null || true

BRANCHES=$(git branch -a --list '*client/*' | sed 's/^[ *]*//' | sed 's|remotes/origin/||' | sort -u)

if [ -z "$BRANCHES" ]; then
  echo "No client branches found."
  echo "Create one with: bash scripts/new-client.sh <slug>"
  exit 0
fi

WORKTREES=$(git worktree list --porcelain 2>/dev/null | grep "^worktree " | sed 's/^worktree //')

printf "%-25s %-15s %s\n" "BRANCH" "WORKTREE" "LAST COMMIT"
printf "%-25s %-15s %s\n" "------" "--------" "-----------"

for BRANCH in $BRANCHES; do
  WT="none"
  for W in $WORKTREES; do
    WT_BRANCH=$(git -C "$W" branch --show-current 2>/dev/null || echo "")
    if [ "$WT_BRANCH" = "$BRANCH" ]; then
      WT="$W"
      break
    fi
  done

  REF="refs/heads/${BRANCH}"
  if ! git show-ref --verify --quiet "$REF" 2>/dev/null; then
    REF="refs/remotes/origin/${BRANCH}"
  fi

  LAST_COMMIT=$(git log -1 --format="%h %s" "$REF" 2>/dev/null | head -c 60)

  printf "%-25s %-15s %s\n" "$BRANCH" "$WT" "$LAST_COMMIT"
done
echo ""
