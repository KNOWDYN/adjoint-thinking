# Adjoint Thinking Scenario Companion Site v1.0.0

This repository publishes a static GitHub Pages site from `/docs`.

## Source of truth

Do not maintain the site by hand-editing generated HTML in `/docs`. Use these source files instead:

- `source/quartz-content-vault/**/*.md` — editable page content.
- `site/site_manifest.json` — site title, version, navigation, source/output paths, generated collection indexes, cache-busting asset version, canonical base URL, and optional translation proxy URL.
- `site/templates/page.html` — shared HTML layout used by every generated page.
- `site/i18n/ar.json` — source Arabic localization catalog.
- `scripts/build_site.py` — dependency-free static site generator.
- `scripts/check_site.py` — generated-site validator.
- `scripts/predeploy_check.sh` — build plus validation wrapper for release checks.
- `docs/assets/site.css` and `docs/assets/site.js` — shared browser assets referenced by generated pages.
- `serverless/translate-proxy/` — optional server-side machine-translation fallback proxy.

## Build locally

From the repository root:

```sh
python3 scripts/build_site.py --clean
```

The build writes generated pages and the search index into `/docs` while preserving static deployment assets such as `/docs/assets`, `/docs/downloads`, `/docs/robots.txt`, and other existing non-generated files.

For a disposable validation build, write to a temporary directory:

```sh
python3 scripts/build_site.py --output /tmp/adjoint-site-build --clean
```

The generated template appends `?v={{ asset_version }}` to `site.css` and `site.js`. Update `asset_version` in `site/site_manifest.json` whenever browser asset changes must bypass caches.

## Localization and language switching

The site ships with English source content and an Arabic browser catalog:

1. Edit source content in `source/quartz-content-vault/`.
2. Update `site/i18n/ar.json` with exact source-string keys and Arabic values.
3. Rebuild with `python3 scripts/build_site.py --clean` so `docs/assets/i18n.ar.json` is refreshed when the build pipeline copies or regenerates assets.
4. Validate that the language selector sets `<html lang="ar" dir="rtl">` and that RTL layout, navigation, tables, callouts, search, and audience pathways remain usable.

`docs/assets/site.js` keeps the original English text nodes in memory, applies exact-match Arabic catalog entries, and restores English when the visitor switches back.

## Machine translation fallback

Machine translation is optional and must be routed through a server-side proxy. Do not expose provider keys in browser JavaScript.

- Proxy implementation: `serverless/translate-proxy/worker.js`.
- Proxy setup notes: `serverless/translate-proxy/README.md`.
- Manifest wiring: set `translation_proxy` in `site/site_manifest.json` to the deployed worker URL, then rebuild.

When the Arabic catalog cannot satisfy a request and a proxy URL is configured, `docs/assets/site.js` can request machine translation for the main content area. The UI labels this output as machine translated and unreviewed.

## Validation checks

Run the generated-site validator after building:

```sh
python3 scripts/check_site.py
```

`check_site.py` verifies required deployment files, JSON validity for search and i18n catalogs, cache-busted CSS/JS references, local asset references, and local links in generated HTML.

For the release path, run the predeploy wrapper:

```sh
scripts/predeploy_check.sh
```

`predeploy_check.sh` runs `python3 scripts/build_site.py --clean` and then `python3 scripts/check_site.py`.

## Deploy

1. Run `scripts/predeploy_check.sh`.
2. Commit the source changes and regenerated `/docs` output.
3. Push the branch.
4. In repository settings, open Pages.
5. Select deployment from branch, choose your main branch, and choose `/docs` as the publishing folder.
6. Save and wait for GitHub Pages to publish.

## Included

- Prebuilt static site in `docs/`.
- Editable Markdown source vault in `source/quartz-content-vault/`.
- Source vault ZIP in `source/quartz-content-vault.zip`.
- Environment Pack v1.0.0 in `docs/downloads/`.
- Search index and Arabic localization catalog in `docs/assets/`.
- Optional machine translation proxy in `serverless/translate-proxy/`.
- Release and local validation reports in `audit/`.

## Maintenance rule

When updating site structure, navigation, metadata, shared UI, browser behavior, localization, or content, change the source files and rebuild. Treat `docs/**/index.html`, `docs/assets/search-index.json`, and generated deployment metadata as generated output.
