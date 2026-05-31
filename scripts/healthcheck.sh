#!/usr/bin/env bash
set -e

echo "=== Site Healthcheck ==="
echo ""

# 1. Check data files exist and are valid JSON
echo "Checking data files..."
for f in src/data/nav.json src/data/footer.json src/data/site-meta.json src/data/site-content.json; do
  if [ ! -f "$f" ]; then
    echo "FAIL: $f does not exist"
    exit 1
  fi
  node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" 2>/dev/null || { echo "FAIL: $f is not valid JSON"; exit 1; }
  echo "  OK: $f"
done
echo ""

# 2. Check required site-meta.json fields
echo "Checking required config fields..."
node -e "
const s = JSON.parse(require('fs').readFileSync('src/data/site-meta.json','utf8'));
const required = ['name','url','description'];
const missing = required.filter(k => !s[k]);
if (missing.length) { console.error('FAIL: Missing required fields in site-meta.json: ' + missing.join(', ')); process.exit(1); }
console.log('  OK: site-meta.json has all required fields');
"
echo ""

# 3. Check nav.json is non-empty array
echo "Checking navigation config..."
node -e "
const n = JSON.parse(require('fs').readFileSync('src/data/nav.json','utf8'));
if (!Array.isArray(n) || n.length === 0) { console.error('FAIL: nav.json must be a non-empty array'); process.exit(1); }
console.log('  OK: nav.json has ' + n.length + ' entries');
"
echo ""

# 4. Run Astro build
echo "Running astro build..."
npx astro build
echo ""

# 5. Check Claude subagent dependencies (warnings only — do not fail healthcheck)
echo "Checking Claude subagent dependencies..."

# Vercel CLI — used by the deploy agent
if ! command -v vercel >/dev/null 2>&1; then
  echo "  WARN: Vercel CLI not installed (deploy agent)."
  echo "        Install:  npm install -g vercel@latest"
  echo "        Login:    vercel login"
elif ! vercel whoami >/dev/null 2>&1; then
  echo "  WARN: Vercel CLI installed but not logged in (deploy agent)."
  echo "        Run:      vercel login"
else
  echo "  OK: Vercel CLI installed and authenticated ($(vercel whoami 2>/dev/null))"
fi

# playwright-cli — used by the shared browser skill (deploy, design, images, dev)
if ! command -v playwright-cli >/dev/null 2>&1; then
  echo "  WARN: playwright-cli not installed (browser skill: deploy, design, images, dev)."
  echo "        Install:  npm install -g @playwright/cli@latest"
  echo "        Then:     playwright-cli install --skills"
else
  echo "  OK: playwright-cli installed ($(playwright-cli --version 2>/dev/null | head -1))"
  # Chromium browser — required by playwright-cli for screenshots
  if [ ! -d "$HOME/Library/Caches/ms-playwright" ] && [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "  WARN: Playwright browsers not installed."
    echo "        Run:      playwright-cli install --skills"
  else
    echo "  OK: Playwright browser cache present"
  fi
fi

# UNSPLASH_ACCESS_KEY — used by the images agent's unsplash skill
if [ -z "$UNSPLASH_ACCESS_KEY" ]; then
  echo "  WARN: UNSPLASH_ACCESS_KEY not set (images agent: unsplash skill)."
  echo "        Get a key at https://unsplash.com/developers and export it in your shell."
else
  echo "  OK: UNSPLASH_ACCESS_KEY is set"
fi
echo ""

echo "=== Healthcheck passed ==="
