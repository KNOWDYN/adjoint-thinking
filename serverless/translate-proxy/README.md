# Optional machine translation proxy

This worker is an optional fallback for the static GitHub Pages site. Do not call translation providers directly from browser JavaScript because provider keys would be exposed.

## Provider

The example uses DeepL's text translation API with HTML tag handling enabled. Store secrets as worker environment variables.

Required variables:

- `DEEPL_API_KEY`

Optional variables:

- `DEEPL_API_ENDPOINT` — defaults to `https://api-free.deepl.com/v2/translate`.
- `ALLOWED_ORIGIN` — set to the production Pages origin instead of `*` before public deployment.

## Security rules

- Keep API keys server-side only.
- Add production rate limiting before launch.
- Add cache-by-content-hash before high-traffic use.
- Keep the UI notice that machine output is unreviewed.
- Do not translate code, prompt blocks, secrets, checksums, or legal text without review.

## Site wiring

Set `translation_proxy` in `site/site_manifest.json` to the deployed worker URL, then rebuild the site.
