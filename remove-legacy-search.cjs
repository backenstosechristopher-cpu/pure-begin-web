#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Removing legacy search script (assets/guthaben-search.js) from all pages...\n');

const LEGACY_REGEX = /<script[^>]*src=["'][^"']*guthaben-search\.js[^"']*["'][^>]*>\s*<\/script>/gi;

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!LEGACY_REGEX.test(content)) return { changed: false };
    const cleaned = content.replace(LEGACY_REGEX, '');
    fs.writeFileSync(filePath, cleaned, 'utf-8');
    return { changed: true };
  } catch (e) {
    return { error: e.message };
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return { total: 0, changed: 0, errors: 0 };
  const entries = fs.readdirSync(dir);
  let stats = { total: 0, changed: 0, errors: 0 };
  entries.forEach((name) => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) return; // only HTML files at this level
    if (!/guthaben\.de.*\.html$/i.test(name)) return;
    stats.total++;
    const res = cleanFile(full);
    if (res.error) stats.errors++; else if (res.changed) stats.changed++;
  });
  return stats;
}

const dirs = ['public/desktop', 'public/mobile'];
let total = 0, changed = 0, errors = 0;
for (const d of dirs) {
  const s = scanDir(d);
  total += s.total; changed += s.changed; errors += s.errors;
  console.log(`📂 ${d} -> scanned: ${s.total}, removed: ${s.changed}, errors: ${s.errors}`);
}

console.log(`\n✅ Done. Removed legacy script from ${changed}/${total} files. Errors: ${errors}.`);
console.log('🔁 Please hard-refresh (Ctrl/Cmd+Shift+R). Test typing "life" — you should now see Lifecell.');
