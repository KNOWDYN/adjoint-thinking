# Site Predeployment Report

Date: 2026-06-27
Pages output: `docs/`
Asset version: `2026-06-27-commit6`
Status: **PASS WITH WARNINGS**

## What was validated

- JavaScript syntax for `docs/assets/site.js`.
- Cloudflare Worker module syntax for `serverless/translate-proxy/worker.js`.
- Python syntax for `scripts/build_site.py` and `scripts/check_site.py`.
- JSON validity for deployed and source i18n/manifest files.
- Current `docs/` output for skip links, `main-content` targets, cache-busted CSS/JS, required assets, and internal links.
- Disposable static build to `/tmp/adjoint-site-build`.
- Generated page count: 40 `index.html` files.
- Generated Arabic i18n asset presence.

## Commands

```sh
bash scripts/predeploy_check.sh
```

The script runs the individual syntax, JSON, output, link, and disposable-build checks required before GitHub Pages deployment.

## Deployment readiness

The site is ready for GitHub Pages deployment from `docs/` with the warnings below.

## Warnings

- Browser screenshot regression was not captured because browser automation is not installed in the container.
- Arabic support includes UI chrome and curated key strings; full professional Arabic translation for every page body is not complete.
- Machine translation is disabled until `translation_proxy` in `site/site_manifest.json` is set to a deployed serverless proxy URL.
- The source generator is intentionally minimal and should not be used to replace richer hand-generated content until generator parity is confirmed.

## Release decision

Proceed with deployment after reviewing the warnings and confirming GitHub Pages is configured to publish from the intended branch and `/docs` folder.
