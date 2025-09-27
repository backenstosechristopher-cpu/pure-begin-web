const fs = require('fs');

// Simple script injection that works with any HTML file format
function addQuantityScript(filePath, scriptName) {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, reason: 'File not found' };
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has quantity selectors
    if (!content.includes('product_card_quantity_select') && !content.includes('MuiSelect-root')) {
      return { success: false, reason: 'No quantity selectors' };
    }
    
    const scriptTag = `<script src="${scriptName}"></script>`;
    
    // Check if already enhanced
    if (content.includes(scriptTag)) {
      return { success: false, reason: 'Already enhanced' };
    }
    
    // Simple approach - just add before the very last </html> or at end
    if (content.includes('</html>')) {
      content = content.replace('</html>', scriptTag + '</html>');
    } else {
      content += scriptTag;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true };
    
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

// Run the enhancements
const results = [
  addQuantityScript('mobile/guthaben.de_vodafone-aufladen.html', 'vodafone-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_lebara-aufladen.html', 'lebara-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_lycamobile-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_aldi-talk-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_congstar-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_klarmobil-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_lebara-aufladen.html', 'lebara-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_lycamobile-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_fonic-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_bildmobil-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_fonic-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_bildmobil-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_o2-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_o2-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_ay-yildiz-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_ay-yildiz-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_e-plus-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_e-plus-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_blau-de-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_blau-de-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_blauworld-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_blauworld-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_einfach-prepaid-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_einfach-prepaid-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('desktop/guthaben.de_fyve-aufladen.html', 'universal-quantity-enhancement.js'),
  addQuantityScript('mobile/guthaben.de_fyve-aufladen.html', 'universal-quantity-enhancement.js')
];

let enhanced = 0;
let skipped = 0;
let errors = 0;

results.forEach(result => {
  if (result.success) enhanced++;
  else if (result.reason === 'Already enhanced' || result.reason === 'No quantity selectors') skipped++;
  else errors++;
});

console.log(`Enhanced: ${enhanced}, Skipped: ${skipped}, Errors: ${errors}`);