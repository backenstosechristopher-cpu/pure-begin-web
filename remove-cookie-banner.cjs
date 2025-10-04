const fs = require('fs');
const path = require('path');

// Recursively collect all files in a directory
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walk(p));
    else results.push(p);
  }
  return results;
}

// Robust patterns to remove the cookie banner block
// 1) With explicit comments markers present
// 2) Generic fallback (any #cookiebanner wrapper)
const patterns = [
  /<div id="cookiebanner"[^>]*><!-- begin page 1 -->[\s\S]*?<!-- end page 2 --><\/div>/gi,
  /<div id="cookiebanner"[^>]*>[\s\S]*?<\/div>/gi,
];

function stripCookieBanner(content) {
  let changed = false;
  let before, after = content;
  for (let i = 0; i < 5; i++) { // repeat a few times in case of nested wrappers
    before = after;
    patterns.forEach((re) => {
      after = after.replace(re, () => {
        changed = true;
        return '';
      });
    });
    if (after === before) break;
  }
  return { changed, content: after };
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { changed, content } = stripCookieBanner(original);
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    const delta = original.length - content.length;
    console.log(`✓ Removed cookie banner from ${filePath} (−${delta} chars)`);
    return { changed: 1, saved: delta };
  }
  return { changed: 0, saved: 0 };
}

// TARGET: scan all HTML files under mobile/ (can be adjusted if needed)
const ROOT = 'mobile';
if (!fs.existsSync(ROOT)) {
  console.error(`Directory not found: ${ROOT}`);
  process.exit(1);
}

const files = walk(ROOT).filter((f) => f.toLowerCase().endsWith('.html'));
if (files.length === 0) {
  console.log('No HTML files found under mobile/.');
  process.exit(0);
}

console.log(`Scanning ${files.length} HTML file(s) under ${ROOT}/ ...`);
let totalChanged = 0;
let totalSaved = 0;
for (const file of files) {
  const { changed, saved } = processFile(file);
  totalChanged += changed;
  totalSaved += saved;
}

if (totalChanged > 0) {
  console.log(`\nDone. Cleaned ${totalChanged} file(s), removed ${totalSaved} character(s) in total.`);
} else {
  console.log('\nNo cookie banners found.');
}
