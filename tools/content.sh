#!/bin/bash

set -e

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"
cd "$PROJECT_DIR"

SCOPE="$1"

if [ "$SCOPE" != "terraform" ] && [ "$SCOPE" != "cdk8s" ]; then
  echo "Usage: $0 {terraform|cdk8s}"
  exit 1
fi

find "$PROJECT_DIR/data" -name "$SCOPE*-content.md" -type f -print0 | xargs -0 awk 1 | sort | uniq | wc -w
