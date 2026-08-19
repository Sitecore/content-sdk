# Shared .env loader for scratch SDK smoke scripts.
# Requires SCRIPT_DIR to be set by the caller.

ENV_FILE="${SCRIPT_DIR}/.env"

# This repo checks files out with CRLF, so strip carriage returns while loading
# .env — otherwise values leak a trailing \r into the request headers.
if [[ -f "${ENV_FILE}" ]]; then
  while IFS= read -r line || [[ -n "${line}" ]]; do
    line="${line%$'\r'}"
    line="${line#$'\xef\xbb\xbf'}"
    [[ -z "${line}" || "${line}" =~ ^[[:space:]]*# ]] && continue
    if [[ "${line}" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
      value="${BASH_REMATCH[2]}"
      value="${value%\"}"
      value="${value#\"}"
      value="${value%\'}"
      value="${value#\'}"
      export "${BASH_REMATCH[1]}=${value}"
    else
      echo "Ignoring unparsable line in ${ENV_FILE}: ${line}" >&2
    fi
  done < "${ENV_FILE}"
else
  echo "No .env found at ${ENV_FILE} — reading variables from the shell instead." >&2
fi
