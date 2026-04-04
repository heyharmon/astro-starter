# Deployment

Client sites deploy to Vercel. Each client gets its own Vercel project with the `client/<slug>` branch as its production branch. Concept branches deploy as previews.

## Overview

```
client/acme-corp          → Vercel project "acme-corp"  → acme-corp.vercel.app (production)
client/acme-corp/concept/modern → same project          → preview URL (preview)
client/acme-corp/concept/bold   → same project          → preview URL (preview)
```

## First-Time Setup

### 1. Create the Vercel project

From the client worktree:

```bash
cd ../clients/acme-corp
vercel link --yes
```

Or ask the deploy agent: "Set up Vercel for Acme Corp".

### 2. Record the project ID

After linking, the project ID is in `.vercel/project.json`. Update `src/data/client.json`:

```json
{
  "deploy": {
    "provider": "vercel",
    "projectId": "prj_xxxxxxxxxxxxxxxx",
    "productionBranch": "client/acme-corp",
    "url": "https://acme-corp.vercel.app"
  }
}
```

### 3. Set up GitHub secrets

In your GitHub repository settings, add:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Your Vercel API token |
| `VERCEL_ORG_ID` | Your Vercel org/team ID |

The project ID comes from `client.json` (set per-branch), so no per-client secrets are needed.

## Deploying

### Manual deploy

```bash
cd ../clients/acme-corp
npm run build
vercel deploy --prod
```

### Automated deploy (GitHub Actions)

The workflow at `.github/workflows/deploy-client.yml` auto-deploys on push to any `client/**` branch:

- Reads `client.json` for the Vercel project ID
- Detects whether the branch is a primary client branch or a concept branch
- Primary branches → production deploy (`--prod`)
- Concept branches → preview deploy (preview URL)
- Comments the deploy URL on the commit

Push and it deploys:

```bash
cd ../clients/acme-corp
git add . && git commit -m "update homepage"
git push
# GitHub Actions handles the deploy
```

## Concept Branch Previews

Concept branches get Vercel preview URLs — not production deploys. Share these with the client for side-by-side comparison.

The GitHub Actions workflow auto-detects concepts (`isConcept: true` in `client.json`) and deploys them as previews.

## Custom Domains

After the initial deploy:

1. In the Vercel dashboard, add the client's custom domain to their project
2. Update DNS records as Vercel instructs
3. Update `client.json` with the production URL:
   ```json
   {
     "deploy": {
       "url": "https://acmecorp.com"
     }
   }
   ```
4. Update `site-meta.json` with the same URL (used for canonical URLs and OG tags)

## Vercel CLI and Git Worktrees

The Vercel CLI has a known bug with git worktrees (the `.git` file in a worktree is a pointer, not a directory). As of early 2026 this is still being patched.

### Workarounds

1. **GitHub Actions** (recommended): Push to the branch and let CI deploy. No worktree issue since CI checks out normally.
2. **`vercel deploy --prebuilt`**: Build locally first with `vercel build`, then deploy the pre-built output.
3. **Deploy from main repo**: Temporarily check out the client branch in the main repo directory for the deploy.

## Environment Variables

For Vercel environment variables (API keys, third-party service tokens):

```bash
cd ../clients/acme-corp
vercel env add SECRET_NAME
```

Or configure in the Vercel dashboard under the client's project settings.

## Troubleshooting

### Build fails on Vercel but works locally

- Check that `astro.config.mjs` has the `site` property set (should match `site-meta.json` URL)
- Ensure all dependencies are in `package.json` (not just globally installed)
- Check Node.js version in Vercel project settings (should be 20+)

### Deploy goes to wrong project

- Verify `src/data/client.json` has the correct `deploy.projectId`
- Check that `.vercel/project.json` matches (if deploying via CLI)
- For GitHub Actions, the project ID comes from `client.json` in the branch being pushed

### Preview URL not generated for concept

- Verify `client.json` has `isConcept: true` on the concept branch
- Check that the parent client has a Vercel project linked
- Concept branches must use the same Vercel project as their parent client
