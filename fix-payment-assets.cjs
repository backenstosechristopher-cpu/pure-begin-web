// Fix weird ".Без названия" suffix in JS asset filenames and update references in public/desktop/payment.html
// Usage: node fix-payment-assets.cjs

const fs = require('fs');
const path = require('path');

const paymentHtmlPath = path.join('public', 'desktop', 'payment.html');
const assetsDir = path.join('public', 'desktop', 'Google Play gift code 5 code _ Guthaben_files');

function removeSuffix(filename) {
  // Only touch files that end with .js.Без названия
  const suffix = '.js.\u0411\u0435\u0437 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u044f';
  if (filename.endsWith(suffix)) {
    return filename.slice(0, -(' .js'.length + 'Без названия'.length)) + '.js';
  }
  return null;
}

function normalizeAssets() {
  if (!fs.existsSync(assetsDir)) {
    console.error(`Assets folder not found: ${assetsDir}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(assetsDir);
  let renamed = 0;

  for (const entry of entries) {
    // Detect any *.js.Без названия
    if (/\.js\.[\u0400-\u04FF\s]+$/.test(entry)) {
      // Create new name by trimming everything after the real .js
      const jsIndex = entry.indexOf('.js');
      const newName = entry.substring(0, jsIndex + 3); // keep .js
      const oldPath = path.join(assetsDir, entry);
      const newPath = path.join(assetsDir, newName);

      if (!fs.existsSync(newPath)) {
        fs.renameSync(oldPath, newPath);
        renamed++;
        console.log(`Renamed: ${entry} -> ${newName}`);
      } else {
        // If target exists, remove the weird-named duplicate to avoid confusion
        fs.unlinkSync(oldPath);
        console.log(`Removed duplicate: ${entry}`);
      }
    }
  }
  console.log(`Assets normalized. Renamed ${renamed} files.`);
}

function updatePaymentHtml() {
  if (!fs.existsSync(paymentHtmlPath)) {
    console.error(`payment.html not found at ${paymentHtmlPath}`);
    process.exit(1);
  }
  let html = fs.readFileSync(paymentHtmlPath, 'utf8');

  // Replace any occurrences of .js.Без названия (in any case/spacing) with .js
  const cyrillicSuffix = '.\u0411\u0435\u0437 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u044f';
  const regex = new RegExp(`\\.js${cyrillicSuffix.replace(/\\/g, '\\\\')}`, 'g');
  const before = html;
  html = html.replace(regex, '.js');

  if (before !== html) {
    fs.writeFileSync(paymentHtmlPath, html, 'utf8');
    console.log('Updated payment.html script references (.js suffix fixed).');
  } else {
    console.log('No payment.html updates needed.');
  }
}

(function run() {
  try {
    normalizeAssets();
    updatePaymentHtml();
    console.log('All done! Refresh /desktop/payment.html');
  } catch (err) {
    console.error('Fix failed:', err.message);
    process.exit(1);
  }
})();
