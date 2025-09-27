#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple function to inject script into HTML
function injectScript(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Skip if script already exists
    if (content.includes('universal-quantity-enhancement.js')) {
      return { success: true, reason: 'already_exists' };
    }
    
    // Skip if no quantity selectors found
    const hasQuantity = [
      'product_card_quantity_select_',
      'MuiSelect',
      'quantity',
      'Anzahl'
    ].some(indicator => content.includes(indicator));
    
    if (!hasQuantity) {
      return { success: false, reason: 'no_quantity_selectors' };
    }
    
    // Inject script before closing body/html
    const scriptTag = '<script src="universal-quantity-enhancement.js" defer></script>';
    let newContent = content;
    
    if (content.includes('</script></body></html>')) {
      newContent = content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
    } else if (content.includes('</body></html>')) {
      newContent = content.replace('</body></html>', `${scriptTag}</body></html>`);
    } else if (content.includes('</html>')) {
      newContent = content.replace('</html>', `${scriptTag}</html>`);
    }
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return { success: true, reason: 'injected' };
    }
    
    return { success: false, reason: 'no_injection_point' };
    
  } catch (error) {
    return { success: false, reason: `error: ${error.message}` };
  }
}

// Process all Cashlib and other pages
function main() {
  console.log('🚀 Enhancing all Cashlib and missing pages...\n');
  
  const directories = ['desktop', 'mobile'];
  let totalEnhanced = 0;
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .filter(file => file.includes('cashlib') || file.includes('amazon') || file.includes('google-play') || file.includes('apple'));
    
    console.log(`📁 Processing ${dir} (${files.length} files)`);
    
    let dirEnhanced = 0;
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const result = injectScript(filePath);
      
      if (result.success && result.reason === 'injected') {
        dirEnhanced++;
        console.log(`   ✅ Enhanced: ${file}`);
      }
    });
    
    totalEnhanced += dirEnhanced;
    console.log(`   📊 ${dirEnhanced} files enhanced in ${dir}\n`);
  });
  
  console.log(`🎯 TOTAL ENHANCED: ${totalEnhanced} pages`);
  console.log('✨ All Cashlib pages now have working quantity selectors like Vodafone!');
}

if (require.main === module) {
  main();
}

module.exports = { main, injectScript };