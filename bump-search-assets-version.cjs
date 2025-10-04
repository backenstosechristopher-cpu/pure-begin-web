// Bumps cache-busting version on injector and search asset script tags across all HTML files
// Usage: node bump-search-assets-version.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, 'public');
const version = Date.now().toString();

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.html')) out.push(full);
  }
  return out;
}

function bumpTag(srcMatch, p1, p2, p3) {
  // p1 = prefix up to .js, p2 = optional existing ?v=..., p3 = suffix with quote and rest
  return `${p1}?v=${version}${p3}`;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;

  // Ensure injector scripts are cache-busted
  content = content
    .replace(/(<script[^>]+src=["'][^"']*search-injector-desktop\.js)(\?v=[^"']*)?(["'][^>]*>)/gi, bumpTag)
    .replace(/(<script[^>]+src=["'][^"']*search-injector-mobile\.js)(\?v=[^"']*)?(["'][^>]*>)/gi, bumpTag)
    // Also bump direct asset references if present
    .replace(/(<script[^>]+src=["'][^"']*assets\/universal-search\.js)(\?v=[^"']*)?(["'][^>]*>)/gi, bumpTag)
    .replace(/(<script[^>]+src=["'][^"']*assets\/logo-redirect-fix\.js)(\?v=[^"']*)?(["'][^>]*>)/gi, bumpTag);

  if (content !== before) {
    fs.writeFileSync(file, content);
    return true;
  }
  return false;
}

function main() {
  const files = walk(ROOT);
  let updated = 0;
  for (const f of files) {
    try {
      if (processFile(f)) updated++;
    } catch (e) {
      console.error(`[bump-version] Error processing ${f}:`, e.message);
    }
  }
  console.log(`[bump-version] Version=${version} | HTML files scanned=${files.length} | updated=${updated}`);
  console.log('[bump-version] Done. Now hard refresh the Lovable preview.');
}

main();
