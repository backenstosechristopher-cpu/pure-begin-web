const fs = require('fs');
const path = require('path');

console.log('🚀 Starting bulk quantity selector enhancement...\n');

// List of key brand pages to prioritize
const keyBrands = [
  'amazon', 'google-play', 'apple', 'steam', 'xbox', 'playstation', 'nintendo',
  'netflix', 'spotify', 'disney-plus', 'airbnb', 'lieferando', 'zalando', 
  'h-m', 'mediamarkt', 'ikea', 'douglas', 'cashlib', 'bitsa', 'flexepin',
  'jeton-cash', 'aplauz', 'paysafecard', 'astropay', 'battlenet'
];

function hasQuantitySelectors(content) {
  const patterns = [
    'role="combobox"',
    'product_card_quantity_select',
    'MuiSelect-root',
    'MuiSelect-select',
    'quantity',
    'Quantity',
    'Anzahl',
    'data-value="5"',
    'data-value="25"', 
    'data-value="50"',
    'data-value="100"',
    '€5',
    '€25',
    '€50', 
    '€100',
    'Weiterlesen'
  ];
  return patterns.some(pattern => content.includes(pattern));
}

function hasEnhancementScript(content) {
  const scripts = [
    'universal-quantity-enhancement.js',
    'telekom-quantity-enhancement.js',
    'vodafone-quantity-enhancement.js',
    'amazon-quantity-enhancement.js',
    'Remove Weiterlesen buttons', // Check for our new enhancement script
    'value-btn-active' // Check for our styling
  ];
  return scripts.some(script => content.includes(script));
}

function addEnhancementScript(content) {
  const buttonEnhancementScript = `<script>
// Remove Weiterlesen buttons
document.addEventListener('DOMContentLoaded', function() {
  const weitrelesenButtons = document.querySelectorAll('button, a, [role="button"]');
  weitrelesenButtons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Weiterlesen')) {
      btn.remove();
    }
  });
});

// Add blue border styling to value buttons
document.addEventListener('DOMContentLoaded', function() {
  const valueButtons = document.querySelectorAll('[data-value], button[class*="value"], button[class*="amount"]');
  valueButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all value buttons
      valueButtons.forEach(b => b.classList.remove('value-btn-active'));
      // Add active class to clicked button
      this.classList.add('value-btn-active');
    });
  });
});
</script>

<style>
.value-btn-active {
  border: 2px solid #1976d2 !important;
  background-color: rgba(25, 118, 210, 0.1) !important;
}
</style>

<script src="universal-quantity-enhancement.js"></script>`;
  
  if (content.includes('</body>')) {
    return content.replace('</body>', `${buttonEnhancementScript}</body>`);
  }
  if (content.includes('</html>')) {
    return content.replace('</html>', `${buttonEnhancementScript}</html>`);
  }
  return content + buttonEnhancementScript;
}

function enhancePages() {
  let totalEnhanced = 0;
  let enhancedPages = [];
  
  ['desktop', 'mobile', 'public/desktop', 'public/mobile'].forEach(dir => {
    console.log(`📁 Processing ${dir} directory...`);
    
    const files = fs.readdirSync(dir);
    const htmlFiles = files.filter(f => 
      f.endsWith('.html') && 
      f.startsWith('guthaben.de_')
    );
    
    console.log(`   Found ${htmlFiles.length} HTML files`);
    
    htmlFiles.forEach(file => {
      try {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (hasQuantitySelectors(content) && !hasEnhancementScript(content)) {
          const enhancedContent = addEnhancementScript(content);
          fs.writeFileSync(filePath, enhancedContent, 'utf8');
          
          const brandName = keyBrands.find(brand => file.includes(brand)) || 'Other';
          enhancedPages.push(`${dir}/${file} (${brandName})`);
          totalEnhanced++;
          
          console.log(`   ✅ Enhanced: ${file}`);
        }
      } catch (error) {
        console.log(`   ❌ Error processing ${file}: ${error.message}`);
      }
    });
  });
  
  console.log(`\n🎉 BULK ENHANCEMENT COMPLETE!`);
  console.log(`📊 Total pages enhanced: ${totalEnhanced}`);
  
  if (enhancedPages.length > 0) {
    console.log(`\n✨ Enhanced pages:`);
    enhancedPages.slice(0, 20).forEach(page => console.log(`   - ${page}`));
    if (enhancedPages.length > 20) {
      console.log(`   ... and ${enhancedPages.length - 20} more pages`);
    }
  }
  
  return totalEnhanced;
}

// Execute enhancement
enhancePages();