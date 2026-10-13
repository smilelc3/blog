#!/bin/bash
set -euo pipefail

config_path=$1
expr_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/site.yq"

yq --inplace --from-file "$expr_path" "$config_path"
