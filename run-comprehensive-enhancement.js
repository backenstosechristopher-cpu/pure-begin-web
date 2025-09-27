const fs = require('fs');
const path = require('path');

console.log('🔍 Starting comprehensive quantity selector enhancement...\n');

function hasQuantitySelectors(content) {
  const patterns = ['role="combobox"', 'product_card_quantity_select', 'MuiSelect', 'quantity'];
  return patterns.some(pattern => content.includes(pattern));
}

function hasEnhancement(content) {
  return content.includes('universal-quantity-enhancement.js');
}

function addScript(content) {
  if (content.includes('</body>')) {
    return content.replace('</body>', '<script src="universal-quantity-enhancement.js"></script></body>');
  }
  if (content.includes('</html>')) {
    return content.replace('</html>', '<script src="universal-quantity-enhancement.js"></script></html>');
  }
  return content + '<script src="universal-quantity-enhancement.js"></script>';
}

let enhanced = 0;

['desktop', 'mobile'].forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f.includes('guthaben.de'));
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasQuantitySelectors(content) && !hasEnhancement(content)) {
      const newContent = addScript(content);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Enhanced: ${dir}/${file}`);
      enhanced++;
    }
  });
});

console.log(`\n🎉 SUCCESS! Enhanced ${enhanced} pages with quantity selectors!`);