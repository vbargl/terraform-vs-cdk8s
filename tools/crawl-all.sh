#!/bin/bash

set -e

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"

cd "$PROJECT_DIR/tools/crawler"
bun install
bun run crawl-all
