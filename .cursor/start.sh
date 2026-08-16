#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export RAINBOW_SITE_ROOT="${RAINBOW_SITE_ROOT:-/tmp/rainbow-interests-site}"
export RAINBOW_SITE_HOST="${RAINBOW_SITE_HOST:-0.0.0.0}"
export RAINBOW_SITE_PORT="${RAINBOW_SITE_PORT:-8080}"
export RAINBOW_SITE_URL="${RAINBOW_SITE_URL:-http://127.0.0.1:${RAINBOW_SITE_PORT}}"

if [[ ! -d "$RAINBOW_SITE_ROOT" ]]; then
  echo "serve root missing; running install" >&2
  "$ROOT/.cursor/install.sh"
fi

python3 "$ROOT/.cursor/serve-site.py" &
server_pid=$!

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT

ready=0
for _ in $(seq 1 50); do
  if curl -fsS -o /dev/null "$RAINBOW_SITE_URL/" 2>/dev/null; then
    ready=1
    break
  fi
  if ! kill -0 "$server_pid" 2>/dev/null; then
    echo "site server exited before becoming ready" >&2
    exit 1
  fi
  sleep 0.1
done

if [[ "$ready" -ne 1 ]]; then
  echo "site server did not become ready on $RAINBOW_SITE_URL" >&2
  exit 1
fi

"$ROOT/.cursor/check-site.sh"

trap - EXIT
wait "$server_pid"
