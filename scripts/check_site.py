#!/usr/bin/env python3
"""Validate generated GitHub Pages output for links, cache-busted assets, and basic a11y hooks."""
from __future__ import annotations

import argparse, re, sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', default='docs')
    parser.add_argument('--asset-version', required=True)
    args = parser.parse_args()
    root = Path(args.root)
    pages = sorted(root.glob('**/index.html'))
    errors: list[str] = []
    if not pages:
        errors.append('no index.html pages found')
    for page in pages:
        html = page.read_text(encoding='utf-8')
        rel = page.relative_to(root)
        if 'class="skip-link"' not in html:
            errors.append(f'{rel}: missing skip link')
        if 'id="main-content"' not in html:
            errors.append(f'{rel}: missing main-content target')
        if f'site.css?v={args.asset_version}' not in html:
            errors.append(f'{rel}: missing cache-busted CSS')
        if f'site.js?v={args.asset_version}' not in html:
            errors.append(f'{rel}: missing cache-busted JS')
        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith(('http', '#', 'mailto:')) or href.endswith(('.css', '.svg', '.zip', '.sha256')) or '.css?v=' in href:
                continue
            target = (page.parent / href).resolve()
            if href.endswith('/'):
                target = target / 'index.html'
            if not target.exists():
                errors.append(f'{rel}: missing href target {href}')
    for required in ['assets/site.css', 'assets/site.js', 'assets/i18n.ar.json', 'assets/search-index.json', 'sitemap.xml', 'robots.txt']:
        if not (root / required).exists():
            errors.append(f'missing required output {required}')
    if errors:
        print('\n'.join(errors))
        return 1
    print(f'checked {len(pages)} pages; site output ok')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
