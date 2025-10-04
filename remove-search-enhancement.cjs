#!/usr/bin/env node
/*
  Remove all occurrences of search-enhancement.js script tags from product pages
  - Scans public/desktop and public/mobile
  - Matches <script src="../search-enhancement.js"></script> and <script src="search-enhancement.js"></script>
  - Writes changes and logs stats
*/
const fs = require('fs');
const path = require('path');

function isHtmlTarget(name) {
  return name.startsWith('guthaben.de_') && name.endsWith('.html');
}

function stripEnhancerTags(html) {
  const re = /<script[^>]*src=["'](?:\.\.\/)?search-enhancement\.js["'][^>]*>\s*<\/script>\s*/gi;
  return html.replace(re, '');
}

function processDir(dirPath) {
  const abs = path.resolve(dirPath);
  if (!fs.existsSync(abs)) return { dir: dirPath, updated: 0, skipped: 0, errors: 0 };
  const files = fs.readdirSync(abs);
  let updated = 0, skipped = 0, errors = 0;

  for (const file of files) {
    if (!isHtmlTarget(file)) continue;
    const fp = path.join(abs, file);
    try {
      const original = fs.readFileSync(fp, 'utf8');
      if (!/search-enhancement\.js/i.test(original)) { skipped++; continue; }
      const modified = stripEnhancerTags(original)
        // collapse excessive blank lines that may remain
        .replace(/\n{3,}/g, '\n\n');
      if (modified !== original) {
        fs.writeFileSync(fp, modified, 'utf8');
        updated++;
      } else {
        skipped++;
      }
    } catch (e) {
      errors++;
      console.error('[remove-search-enhancement] Error processing', fp, e.message);
    }
  }

  return { dir: dirPath, updated, skipped, errors };
}

function main() {
  const targets = ['public/desktop', 'public/mobile'];
  const results = targets.map(processDir);
  console.log('[remove-search-enhancement] Summary:');
  for (const r of results) {
    console.log(`  - ${r.dir}: updated=${r.updated}, skipped=${r.skipped}, errors=${r.errors}`);
  }
  const totalUpdated = results.reduce((a,b)=>a+b.updated,0);
  if (totalUpdated > 0) {
    console.log(`[remove-search-enhancement] Done. Removed search-enhancement.js from ${totalUpdated} pages.`);
  } else {
    console.log('[remove-search-enhancement] No pages required changes.');
  }
}

if (require.main === module) main();
