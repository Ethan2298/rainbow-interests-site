#!/usr/bin/env python3
"""Serve only public Rainbow Interests files. Never expose .git or other paths."""

from __future__ import annotations

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ALLOWED = frozenset(
    {
        "index.html",
        "locations.html",
        "contact.html",
        "vision.html",
        "privacy.html",
        "terms.html",
        "site.css",
        "legal.css",
        "logo-dark.svg",
        "grain.png",
        "hero-bg.png",
        "paper-texture.png",
        "noise-texture.png",
    }
)

HOST = os.environ.get("RAINBOW_SITE_HOST", "0.0.0.0")
PORT = int(os.environ.get("RAINBOW_SITE_PORT", "8080"))
ROOT = Path(os.environ.get("RAINBOW_SITE_ROOT", "/tmp/rainbow-interests-site")).resolve()


def public_name(url_path: str) -> str | None:
    rel = unquote(urlparse(url_path).path).lstrip("/")
    if rel == "":
        rel = "index.html"
    if "/" in rel or "\\" in rel or rel.startswith(".") or rel in {".", ".."}:
        return None
    if rel not in ALLOWED:
        return None
    return rel


class PublicSiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        super().log_message(format, *args)

    def do_GET(self):
        self._serve_public()

    def do_HEAD(self):
        self._serve_public()

    def do_POST(self):
        self.send_error(405, "Method Not Allowed")

    def _serve_public(self):
        name = public_name(self.path)
        if name is None:
            self.send_error(404, "Not Found")
            return
        target = (ROOT / name).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            self.send_error(404, "Not Found")
            return
        if not target.is_file():
            self.send_error(404, "Not Found")
            return
        self.path = "/" + name
        if self.command == "HEAD":
            super().do_HEAD()
            return
        super().do_GET()


def main() -> None:
    if not ROOT.is_dir():
        raise SystemExit(f"serve root missing: {ROOT} (run install first)")
    server = ThreadingHTTPServer((HOST, PORT), PublicSiteHandler)
    print(f"Serving {ROOT} on {HOST}:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
