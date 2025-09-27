// Quick script injection for key pages
// This demonstrates the solution working on important pages

const fs = require('fs');

// Key pages to enhance first (most commonly used)
const keyPages = [
  'desktop/guthaben.de_vodafone-aufladen.html',
  'mobile/guthaben.de_vodafone-aufladen.html',
  'desktop/guthaben.de_amazon-gutschein.html',
  'mobile/guthaben.de_amazon-gutschein.html',
  'desktop/guthaben.de_lebara-aufladen.html',
  'mobile/guthaben.de_lebara-aufladen.html',
  'desktop/guthaben.de_lycamobile-aufladen.html',
  'mobile/guthaben.de_lycamobile-aufladen.html'
];

function getScriptForPage(pagePath) {
  if (pagePath.includes('vodafone')) return 'vodafone-quantity-enhancement.js';
  if (pagePath.includes('amazon')) return 'amazon-quantity-enhancement.js';
  if (pagePath.includes('lebara')) return 'lebara-quantity-enhancement.js';
  return 'universal-quantity-enhancement.js';
}

function injectScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const scriptName = getScriptForPage(filePath);
    const scriptTag = `<script src="${scriptName}"></script>`;
    
    // Check if already injected
    if (content.includes(scriptTag)) {
      console.log(`⏩ Already enhanced: ${filePath}`);
      return false;
    }
    
    // Check if file has quantity selectors
    if (!content.includes('product_card_quantity_select') && !content.includes('MuiSelect')) {
      console.log(`❌ No quantity selectors found in: ${filePath}`);
      return false;
    }
    
    // Inject before closing body or html tag
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${scriptTag}</body>`);
    } else if (content.includes('</html>')) {
      content = content.replace('</html>', `${scriptTag}</html>`);
    } else {
      content += scriptTag;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Enhanced: ${filePath} with ${scriptName}`);
    return true;
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process key pages
console.log('🚀 Injecting quantity enhancement scripts into key pages...\n');

let enhanced = 0;
keyPages.forEach(page => {
  if (injectScript(page)) {
    enhanced++;
  }
});

console.log(`\n🎉 Enhanced ${enhanced} key pages!`);
console.log('💡 Test by visiting these pages and clicking quantity dropdowns.');

module.exports = { injectScript, getScriptForPage };