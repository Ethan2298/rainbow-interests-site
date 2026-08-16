#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVE_ROOT="${RAINBOW_SITE_ROOT:-/tmp/rainbow-interests-site}"
cd "$ROOT"

required=(
  index.html
  locations.html
  contact.html
  vision.html
  privacy.html
  terms.html
  legal.css
  logo-dark.svg
  grain.png
  hero-bg.png
)

for file in "${required[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing required site file: $file" >&2
    exit 1
  fi
  if [[ ! -s "$file" ]]; then
    echo "required site file is empty: $file" >&2
    exit 1
  fi
done

grep -q "Rainbow Interests" index.html
grep -q "Franchise Operations" index.html
grep -q "The NOW Massage Fort Lauderdale" locations.html
grep -q "danny.figueroa@thenowmassage.com" contact.html
grep -q "Our Vision" vision.html
grep -q "Privacy Policy" privacy.html
grep -q "Terms of Service" terms.html

python3 -m py_compile .cursor/serve-site.py

rm -rf "$SERVE_ROOT"
mkdir -p "$SERVE_ROOT"
for file in "${required[@]}"; do
  cp -f "$file" "$SERVE_ROOT/"
done
for extra in paper-texture.png noise-texture.png; do
  if [[ -f "$extra" ]]; then
    cp -f "$extra" "$SERVE_ROOT/"
  fi
done
chmod -R a+rX "$SERVE_ROOT"

echo "install ok: copied public site files to $SERVE_ROOT"
