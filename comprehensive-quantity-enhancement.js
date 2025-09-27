const fs = require('fs');
const path = require('path');

// Comprehensive quantity selector enhancement script
// Adds universal-quantity-enhancement.js to ALL pages with quantity selectors

// Enhanced patterns to detect quantity selectors
const QUANTITY_PATTERNS = [
  'role="combobox"',
  'product_card_quantity_select',
  'aria-label="Quantity"',
  'aria-label="quantity"', 
  'aria-label="Anzahl"',
  'data-testid="quantity"',
  'MuiSelect-root',
  'MuiSelect-select',
  'quantity-select',
  'qty-select',
  'amount-select',
  'Quantity:',
  'Anzahl:',
  'class="quantity"',
  'id="quantity"',
  'name="quantity"',
  'input[type="number"].*quantity',
  'select.*quantity',
  'button.*quantity'
];

// Enhancement scripts to check for
const ENHANCEMENT_SCRIPTS = [
  'universal-quantity-enhancement.js',
  'telekom-quantity-enhancement.js', 
  'vodafone-quantity-enhancement.js',
  'amazon-quantity-enhancement.js',
  'lebara-quantity-enhancement.js',
  'custom-blau-quantity.js'
];

function hasQuantitySelectors(content) {
  return QUANTITY_PATTERNS.some(pattern => content.includes(pattern));
}

function hasEnhancementScript(content) {
  return ENHANCEMENT_SCRIPTS.some(script => content.includes(script));
}

function addEnhancementScript(content) {
  const scriptTag = '<script src="universal-quantity-enhancement.js"></script>';
  
  // Try to insert before </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `${scriptTag}</body>`);
  }
  
  // Try to insert before </html>
  if (content.includes('</html>')) {
    return content.replace('</html>', `${scriptTag}</html>`);
  }
  
  // Fallback - add at the end
  return content + scriptTag;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no quantity selectors found
    if (!hasQuantitySelectors(content)) {
      return { status: 'skipped', reason: 'no_quantity_selectors' };
    }
    
    // Skip if already has enhancement script
    if (hasEnhancementScript(content)) {
      return { status: 'skipped', reason: 'already_enhanced' };
    }
    
    // Add enhancement script
    const enhancedContent = addEnhancementScript(content);
    fs.writeFileSync(filePath, enhancedContent, 'utf8');
    
    return { status: 'enhanced', reason: 'added_script' };
    
  } catch (error) {
    return { status: 'error', reason: error.message };
  }
}

function processDirectory(dirPath) {
  const results = {
    total: 0,
    enhanced: 0,
    skipped_no_selectors: 0,
    skipped_already_enhanced: 0,
    errors: 0,
    enhanced_files: [],
    error_files: []
  };
  
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      if (file.endsWith('.html') && file.includes('guthaben.de')) {
        results.total++;
        const filePath = path.join(dirPath, file);
        const result = processFile(filePath);
        
        switch (result.status) {
          case 'enhanced':
            results.enhanced++;
            results.enhanced_files.push(file);
            break;
          case 'skipped':
            if (result.reason === 'no_quantity_selectors') {
              results.skipped_no_selectors++;
            } else {
              results.skipped_already_enhanced++;
            }
            break;
          case 'error':
            results.errors++;
            results.error_files.push({ file, error: result.reason });
            break;
        }
      }
    });
    
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    results.errors++;
  }
  
  return results;
}

function main() {
  console.log('🔍 Starting comprehensive quantity selector enhancement...\n');
  
  const directories = ['desktop', 'mobile'];
  const totalResults = {
    total: 0,
    enhanced: 0,
    skipped_no_selectors: 0,
    skipped_already_enhanced: 0,
    errors: 0,
    enhanced_files: [],
    error_files: []
  };
  
  directories.forEach(dir => {
    console.log(`📁 Processing ${dir} directory...`);
    const results = processDirectory(dir);
    
    console.log(`   📊 Results for ${dir}:`);
    console.log(`   - Total files: ${results.total}`);
    console.log(`   - Enhanced: ${results.enhanced}`);
    console.log(`   - Skipped (no selectors): ${results.skipped_no_selectors}`);
    console.log(`   - Skipped (already enhanced): ${results.skipped_already_enhanced}`);
    console.log(`   - Errors: ${results.errors}\n`);
    
    // Add to totals
    totalResults.total += results.total;
    totalResults.enhanced += results.enhanced;
    totalResults.skipped_no_selectors += results.skipped_no_selectors;
    totalResults.skipped_already_enhanced += results.skipped_already_enhanced;
    totalResults.errors += results.errors;
    totalResults.enhanced_files.push(...results.enhanced_files.map(f => `${dir}/${f}`));
    totalResults.error_files.push(...results.error_files.map(e => ({...e, dir})));
  });
  
  console.log('📈 COMPREHENSIVE SUMMARY:');
  console.log(`🔥 Total HTML files processed: ${totalResults.total}`);
  console.log(`✅ Files enhanced with quantity selector: ${totalResults.enhanced}`);
  console.log(`⏭️  Files skipped (no quantity selectors): ${totalResults.skipped_no_selectors}`);
  console.log(`✋ Files skipped (already enhanced): ${totalResults.skipped_already_enhanced}`);
  console.log(`❌ Files with errors: ${totalResults.errors}\n`);
  
  if (totalResults.enhanced > 0) {
    console.log('🎉 SUCCESS! Enhanced the following pages with quantity selectors:');
    totalResults.enhanced_files.forEach(file => {
      console.log(`   ✨ ${file}`);
    });
    
    console.log('\n📝 Enhancement Details:');
    console.log('   - Script added: universal-quantity-enhancement.js');
    console.log('   - Features: Shadow DOM isolated quantity selector');
    console.log('   - Options: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
    console.log('   - Activation: Click any quantity button');
    console.log('   - Compatible: All MUI selectors and quantity buttons\n');
  }
  
  if (totalResults.error_files.length > 0) {
    console.log('⚠️  Files with errors:');
    totalResults.error_files.forEach(item => {
      console.log(`   ❌ ${item.dir}/${item.file}: ${item.error}`);
    });
  }
  
  console.log(`\n🏁 Enhancement process completed! Enhanced ${totalResults.enhanced} out of ${totalResults.total} pages.`);
}

if (require.main === module) {
  main();
}

module.exports = { processDirectory, processFile, main };