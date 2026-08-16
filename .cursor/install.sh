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
  site.css
  site.js
  legal.css
  logo-dark.svg
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

pages=(index.html locations.html contact.html vision.html privacy.html terms.html)
for page in "${pages[@]}"; do
  if ! grep -q 'href="site.css"' "$page"; then
    echo "missing site.css link: $page" >&2
    exit 1
  fi
  if ! grep -q 'src="site.js"' "$page"; then
    echo "missing site.js script: $page" >&2
    exit 1
  fi
  if ! grep -q "document.documentElement.classList.add('js')" "$page"; then
    echo "missing js class boot script: $page" >&2
    exit 1
  fi
  if grep -q 'class="paper"' "$page"; then
    echo "paper container still present: $page" >&2
    exit 1
  fi
done

grep -q "html.js .nav-hamburger" site.css
grep -q "html:not(.js) .nav-links" site.css
grep -q "legal-main a" legal.css
grep -q "e.key === 'Escape'" site.js
grep -q "aria-expanded" site.js
python3 - <<'PY'
from pathlib import Path
import re
css = Path("site.css").read_text()
match = re.search(r"(?m)^\.page \{([^}]+)\}", css)
if not match:
    raise SystemExit(".page rule missing")
if "overflow" in match.group(1):
    raise SystemExit(".page must not set overflow (breaks sticky nav)")
PY

python3 -m py_compile .cursor/serve-site.py

rm -rf "$SERVE_ROOT"
mkdir -p "$SERVE_ROOT"
for file in "${required[@]}"; do
  cp -f "$file" "$SERVE_ROOT/"
done
for extra in paper-texture.png noise-texture.png grain.png; do
  if [[ -f "$extra" ]]; then
    cp -f "$extra" "$SERVE_ROOT/"
  fi
done
chmod -R a+rX "$SERVE_ROOT"

echo "install ok: copied public site files to $SERVE_ROOT"
