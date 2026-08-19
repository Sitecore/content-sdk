#!/usr/bin/env bash
# Live smoke call through the local SearchService against {edgeUrl}/v1/search.
# This imports packages/search/src (your branch), not a published package.
#
# Usage (from packages/search):
#   ./scratch/search-curl.sh 'running'
#   ./scratch/search-curl.sh            # empty keyphrase (all results)
#
# Optional:
#   EDGE_URL   default https://edge-platform.sitecorecloud.io
#   LOCALE     e.g. en or fr-FR (omit for single-locale indexes)
#   LIMIT      default 10
#   OFFSET     default 0
#
# Reads the same scratch/.env as suggest-curl.sh and mlt-curl.sh.

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

export SEARCH_CLI_NAME="${0}"
exec "${TSX}" "${SCRIPT_DIR}/search.ts" "$@"
