---
description: Deploy the site to Vercel or set up the Vercel project.
---

# Vercel Deploy

## When to Use

- User wants to deploy the site to Vercel
- User wants to set up Vercel for the first time
- User wants to check deployment status or manage domains
- User wants to configure environment variables on Vercel

## Prerequisites

- Vercel CLI installed (`npm install -g vercel@latest`)
- Authenticated (`vercel login`) — or `VERCEL_TOKEN` env var set
- The site must build successfully (`npm run build`)

## Procedure: First-Time Setup

1. Read `src/data/site-meta.json` to get the site name and URL.
2. Verify the build passes:
   ```bash
   npm run build
   ```
3. Link the repo to a Vercel project:
   ```bash
   vercel link
   ```
4. The project ID is now stored in `.vercel/project.json` (gitignored). Vercel will use it automatically for subsequent deploys.

## Procedure: Deploy to Production

1. Verify the build:
   ```bash
   npm run build
   ```
2. Deploy:
   ```bash
   vercel deploy --prod
   ```
3. Report the production URL to the user.

## Procedure: Preview Deploy

1. For preview URLs (non-production):
   ```bash
   vercel deploy
   ```
2. Share the preview URL with the user for review.

## Procedure: Set Up GitHub Actions Auto-Deploy

1. Create a workflow under `.github/workflows/` that runs `vercel pull`, `vercel build`, and `vercel deploy --prebuilt --prod` on push to the production branch.
2. Ensure the repository has these secrets configured:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Push to the production branch to trigger a deploy.

## Troubleshooting

### Build fails on Vercel but works locally

- Check that `astro.config.mjs` has the `site` property set (read from `site-meta.json`)
- Ensure all dependencies are in `package.json` (not just globally installed)
- Check Node.js version compatibility in Vercel project settings

$ARGUMENTS
