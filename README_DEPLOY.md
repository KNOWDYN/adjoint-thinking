# Adjoint Thinking Scenario Companion Site v1.0.0

This repository publishes a static GitHub Pages site from `/docs`.

## Source of truth

The site should not be maintained by hand-editing the generated HTML pages in `/docs`.

Use these source files instead:

- `source/quartz-content-vault/**/*.md` — editable page content.
- `site/site_manifest.json` — site title, version, navigation, source/output paths, and generated collection indexes.
- `site/templates/page.html` — shared HTML layout used by every generated page.
- `scripts/build_site.py` — dependency-free static site generator.
- `docs/assets/site.css` and `docs/assets/site.js` — shared browser assets that are copied/referenced by generated pages.

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

## Deploy

1. Build the site with `python3 scripts/build_site.py --clean`.
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

## Maintenance rule

When updating site structure, navigation, metadata, shared UI, or content, change the source files and rebuild. Treat `docs/**/index.html` and `docs/assets/search-index.json` as generated deployment output.

## Localization and machine translation

The site supports an English/Arabic locale switch in the shared frontend assets. The browser language is used only when the visitor has not selected a language preference. Arabic mode sets `lang="ar"`, `dir="rtl"`, localized UI chrome, and curated Arabic text replacements from `docs/assets/i18n.ar.json`.

The optional machine translation button is disabled unless `translation_proxy` in `site/site_manifest.json` is set to a deployed serverless proxy URL. Keep provider API keys out of GitHub Pages; use `serverless/translate-proxy/worker.js` or an equivalent backend proxy and keep the visible machine-translation notice enabled.

## Pre-deploy validation

After rebuilding, run:

```sh
python3 scripts/check_site.py --root docs --asset-version 2026-06-27-commit6
```

This checks that generated pages include skip-link accessibility hooks, cache-busted CSS/JS references, required assets, and resolvable internal links.

## Final predeployment gate

Run the complete gate before publishing:

```sh
bash scripts/predeploy_check.sh
```

Record the result in `audit/SITE_PREDEPLOYMENT_REPORT.md` and review any warnings before changing GitHub Pages settings or announcing the release.
