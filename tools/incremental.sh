#!/bin/bash

set -e

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"
cd "$PROJECT_DIR"

DIR="$1"
SCOPE="$2"

if [ ! -d "$PROJECT_DIR/data/$DIR" ] || [ "$SCOPE" != "terraform" ] && [ "$SCOPE" != "cdk8s" ]; then
  echo "Usage: $0 {dir} {scope}"
  echo "   dir: $(command ls -b "$PROJECT_DIR/data" | tr '\n' '|' | sed 's/|$//')"
  echo " scope: terraform|cdk8s"
  exit 1
fi

if [ "$SCOPE" != "terraform" ] && [ "$SCOPE" != "cdk8s" ]; then
  echo "Usage: $0 {terraform|cdk8s}"
  exit 1
fi

git apply --stat "$PROJECT_DIR/data/$DIR/$SCOPE.patch"