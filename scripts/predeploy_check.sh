#!/usr/bin/env bash
set -euo pipefail
ASSET_VERSION="${ASSET_VERSION:-2026-06-27-commit6}"
BUILD_DIR="${BUILD_DIR:-/tmp/adjoint-site-build}"

node --check docs/assets/site.js
node --input-type=module --check < serverless/translate-proxy/worker.js
python3 -m py_compile scripts/build_site.py scripts/check_site.py
python3 -m json.tool docs/assets/i18n.ar.json >/dev/null
python3 -m json.tool site/i18n/ar.json >/dev/null
python3 -m json.tool site/site_manifest.json >/dev/null
python3 scripts/check_site.py --root docs --asset-version "${ASSET_VERSION}"
rm -rf "${BUILD_DIR}"
python3 scripts/build_site.py --output "${BUILD_DIR}" --clean
page_count="$(find "${BUILD_DIR}" -name index.html | wc -l | tr -d ' ')"
if [[ "${page_count}" != "40" ]]; then
  echo "expected 40 generated pages, got ${page_count}" >&2
  exit 1
fi
if [[ ! -f "${BUILD_DIR}/assets/i18n.ar.json" ]]; then
  echo "missing generated Arabic i18n asset" >&2
  exit 1
fi
echo "predeploy checks passed (${page_count} generated pages)"
