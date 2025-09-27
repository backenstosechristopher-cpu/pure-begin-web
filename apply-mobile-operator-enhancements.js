const fs = require('fs');

// Key mobile operator pages to enhance
const mobileOperatorPages = [
  // Desktop
  { path: 'desktop/guthaben.de_vodafone-aufladen.html', script: 'vodafone-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_lebara-aufladen.html', script: 'lebara-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_lycamobile-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_congstar-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_klarmobil-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_fonic-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_bildmobil-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_o2-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_ay-yildiz-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_e-plus-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_blau-de-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_blauworld-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_einfach-prepaid-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'desktop/guthaben.de_fyve-aufladen.html', script: 'universal-quantity-enhancement.js' },
  
  // Mobile
  { path: 'mobile/guthaben.de_vodafone-aufladen.html', script: 'vodafone-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_lebara-aufladen.html', script: 'lebara-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_lycamobile-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_aldi-talk-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_congstar-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_klarmobil-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_fonic-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_bildmobil-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_o2-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_ay-yildiz-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_e-plus-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_blau-de-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_blauworld-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_einfach-prepaid-aufladen.html', script: 'universal-quantity-enhancement.js' },
  { path: 'mobile/guthaben.de_fyve-aufladen.html', script: 'universal-quantity-enhancement.js' }
];

function enhancePage(pageInfo) {
  const { path: filePath, script } = pageInfo;
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { success: false, reason: 'File not found' };
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has quantity selectors
    if (!content.includes('product_card_quantity_select') && !content.includes('MuiSelect-root')) {
      return { success: false, reason: 'No quantity selectors found' };
    }
    
    const scriptTag = `<script src="${script}"></script>`;
    
    // Check if already enhanced
    if (content.includes(scriptTag)) {
      return { success: false, reason: 'Already enhanced' };
    }
    
    // Try different injection patterns
    if (content.includes('</body></html>')) {
      content = content.replace('</body></html>', `${scriptTag}</body></html>`);
    } else if (content.includes('</html>')) {
      content = content.replace('</html>', `${scriptTag}</html>`);
    } else {
      // Fallback - append at end
      content += scriptTag;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, script };
    
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

console.log('🚀 Enhancing mobile operator pages with quantity selectors...\n');

let enhanced = 0;
let alreadyEnhanced = 0;
let notFound = 0;
let noSelectors = 0;
let errors = 0;

mobileOperatorPages.forEach(pageInfo => {
  const result = enhancePage(pageInfo);
  
  if (result.success) {
    console.log(`✅ Enhanced: ${pageInfo.path} → ${result.script}`);
    enhanced++;
  } else {
    const reason = result.reason;
    if (reason === 'Already enhanced') {
      console.log(`⏩ Already enhanced: ${pageInfo.path}`);
      alreadyEnhanced++;
    } else if (reason === 'File not found') {
      console.log(`⚠️  Not found: ${pageInfo.path}`);
      notFound++;
    } else if (reason === 'No quantity selectors found') {
      console.log(`⏭️  No selectors: ${pageInfo.path}`);
      noSelectors++;
    } else {
      console.log(`❌ Error in ${pageInfo.path}: ${reason}`);
      errors++;
    }
  }
});

console.log(`\n🎉 Mobile operator enhancement complete!`);
console.log(`✨ Enhanced: ${enhanced} pages`);
console.log(`⏩ Already enhanced: ${alreadyEnhanced} pages`);
console.log(`⏭️  No selectors: ${noSelectors} pages`);
console.log(`⚠️  Not found: ${notFound} pages`);
console.log(`❌ Errors: ${errors} pages`);

if (enhanced > 0) {
  console.log('\n🧪 Test these enhanced pages:');
  console.log('- Visit any enhanced page');
  console.log('- Click quantity dropdown buttons');
  console.log('- Check console for: "Universal quantity enhancement loaded for X buttons"');
  console.log('- Dropdown should stay open until you select an option');
}

module.exports = { enhancePage };