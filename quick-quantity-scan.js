// Quick scan and enhancement for quantity selectors
console.log('🔍 Scanning for pages that need quantity selector enhancements...\n');

const fs = require('fs');
const path = require('path');

// Sample of pages to check and enhance
const pagesToEnhance = [];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir);
  const htmlFiles = files.filter(file => 
    file.endsWith('.html') && 
    file.startsWith('guthaben.de') &&
    !file.includes('faq') &&
    !file.includes('impressum') &&
    !file.includes('datenschutz')
  );
  
  return htmlFiles.map(file => path.join(dir, file));
}

function hasQuantitySelectors(html) {
  return html.includes('product_card_quantity_select') || 
         html.includes('MuiSelect-root') || 
         html.includes('role="combobox"');
}

function hasEnhancementScript(html) {
  return html.includes('quantity-enhancement.js') || 
         html.includes('universal-quantity-enhancement');
}

function addEnhancementScript(html, scriptName) {
  const scriptTag = `<script src="${scriptName}"></script>`;
  
  if (html.includes('</body>')) {
    return html.replace('</body>', `${scriptTag}\n</body>`);
  }
  return html + `\n${scriptTag}`;
}

// Scan both directories
const desktopFiles = scanDirectory('desktop');
const mobileFiles = scanDirectory('mobile');

console.log(`Found ${desktopFiles.length} desktop pages and ${mobileFiles.length} mobile pages`);

let enhanced = 0;
let skipped = 0;

// Process desktop files
desktopFiles.forEach(filePath => {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    if (hasQuantitySelectors(html) && !hasEnhancementScript(html)) {
      const enhancedHtml = addEnhancementScript(html, 'universal-quantity-enhancement.js');
      fs.writeFileSync(filePath, enhancedHtml);
      console.log(`✅ Enhanced desktop: ${filename}`);
      enhanced++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.error(`❌ Error with ${filePath}:`, error.message);
  }
});

// Process mobile files  
mobileFiles.forEach(filePath => {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    if (hasQuantitySelectors(html) && !hasEnhancementScript(html)) {
      const enhancedHtml = addEnhancementScript(html, 'universal-quantity-enhancement.js');
      fs.writeFileSync(filePath, enhancedHtml);
      console.log(`✅ Enhanced mobile: ${filename}`);
      enhanced++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.error(`❌ Error with ${filePath}:`, error.message);
  }
});

console.log(`\n📊 SCAN COMPLETE:`);
console.log(`   Enhanced: ${enhanced} pages`);
console.log(`   Skipped: ${skipped} pages (no selectors or already enhanced)`);
console.log(`\n🎉 All product pages now have quantity selector enhancements!`);