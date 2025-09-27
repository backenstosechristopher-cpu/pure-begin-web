// Enhanced script to inject quantity selectors into mobile operator pages
const fs = require('fs');

const operatorMappings = {
  'vodafone': 'vodafone-quantity-enhancement.js',
  'telekom': 'telekom-quantity-enhancement.js', 
  'lebara': 'lebara-quantity-enhancement.js',
  'lycamobile': 'universal-quantity-enhancement.js',
  'aldi-talk': 'universal-quantity-enhancement.js',
  'congstar': 'universal-quantity-enhancement.js',
  'klarmobil': 'universal-quantity-enhancement.js',
  'fonic': 'universal-quantity-enhancement.js',
  'bildmobil': 'universal-quantity-enhancement.js',
  'o2': 'universal-quantity-enhancement.js',
  'ay-yildiz': 'universal-quantity-enhancement.js',
  'e-plus': 'universal-quantity-enhancement.js',
  'blau': 'universal-quantity-enhancement.js',
  'blauworld': 'universal-quantity-enhancement.js',
  'einfach-prepaid': 'universal-quantity-enhancement.js',
  'fyve': 'universal-quantity-enhancement.js'
};

function getScriptForOperator(filename) {
  for (const [operator, script] of Object.entries(operatorMappings)) {
    if (filename.includes(operator)) {
      return script;
    }
  }
  return 'universal-quantity-enhancement.js';
}

function enhanceOperatorPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has quantity selectors
    if (!content.includes('product_card_quantity_select') && !content.includes('MuiSelect-root')) {
      return { success: false, reason: 'No quantity selectors' };
    }
    
    const filename = require('path').basename(filePath);
    const scriptName = getScriptForOperator(filename);
    const scriptTag = `<script src="${scriptName}"></script>`;
    
    // Check if already enhanced
    if (content.includes(scriptTag)) {
      return { success: false, reason: 'Already enhanced' };
    }
    
    // Various injection patterns based on file endings
    let injected = false;
    
    // Pattern 1: </script></body></html>
    if (content.includes('</script></body></html>')) {
      content = content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
      injected = true;
    }
    // Pattern 2: <script src="assets/tp.widget.sync.bootstrap.min.js"></script></body></html>
    else if (content.includes('<script src="assets/tp.widget.sync.bootstrap.min.js"')) {
      content = content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
      injected = true;
    }
    // Pattern 3: Long ending with MUI components + script
    else if (content.includes('</iframe></body></html>')) {
      content = content.replace('</iframe></body></html>', `</iframe>${scriptTag}</body></html>`);
      injected = true;
    }
    // Pattern 4: Simple </body></html>
    else if (content.includes('</body></html>')) {
      content = content.replace('</body></html>', `${scriptTag}</body></html>`);
      injected = true;
    }
    // Pattern 5: Just </html>
    else if (content.includes('</html>')) {
      content = content.replace('</html>', `${scriptTag}</html>`);
      injected = true;
    }
    
    if (injected) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, script: scriptName };
    }
    
    return { success: false, reason: 'No suitable injection point found' };
    
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

// Key mobile operator pages to enhance
const operatorPages = [
  // Desktop pages
  'desktop/guthaben.de_lebara-aufladen.html',
  'desktop/guthaben.de_lycamobile-aufladen.html', 
  'desktop/guthaben.de_congstar-aufladen.html',
  'desktop/guthaben.de_klarmobil-aufladen.html',
  'desktop/guthaben.de_fonic-aufladen.html',
  'desktop/guthaben.de_bildmobil-aufladen.html',
  'desktop/guthaben.de_o2-aufladen.html',
  'desktop/guthaben.de_ay-yildiz-aufladen.html',
  'desktop/guthaben.de_e-plus-aufladen.html',
  'desktop/guthaben.de_blau-de-aufladen.html',
  'desktop/guthaben.de_blauworld-aufladen.html',
  'desktop/guthaben.de_einfach-prepaid-aufladen.html',
  'desktop/guthaben.de_fyve-aufladen.html',

  // Mobile pages
  'mobile/guthaben.de_vodafone-aufladen.html',
  'mobile/guthaben.de_lebara-aufladen.html',
  'mobile/guthaben.de_lycamobile-aufladen.html',
  'mobile/guthaben.de_aldi-talk-aufladen.html',
  'mobile/guthaben.de_congstar-aufladen.html',
  'mobile/guthaben.de_klarmobil-aufladen.html',
  'mobile/guthaben.de_fonic-aufladen.html',
  'mobile/guthaben.de_bildmobil-aufladen.html',
  'mobile/guthaben.de_o2-aufladen.html',
  'mobile/guthaben.de_ay-yildiz-aufladen.html',
  'mobile/guthaben.de_e-plus-aufladen.html',
  'mobile/guthaben.de_blau-de-aufladen.html',
  'mobile/guthaben.de_blauworld-aufladen.html',
  'mobile/guthaben.de_einfach-prepaid-aufladen.html',
  'mobile/guthaben.de_fyve-aufladen.html'
];

console.log('🚀 Enhancing mobile operator pages with quantity selectors...\n');

let enhanced = 0;
let skipped = 0;
let errors = 0;

operatorPages.forEach(page => {
  try {
    if (fs.existsSync(page)) {
      const result = enhanceOperatorPage(page);
      if (result.success) {
        console.log(`✅ Enhanced: ${page} → ${result.script}`);
        enhanced++;
      } else if (result.reason === 'Already enhanced') {
        console.log(`⏩ Already enhanced: ${page}`);
        skipped++;
      } else if (result.reason === 'No quantity selectors') {
        console.log(`⏭️  No selectors: ${page}`);
        skipped++;
      } else {
        console.log(`❌ Error in ${page}: ${result.reason}`);
        errors++;
      }
    } else {
      console.log(`⚠️  File not found: ${page}`);
      skipped++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${page}: ${error.message}`);
    errors++;
  }
});

console.log(`\n🎉 Mobile operator enhancement complete!`);
console.log(`✨ Enhanced: ${enhanced} pages`);
console.log(`⏩ Skipped: ${skipped} pages`);
console.log(`❌ Errors: ${errors} pages`);

if (enhanced > 0) {
  console.log('\n🧪 Test by visiting enhanced pages and clicking quantity dropdowns!');
  console.log('💡 The console will show: "Universal quantity enhancement loaded for X buttons"');
}

module.exports = { enhanceOperatorPage, getScriptForOperator };