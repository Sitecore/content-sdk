#!/usr/bin/env bash
# Live smoke call through the local SearchService against {edgeUrl}/v1/search.
# This imports packages/search/src (your branch), not a published package.
# Use keyphrase for keyword search, or seedid / seedurl for More Like This (MLT).
#
# Usage (from packages/search):
#   ./scratch/mlt-curl.sh keyphrase 'running shoes'
#   ./scratch/mlt-curl.sh seedid 'item-123'
#   ./scratch/mlt-curl.sh seedurl 'https://example.com/articles/cloud'
#
# Flag form (same meaning):
#   ./scratch/mlt-curl.sh --keyphrase 'running shoes'
#   ./scratch/mlt-curl.sh --seed-id 'item-123'
#   ./scratch/mlt-curl.sh --seed-url 'https://example.com/articles/cloud'
#
# Optional:
#   EDGE_URL   default https://edge-platform.sitecorecloud.io
#   LOCALE     e.g. en or fr-FR (omit for single-locale indexes)
#   LIMIT      default 10
#   OFFSET     default 0
#
# Reads the same scratch/.env as search-curl.sh and suggest-curl.sh.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

TSX="${PACKAGE_DIR}/node_modules/.bin/tsx"
if [[ ! -x "${TSX}" ]]; then
  echo "tsx is required to run the local SearchService. From the repo root run: yarn install" >&2
  exit 1
fi

export MLT_CLI_NAME="${0}"
exec "${TSX}" "${SCRIPT_DIR}/mlt.ts" "$@"
