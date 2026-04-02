#!/usr/bin/env bash
set -e

echo "=== Site Validation ==="
echo ""

# 1. Check data files exist and are valid JSON
echo "Checking data files..."
for f in src/data/nav.json src/data/footer.json src/data/site-meta.json; do
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

echo "=== Validation passed ==="
