// Comprehensive scanner to find pages with quantity selectors
// Usage: node scan-quantity-selectors.cjs

const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['public/desktop', 'public/mobile'];

function hasQuantitySelectors(content) {
  const patterns = [
    'role="combobox"',
    'product_card_quantity_select',
    'MuiSelect',
    'aria-haspopup="listbox"',
    'data-testid="quantity-select"',
    'quantity-selector',
    '<select',
    'name="quantity"'
  ];
  return patterns.some(pattern => content.toLowerCase().includes(pattern.toLowerCase()));
}

function hasEnhancementScript(content) {
  const scripts = [
    'universal-quantity-enhancement.js',
    'quantity-enhancement.js',
    'amazon-quantity-enhancement.js'
  ];
  return scripts.some(script => content.includes(script));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasSelectors = hasQuantitySelectors(content);
    const hasScript = hasEnhancementScript(content);
    
    return {
      path: filePath,
      hasSelectors,
      hasScript,
      needsEnhancement: hasSelectors && !hasScript,
      size: content.length
    };
  } catch (error) {
    return {
      path: filePath,
      error: error.message
    };
  }
}

function main() {
  console.log('🔍 Scanning all pages for quantity selectors...\n');
  
  const results = {
    total: 0,
    withSelectors: 0,
    withEnhancement: 0,
    needsEnhancement: 0,
    errors: 0,
    pages: []
  };

  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    console.log(`📁 Scanning ${dir}: ${files.length} files`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const result = scanFile(filePath);
      
      results.total++;
      results.pages.push(result);

      if (result.error) {
        results.errors++;
        console.log(`❌ Error: ${file} - ${result.error}`);
        continue;
      }

      if (result.hasSelectors) {
        results.withSelectors++;
        if (result.hasScript) {
          results.withEnhancement++;
          console.log(`✅ ${file} - has selectors + enhancement`);
        } else {
          results.needsEnhancement++;
          console.log(`⚠️  ${file} - has selectors but MISSING enhancement`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SCAN SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total pages scanned:          ${results.total}`);
  console.log(`Pages with quantity selectors: ${results.withSelectors}`);
  console.log(`Pages with enhancement:        ${results.withEnhancement}`);
  console.log(`Pages NEEDING enhancement:     ${results.needsEnhancement}`);
  console.log(`Errors:                        ${results.errors}`);
  console.log('='.repeat(60));

  // Save detailed report
  const reportPath = 'quantity-selector-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  // List pages that need enhancement
  if (results.needsEnhancement > 0) {
    console.log('\n🔧 PAGES NEEDING ENHANCEMENT:');
    results.pages
      .filter(p => p.needsEnhancement)
      .forEach(p => console.log(`   - ${p.path}`));
  }
}

main();
