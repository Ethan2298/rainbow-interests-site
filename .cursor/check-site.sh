#!/usr/bin/env bash
set -euo pipefail

BASE="${RAINBOW_SITE_URL:-http://127.0.0.1:8080}"
body="$(mktemp)"
trap 'rm -f "$body"' EXIT

expect() {
  local path="$1"
  local want="$2"
  local code
  code="$(curl -sS -o "$body" -w "%{http_code}" "$BASE$path")"
  if [[ "$code" != "$want" ]]; then
    echo "FAIL $path expected HTTP $want, got $code" >&2
    exit 1
  fi
}

require() {
  local path="$1"
  local pattern="$2"
  if ! grep -q "$pattern" "$body"; then
    echo "FAIL $path missing: $pattern" >&2
    exit 1
  fi
}

forbid() {
  local path="$1"
  local pattern="$2"
  if grep -q "$pattern" "$body"; then
    echo "FAIL $path still contains: $pattern" >&2
    exit 1
  fi
}

expect "/" 200
require "/" "Rainbow Interests"
require "/" "Franchise Operations"
require "/" 'href="site.css"'
require "/" 'src="site.js"'
require "/" "document.documentElement.classList.add('js')"
forbid "/" 'class="paper"'
forbid "/" "paper-texture"

expect "/locations.html" 200
require "/locations.html" "The NOW Massage Fort Lauderdale"
require "/locations.html" 'href="site.css"'
require "/locations.html" 'src="site.js"'
forbid "/locations.html" 'class="paper"'

expect "/contact.html" 200
require "/contact.html" "danny.figueroa@thenowmassage.com"
require "/contact.html" "(786) 223-9529"
require "/contact.html" 'href="site.css"'
require "/contact.html" 'src="site.js"'
require "/contact.html" 'href="legal.css"'
forbid "/contact.html" 'class="paper"'

expect "/vision.html" 200
require "/vision.html" 'href="site.css"'
require "/vision.html" 'src="site.js"'

expect "/privacy.html" 200
require "/privacy.html" 'href="site.css"'
require "/privacy.html" 'src="site.js"'
require "/privacy.html" "private QuickBooks integration"
require "/privacy.html" "OAuth authorization"
require "/privacy.html" "Intuit and QuickBooks are registered trademarks"
forbid "/privacy.html" 'class="paper"'

expect "/terms.html" 200
require "/terms.html" 'href="site.css"'
require "/terms.html" 'src="site.js"'
require "/terms.html" "Private QuickBooks integration"
require "/terms.html" "official Intuit CLI"
require "/terms.html" "Intuit and QuickBooks are registered trademarks"
forbid "/terms.html" 'class="paper"'

expect "/quickbooks.html" 200
require "/quickbooks.html" 'href="site.css"'
require "/quickbooks.html" 'src="site.js"'
require "/quickbooks.html" "document.documentElement.classList.add('js')"
require "/quickbooks.html" "noindex, nofollow"
require "/quickbooks.html" "Private internal use"
require "/quickbooks.html" "quickbooks-connect.html"
require "/quickbooks.html" "quickbooks-disconnect.html"
require "/quickbooks.html" "Intuit and QuickBooks are registered trademarks"
forbid "/quickbooks.html" 'class="paper"'

expect "/quickbooks-connect.html" 200
require "/quickbooks-connect.html" 'href="site.css"'
require "/quickbooks-connect.html" 'src="site.js"'
require "/quickbooks-connect.html" "noindex, nofollow"
require "/quickbooks-connect.html" "Connect or reconnect QuickBooks"
require "/quickbooks-connect.html" "Intuit and QuickBooks are registered trademarks"
forbid "/quickbooks-connect.html" 'class="paper"'

expect "/quickbooks-disconnect.html" 200
require "/quickbooks-disconnect.html" 'href="site.css"'
require "/quickbooks-disconnect.html" 'src="site.js"'
require "/quickbooks-disconnect.html" "noindex, nofollow"
require "/quickbooks-disconnect.html" "Disconnect QuickBooks"
require "/quickbooks-disconnect.html" "Intuit and QuickBooks are registered trademarks"
forbid "/quickbooks-disconnect.html" 'class="paper"'

expect "/site.css" 200
require "/site.css" "html.js .nav-hamburger"
require "/site.css" "html:not(.js) .nav-links"
require "/site.css" "body.nav-open"
require "/site.css" "trademark-notice"
python3 - "$body" <<'PY'
from pathlib import Path
import re
import sys
css = Path(sys.argv[1]).read_text()
match = re.search(r"(?m)^\.page \{([^}]+)\}", css)
if not match:
    raise SystemExit("FAIL /site.css .page rule missing")
if "overflow" in match.group(1):
    raise SystemExit("FAIL /site.css .page must not set overflow")
PY

expect "/site.js" 200
require "/site.js" "e.key === 'Escape'"
require "/site.js" "aria-expanded"
require "/site.js" "inert"

expect "/legal.css" 200
require "/legal.css" "legal-main a"
require "/legal.css" "text-decoration: underline"
require "/legal.css" "trademark-notice"
forbid "/legal.css" "[.]paper"

expect "/logo-dark.svg" 200
expect "/hero-bg.png" 200

expect "/.git/config" 404
expect "/.git/HEAD" 404
expect "/.git/index" 404
expect "/../.git/config" 404
expect "/nope.html" 404

echo "site checks passed against $BASE"
