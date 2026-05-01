---
description: Deploy a client site to Vercel or set up a new Vercel project.
---

# Vercel Deploy

## When to Use

- User wants to deploy a client site to Vercel
- User wants to set up Vercel for a new client
- User wants to check deployment status or manage domains
- User wants to configure environment variables on Vercel

## Prerequisites

- Vercel CLI installed (`npm install -g vercel@latest`)
- `VERCEL_TOKEN` environment variable set (or user provides interactively)
- `VERCEL_ORG_ID` environment variable set for CI/CD workflows
- The site must build successfully (`npm run build`)

## Procedure: First-Time Setup

1. Read `src/data/client.json` to get `clientId` and `clientName`.
2. Verify the build passes:
   ```bash
   npm run build
   ```
3. Create the Vercel project (if `deploy.projectId` is null):
   ```bash
   vercel link --yes
   ```
   Or for non-interactive setup:
   ```bash
   vercel project add <clientId> --framework astro
   ```
4. Note the project ID from `.vercel/project.json` after linking.
5. Update `src/data/client.json` with the deploy details:
   ```json
   {
     "deploy": {
       "provider": "vercel",
       "projectId": "<from .vercel/project.json>",
       "productionBranch": "client/<slug>",
       "url": "<assigned vercel URL>"
     }
   }
   ```
6. Commit the updated `client.json`.

## Procedure: Deploy to Production

1. Ensure you are on the correct client branch (check `client.json`).
2. Verify the build:
   ```bash
   npm run build
   ```
3. Deploy:
   ```bash
   vercel deploy --prod
   ```
4. Report the production URL to the user.

## Procedure: Preview Deploy (Concepts)

1. Concept branches get preview deploys (not production):
   ```bash
   vercel deploy
   ```
   (Omit `--prod` for preview URL)
2. Share the preview URL with the user for client review.

## Procedure: Set Up GitHub Actions Auto-Deploy

1. Check if `.github/workflows/deploy-client.yml` exists.
2. If not, create it using the template in `scripts/deploy-client-workflow.yml`.
3. Ensure the repository has these secrets configured:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID_<SLUG_UPPER>` (per-client project ID)
4. Push to the client branch to trigger a deploy.

## Troubleshooting

### ENOTDIR error in worktrees

The Vercel CLI may fail in git worktrees. Workarounds:
1. Build first with `npm run build`, then use `vercel deploy --prebuilt`
2. Use GitHub Actions instead of CLI for production deploys
3. Temporarily copy `.git` config: `cp $(cat .git | sed 's/gitdir: //') .git.bak` (not recommended)

### Build fails on Vercel but works locally

- Check that `astro.config.mjs` has the `site` property set (read from `site-meta.json`)
- Ensure all dependencies are in `package.json` (not just globally installed)
- Check Node.js version compatibility in Vercel project settings

$ARGUMENTS
