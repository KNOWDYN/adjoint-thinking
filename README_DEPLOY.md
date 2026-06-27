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
