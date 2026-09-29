#!/usr/bin/env sh
# Bundles the app into one self-contained HTML body (styles and scripts
# inlined), the form a claude.ai Artifact needs. Usage:
#   sh tools/build-single-file.sh > squad-trivia.html
set -e
cd "$(dirname "$0")/.."
sed -n '/<title>/,/display=swap/p' index.html
echo '<style>'; cat styles.css; echo '</style>'
echo '<main id="app" aria-live="polite"></main>'
for f in questions store app; do echo '<script>'; cat "js/$f.js"; echo '</script>'; done
