#!/usr/bin/env bash
# Live smoke call through the local SearchService against {edgeUrl}/v1/search/suggest.
# This imports packages/search/src (your branch), not a published package.
#
# Usage (from packages/search):
#   ./scratch/suggest-curl.sh 'running'
#
# Optional:
#   EDGE_URL   default https://edge-platform.sitecorecloud.io
#   LOCALE     e.g. en or fr-FR (omit for single-locale indexes)
#
# Reads the same scratch/.env as search-curl.sh and mlt-curl.sh.

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

export SUGGEST_CLI_NAME="${0}"
exec "${TSX}" "${SCRIPT_DIR}/suggest.ts" "$@"
