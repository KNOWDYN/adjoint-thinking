#!/usr/bin/env bash
set -euo pipefail

python3 scripts/build_site.py --clean
python3 scripts/check_site.py
