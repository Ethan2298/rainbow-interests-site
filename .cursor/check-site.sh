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

expect "/" 200
grep -q "Rainbow Interests" "$body"
grep -q "Franchise Operations" "$body"

expect "/locations.html" 200
grep -q "The NOW Massage Fort Lauderdale" "$body"

expect "/contact.html" 200
grep -q "danny.figueroa@thenowmassage.com" "$body"
grep -q "(786) 223-9529" "$body"

expect "/vision.html" 200
expect "/privacy.html" 200
expect "/terms.html" 200
expect "/legal.css" 200
expect "/logo-dark.svg" 200
expect "/grain.png" 200
expect "/hero-bg.png" 200

expect "/.git/config" 404
expect "/.git/HEAD" 404
expect "/.git/index" 404
expect "/../.git/config" 404
expect "/nope.html" 404

echo "site checks passed against $BASE"
