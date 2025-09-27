#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Enhanced detection for quantity selectors
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
  
  return indicators.some(indicator => 
    content.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Check if script already exists
function hasEnhancementScript(content) {
  return content.includes('quantity-enhancement.js') || 
         content.includes('Universal quantity enhancement loaded');
}

// Get appropriate script for page
function getScriptForPage(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('amazon')) return 'amazon-quantity-enhancement.js';
  if (name.includes('google-play')) return 'google-play-quantity-enhancement.js';
  if (name.includes('apple')) return 'apple-quantity-enhancement.js';
  if (name.includes('vodafone')) return 'vodafone-quantity-enhancement.js';
  if (name.includes('telekom')) return 'telekom-quantity-enhancement.js';
  if (name.includes('lebara')) return 'lebara-quantity-enhancement.js';
  if (name.includes('congstar')) return 'congstar-quantity-enhancement.js';
  if (name.includes('klarmobil')) return 'klarmobil-quantity-enhancement.js';
  
  return 'universal-quantity-enhancement.js';
}

// Inject script into page
function enhancePage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    
    // Skip if no quantity selectors
    if (!hasQuantitySelectors(content)) {
      return { enhanced: false, reason: 'no_selectors', needsScript: false };
    }
    
    // Skip if already enhanced
    if (hasEnhancementScript(content)) {
      return { enhanced: false, reason: 'already_enhanced', needsScript: false };
    }
    
    // This page needs enhancement
    const scriptName = getScriptForPage(filename);
    const scriptTag = `<script src="${scriptName}" defer></script>`;
    
    let newContent = content;
    
    // Find injection point and inject
    if (content.includes('</script></body></html>')) {
      newContent = content.replace(/(<\/script>)(\s*<\/body>\s*<\/html>)/, `$1${scriptTag}$2`);
    } else if (content.includes('</body></html>')) {
      newContent = content.replace('</body></html>', `${scriptTag}</body></html>`);
    } else if (content.includes('</html>')) {
      newContent = content.replace('</html>', `${scriptTag}</html>`);
    }
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return { 
        enhanced: true, 
        reason: 'injected',
        script: scriptName,
        needsScript: false
      };
    }
    
    return { enhanced: false, reason: 'no_injection_point', needsScript: true };
    
  } catch (error) {
    return { enhanced: false, reason: `error: ${error.message}`, needsScript: false };
  }
}

// Smart scanning and enhancement
function smartScanAndEnhance() {
  console.log('🔍 SMART QUANTITY ENHANCEMENT SCANNER');
  console.log('====================================\n');
  
  const directories = ['desktop', 'mobile'];
  let totalScanned = 0;
  let totalWithSelectors = 0;
  let totalAlreadyEnhanced = 0;
  let totalNewlyEnhanced = 0;
  let totalNoSelectors = 0;
  
  const results = {
    categories: {},
    noSelectors: [],
    alreadyEnhanced: [],
    newlyEnhanced: []
  };
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Directory ${dir} not found\n`);
      return;
    }
    
    console.log(`📁 Analyzing ${dir.toUpperCase()} directory...`);
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .sort();
    
    let dirScanned = 0;
    let dirWithSelectors = 0;
    let dirAlreadyEnhanced = 0;
    let dirNewlyEnhanced = 0;
    let dirNoSelectors = 0;
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const result = enhancePage(filePath);
      
      dirScanned++;
      totalScanned++;
      
      if (result.reason === 'no_selectors') {
        dirNoSelectors++;
        totalNoSelectors++;
        results.noSelectors.push(`${dir}/${file}`);
      } else if (result.reason === 'already_enhanced') {
        dirWithSelectors++;
        dirAlreadyEnhanced++;
        totalWithSelectors++;
        totalAlreadyEnhanced++;
        results.alreadyEnhanced.push(`${dir}/${file}`);
      } else if (result.enhanced) {
        dirWithSelectors++;
        dirNewlyEnhanced++;
        totalWithSelectors++;
        totalNewlyEnhanced++;
        
        const category = result.script ? result.script.replace('-quantity-enhancement.js', '') : 'universal';
        results.categories[category] = (results.categories[category] || 0) + 1;
        results.newlyEnhanced.push(`${dir}/${file} → ${result.script}`);
        
        console.log(`   ✅ Enhanced: ${file} → ${result.script}`);
      }
    });
    
    console.log(`   📊 Scanned: ${dirScanned} files`);
    console.log(`   📦 With quantity selectors: ${dirWithSelectors}`);
    console.log(`   ⚡ Already enhanced: ${dirAlreadyEnhanced}`);
    console.log(`   🆕 Newly enhanced: ${dirNewlyEnhanced}`);
    console.log(`   ❌ No quantity selectors: ${dirNoSelectors}\n`);
  });
  
  // Final summary
  console.log('📋 SCAN RESULTS SUMMARY');
  console.log('=======================');
  console.log(`📄 Total pages scanned: ${totalScanned}`);
  console.log(`📦 Pages with quantity selectors: ${totalWithSelectors}`);
  console.log(`✅ Already enhanced: ${totalAlreadyEnhanced}`);
  console.log(`🆕 Newly enhanced: ${totalNewlyEnhanced}`);
  console.log(`❌ No quantity selectors needed: ${totalNoSelectors}`);
  
  if (Object.keys(results.categories).length > 0) {
    console.log('\n🎯 NEW ENHANCEMENTS BY CATEGORY:');
    Object.entries(results.categories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   📦 ${category}: ${count} pages`);
      });
  }
  
  // Show examples of pages that don't need selectors
  if (results.noSelectors.length > 0) {
    console.log('\n📋 PAGES WITHOUT QUANTITY SELECTORS (first 10):');
    results.noSelectors.slice(0, 10).forEach(page => {
      const filename = path.basename(page);
      console.log(`   ❌ ${filename}`);
    });
    if (results.noSelectors.length > 10) {
      console.log(`   ... and ${results.noSelectors.length - 10} more`);
    }
  }
  
  console.log('\n🎉 SCAN COMPLETE!');
  if (totalNewlyEnhanced > 0) {
    console.log(`✨ ${totalNewlyEnhanced} pages newly enhanced with quantity selectors!`);
  }
  if (totalAlreadyEnhanced > 0) {
    console.log(`👍 ${totalAlreadyEnhanced} pages were already enhanced!`);
  }
  if (totalNoSelectors > 0) {
    console.log(`ℹ️  ${totalNoSelectors} pages don't need quantity enhancement (no selectors found)`);
  }
  
  return results;
}

// Run the smart scanner
if (require.main === module) {
  smartScanAndEnhance();
}

module.exports = { smartScanAndEnhance };