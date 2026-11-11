#!/usr/bin/env bash
# Local CI for the sapardo10 site. Run on the committed head. No CI exists and the site has no build; this is a syntax sanity check only.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
echo "Local CI on $(git rev-parse --short HEAD)"
[ -z "$(git status --porcelain)" ] || { echo "Uncommitted changes: commit first"; exit 1; }
for f in *.js; do node --check "$f"; done
test -s app-ads.txt
echo "Local CI: PASS"
