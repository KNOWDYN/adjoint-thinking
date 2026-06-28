#!/usr/bin/env python3
"""Validate generated static-site essentials before deployment."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
REQUIRED = [
    DOCS / "index.html",
    DOCS / "assets" / "site.css",
    DOCS / "assets" / "site.js",
    DOCS / "assets" / "search-index.json",
    DOCS / "assets" / "i18n.ar.json",
    DOCS / "sitemap.xml",
    DOCS / "robots.txt",
]

class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "a" and data.get("href"):
            self.links.append(data["href"] or "")
        if tag == "link" and data.get("href"):
            self.assets.append(data["href"] or "")
        if tag == "script" and data.get("src"):
            self.assets.append(data["src"] or "")


def local_path(page: Path, target: str) -> Path | None:
    clean = target.split("#", 1)[0].split("?", 1)[0]
    if not clean or clean.startswith(("mailto:", "tel:", "javascript:")) or urlparse(clean).scheme:
        return None
    base = page.parent
    if clean.startswith("/"):
        return DOCS / clean.lstrip("/")
    return (base / clean).resolve()


def main() -> int:
    errors: list[str] = []
    for path in REQUIRED:
        if not path.exists():
            errors.append(f"missing required file: {path.relative_to(ROOT)}")

    try:
        index = json.loads((DOCS / "assets" / "search-index.json").read_text(encoding="utf-8"))
        if not isinstance(index, list) or not index:
            errors.append("search index is empty or not a list")
    except Exception as exc:  # noqa: BLE001 - report validation failure without traceback noise
        errors.append(f"search index is invalid JSON: {exc}")

    try:
        ar = json.loads((DOCS / "assets" / "i18n.ar.json").read_text(encoding="utf-8"))
        if not isinstance(ar.get("text"), dict):
            errors.append("Arabic i18n catalog must contain a text object")
    except Exception as exc:  # noqa: BLE001
        errors.append(f"Arabic i18n catalog is invalid JSON: {exc}")

    for page in DOCS.rglob("*.html"):
        parser = LinkParser()
        parser.feed(page.read_text(encoding="utf-8"))
        text = page.read_text(encoding="utf-8")
        if "site.css?v=" not in text or "site.js?v=" not in text:
            errors.append(f"missing cache-busted assets in {page.relative_to(ROOT)}")
        for target in parser.assets:
            resolved = local_path(page, target)
            if resolved and not resolved.exists():
                errors.append(f"broken asset in {page.relative_to(ROOT)}: {target}")
        for target in parser.links:
            resolved = local_path(page, target)
            if resolved and not resolved.exists():
                errors.append(f"broken link in {page.relative_to(ROOT)}: {target}")

    if errors:
        print("Site validation failed:")
        print("\n".join(f"- {e}" for e in errors))
        return 1
    print("Site validation passed.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
