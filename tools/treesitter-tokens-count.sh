#!/bin/bash

set -e

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"
cd "$PROJECT_DIR"

TERRAFORM_FILES=".*\.(tf|tfvars)$"
CDK8S_IGNORED_FILES="node_modules|help|snap|dist|snapshots|gitignore|prettierignore"

SCOPE="$1"

if [ "$SCOPE" = "terraform" ]; then
  tree-sitter parse $(find $PROJECT_DIR/src/$SCOPE -type f | grep -E "$TERRAFORM_FILES") | wc -l
elif [ "$SCOPE" = "cdk8s" ]; then
  tree-sitter parse $(find $PROJECT_DIR/src/$SCOPE -type f | grep -E -v "$CDK8S_IGNORED_FILES") | wc -l
else
  echo "Usage: $0 <scope>"
  echo "  scope: terraform|cdk8s"
  exit 1
fi
