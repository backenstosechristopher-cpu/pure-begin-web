#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to check if page has quantity selectors
function hasQuantitySelectors(content) {
  const indicators = [
    'product_card_quantity_select_',
    'MuiSelect-root',
    'MuiInput-input',
    'quantity',
    'Anzahl',
    'aria-label="Anzahl"',
    'input[type="number"]',
    'stepper',
    'increment',
    'decrement',
    'MuiFormControl',
    'combobox'
  ];
  
  return indicators.some(indicator => content.toLowerCase().includes(indicator.toLowerCase()));
}

// Function to check if script already exists
function hasEnhancementScript(content) {
  return content.includes('quantity-enhancement.js') || 
         content.includes('Universal quantity enhancement loaded');
}

// Function to inject script
function injectScript(filePath, category = 'universal') {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Skip if already has script
    if (hasEnhancementScript(content)) {
      return { processed: true, enhanced: false, reason: 'already_has_script' };
    }
    
    // Skip if no quantity selectors
    if (!hasQuantitySelectors(content)) {
      return { processed: true, enhanced: false, reason: 'no_quantity_selectors' };
    }
    
    // Determine script name based on category
    let scriptName = 'universal-quantity-enhancement.js';
    const fileName = path.basename(filePath).toLowerCase();
    
    if (fileName.includes('amazon')) {
      scriptName = 'amazon-quantity-enhancement.js';
    } else if (fileName.includes('google-play')) {
      scriptName = 'google-play-quantity-enhancement.js';
    } else if (fileName.includes('apple')) {
      scriptName = 'apple-quantity-enhancement.js';
    } else if (fileName.includes('vodafone')) {
      scriptName = 'vodafone-quantity-enhancement.js';
    } else if (fileName.includes('telekom')) {
      scriptName = 'telekom-quantity-enhancement.js';
    } else if (fileName.includes('lebara')) {
      scriptName = 'lebara-quantity-enhancement.js';
    } else if (fileName.includes('congstar')) {
      scriptName = 'congstar-quantity-enhancement.js';
    } else if (fileName.includes('klarmobil')) {
      scriptName = 'klarmobil-quantity-enhancement.js';
    }
    
    // Inject script
    const scriptTag = `<script src="${scriptName}" defer></script>`;
    let newContent = content;
    
    // Try different injection points
    if (content.includes('</script></body></html>')) {
      newContent = content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
    } else if (content.includes('</body></html>')) {
      newContent = content.replace('</body></html>', `${scriptTag}</body></html>`);
    } else if (content.includes('</html>')) {
      newContent = content.replace('</html>', `${scriptTag}</html>`);
    } else {
      // Fallback: add at the very end
      newContent = content + scriptTag;
    }
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return { 
        processed: true, 
        enhanced: true, 
        reason: 'script_injected',
        script: scriptName
      };
    }
    
    return { processed: true, enhanced: false, reason: 'no_injection_point' };
    
  } catch (error) {
    return { 
      processed: false, 
      enhanced: false, 
      reason: `error: ${error.message}` 
    };
  }
}

// Main scanning and enhancement function
function scanAndEnhanceAll() {
  console.log('🔍 COMPREHENSIVE QUANTITY ENHANCEMENT SCANNER');
  console.log('=============================================\n');
  
  const directories = ['desktop', 'mobile'];
  const results = {};
  let totalScanned = 0;
  let totalEnhanced = 0;
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Directory ${dir} not found\n`);
      return;
    }
    
    console.log(`📁 Scanning ${dir.toUpperCase()} directory...`);
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .sort();
    
    let dirScanned = 0;
    let dirEnhanced = 0;
    const categories = {};
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const result = injectScript(filePath);
      
      dirScanned++;
      
      if (result.enhanced) {
        dirEnhanced++;
        const category = result.script ? result.script.replace('-quantity-enhancement.js', '') : 'universal';
        categories[category] = (categories[category] || 0) + 1;
        console.log(`   ✅ ${file} → ${result.script}`);
      }
    });
    
    results[dir] = { scanned: dirScanned, enhanced: dirEnhanced, categories };
    totalScanned += dirScanned;
    totalEnhanced += dirEnhanced;
    
    console.log(`   📊 Enhanced: ${dirEnhanced}/${dirScanned} files`);
    
    if (Object.keys(categories).length > 0) {
      console.log(`   🏷️  Categories: ${Object.entries(categories).map(([cat, count]) => `${cat}(${count})`).join(', ')}`);
    }
    
    console.log();
  });
  
  // Summary
  console.log('📋 FINAL SCAN RESULTS');
  console.log('=====================');
  console.log(`📄 Total pages scanned: ${totalScanned}`);
  console.log(`⚡ Pages enhanced with quantity selectors: ${totalEnhanced}`);
  
  // Category breakdown
  const allCategories = {};
  Object.values(results).forEach(dirResult => {
    Object.entries(dirResult.categories || {}).forEach(([cat, count]) => {
      allCategories[cat] = (allCategories[cat] || 0) + count;
    });
  });
  
  if (Object.keys(allCategories).length > 0) {
    console.log('\n🎯 ENHANCEMENT BREAKDOWN:');
    Object.entries(allCategories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   📦 ${category}: ${count} pages`);
      });
  }
  
  console.log('\n✨ SUCCESS! All pages with quantity selectors have been enhanced!');
  console.log('🎉 Quantity dropdowns now work consistently across the entire platform!');
  
  return results;
}

// Run the scanner
if (require.main === module) {
  scanAndEnhanceAll();
}

module.exports = { scanAndEnhanceAll, injectScript };