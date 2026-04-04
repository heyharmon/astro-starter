---
description: Manage client branches, worktrees, concept branches, and main syncing.
---

# Worktree Manager

## When to Use

- User wants to create a new client workspace
- User wants to create concept/option branches for a client
- User wants to sync base updates from main into client branches
- User wants to list, archive, or clean up client worktrees
- User wants to merge an approved concept into the main client branch

## Procedures

### Create a New Client

```bash
bash scripts/new-client.sh <slug> [--ref <url>]
git worktree add ../clients/<slug> client/<slug>
cd ../clients/<slug>
npm install
```

Report to the user:
- Branch name: `client/<slug>`
- Worktree path: `../clients/<slug>`
- Next step: Open the worktree directory in Cursor to start the build workflow

### Create Concept Branches

Concept branches let the client choose between design/content options.

```bash
bash scripts/new-client.sh <slug> --concept <name>
git worktree add ../clients/<slug>--<name> client/<slug>/concept/<name>
cd ../clients/<slug>--<name>
npm install
```

Example — three style options for a client:
```bash
bash scripts/new-client.sh acme-corp --concept modern
bash scripts/new-client.sh acme-corp --concept classic
bash scripts/new-client.sh acme-corp --concept bold

git worktree add ../clients/acme-corp--modern client/acme-corp/concept/modern
git worktree add ../clients/acme-corp--classic client/acme-corp/concept/classic
git worktree add ../clients/acme-corp--bold client/acme-corp/concept/bold
```

Each concept gets its own worktree, its own `client.json` (with `isConcept: true`), and can be built independently. Deploy as Vercel previews for client comparison.

### Merge Approved Concept

When the client picks a concept:

```bash
cd ../clients/<slug>
git merge client/<slug>/concept/<chosen-name>
```

Then clean up rejected concepts:
```bash
git worktree remove ../clients/<slug>--<rejected>
git branch -d client/<slug>/concept/<rejected>
```

### Sync Main Updates

```bash
bash scripts/sync-client.sh <slug>
cd ../clients/<slug>
npm install
npm run build
```

If conflicts occur, resolve them following the merge conflict strategy in `CLIENT_WORKFLOW.md`.

To sync all clients at once:
```bash
for branch in $(git branch --list 'client/*' --format='%(refname:short)' | grep -v '/concept/'); do
  slug=$(echo "$branch" | sed 's|client/||')
  echo "Syncing $slug..."
  bash scripts/sync-client.sh "$slug"
done
```

### List Clients

```bash
bash scripts/list-clients.sh
```

### Archive a Client

```bash
git worktree remove ../clients/<slug>
```

The branch is preserved in the repo. Re-activate anytime:
```bash
git worktree add ../clients/<slug> client/<slug>
cd ../clients/<slug>
npm install
```

### Remove a Client Permanently

```bash
git worktree remove ../clients/<slug> 2>/dev/null
git branch -D client/<slug>
git push origin --delete client/<slug>
```

$ARGUMENTS
