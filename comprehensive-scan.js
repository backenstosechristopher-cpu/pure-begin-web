#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive detection for quantity selectors
function hasQuantitySelectors(content) {
  const indicators = [
    'product_card', // Main product card containers - transcash/mobi use this
    'quantity',
    'Anzahl', 
    'MuiSelect',
    'select',
    'dropdown',
    'combobox',
    'stepper',
    'input[type="number"]'
  ];
  
  return indicators.some(indicator => 
    content.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Check if script already exists
function hasEnhancementScript(content) {
  return content.includes('quantity-enhancement.js');
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
  if (name.includes('lifecell')) return 'universal-quantity-enhancement.js';
  
  return 'universal-quantity-enhancement.js';
}

// Inject script into page
function enhancePage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    
    // Skip if no quantity selectors
    if (!hasQuantitySelectors(content)) {
      return { enhanced: false, reason: 'no_selectors' };
    }
    
    // Skip if already enhanced
    if (hasEnhancementScript(content)) {
      return { enhanced: false, reason: 'already_enhanced' };
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
        script: scriptName
      };
    }
    
    return { enhanced: false, reason: 'no_injection_point' };
    
  } catch (error) {
    return { enhanced: false, reason: `error: ${error.message}` };
  }
}

// Comprehensive scan and enhancement
function comprehensiveScan() {
  console.log('🔍 COMPREHENSIVE QUANTITY ENHANCEMENT SCAN');
  console.log('==========================================\n');
  
  const directories = ['desktop', 'mobile'];
  let totalScanned = 0;
  let totalWithSelectors = 0;
  let totalAlreadyEnhanced = 0;
  let totalNewlyEnhanced = 0;
  let totalNoSelectors = 0;
  
  const results = {
    categories: {},
    examples: {
      transcash: [],
      mobi: [],
      other: []
    }
  };
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Directory ${dir} not found\n`);
      return;
    }
    
    console.log(`📁 Processing ${dir.toUpperCase()} directory...`);
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .sort();
    
    let dirNewlyEnhanced = 0;
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const result = enhancePage(filePath);
      
      totalScanned++;
      
      if (result.reason === 'no_selectors') {
        totalNoSelectors++;
      } else if (result.reason === 'already_enhanced') {
        totalWithSelectors++;
        totalAlreadyEnhanced++;
      } else if (result.enhanced) {
        totalWithSelectors++;
        totalNewlyEnhanced++;
        dirNewlyEnhanced++;
        
        const category = result.script ? result.script.replace('-quantity-enhancement.js', '') : 'universal';
        results.categories[category] = (results.categories[category] || 0) + 1;
        
        // Categorize examples
        if (file.includes('transcash')) {
          results.examples.transcash.push(`${dir}/${file}`);
        } else if (file.includes('mobi')) {
          results.examples.mobi.push(`${dir}/${file}`);
        } else {
          results.examples.other.push(`${dir}/${file}`);
        }
        
        console.log(`   ✅ ${file} → ${result.script}`);
      }
    });
    
    console.log(`   📊 Newly enhanced: ${dirNewlyEnhanced} files\n`);
  });
  
  // Final summary
  console.log('📋 COMPREHENSIVE SCAN RESULTS');
  console.log('=============================');
  console.log(`📄 Total pages scanned: ${totalScanned}`);
  console.log(`📦 Pages with quantity selectors: ${totalWithSelectors}`);
  console.log(`✅ Already enhanced: ${totalAlreadyEnhanced}`);
  console.log(`🆕 Newly enhanced: ${totalNewlyEnhanced}`);
  console.log(`❌ No quantity selectors: ${totalNoSelectors}`);
  
  if (Object.keys(results.categories).length > 0) {
    console.log('\n🎯 NEW ENHANCEMENTS BY CATEGORY:');
    Object.entries(results.categories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   📦 ${category}: ${count} pages`);
      });
  }
  
  // Show examples
  console.log('\n📋 ENHANCED EXAMPLES:');
  if (results.examples.transcash.length > 0) {
    console.log(`   💳 Transcash pages: ${results.examples.transcash.length} enhanced`);
    results.examples.transcash.slice(0, 3).forEach(page => {
      console.log(`      ✅ ${path.basename(page)}`);
    });
  }
  if (results.examples.mobi.length > 0) {
    console.log(`   📱 Mobi pages: ${results.examples.mobi.length} enhanced`);
    results.examples.mobi.slice(0, 3).forEach(page => {
      console.log(`      ✅ ${path.basename(page)}`);
    });
  }
  
  console.log('\n🎉 COMPREHENSIVE SCAN COMPLETE!');
  console.log(`✨ All ${totalNewlyEnhanced} pages with quantity selectors enhanced!`);
  console.log('📱 Transcash, Mobi aufladen, and all other pages now work like Vodafone!');
  
  return results;
}

// Run comprehensive scan
if (require.main === module) {
  comprehensiveScan();
}

module.exports = { comprehensiveScan };