// Comprehensive script to scan and inject quantity enhancement into all pages
const fs = require('fs');
const path = require('path');

const QUANTITY_PATTERNS = [
  'role="combobox"',
  'product_card_quantity_select',
  'MuiSelect-root',
  'aria-haspopup="listbox"',
  'quantity-selector',
  'MuiSelect-select',
  'aria-label="Quantity"',
  'aria-label="quantity"'
];

function hasQuantitySelectors(content) {
  return QUANTITY_PATTERNS.some(pattern => 
    content.toLowerCase().includes(pattern.toLowerCase())
  );
}

function hasEnhancementScript(content) {
  return content.includes('../shared/universal-quantity-enhancement.js');
}

function hasWrongPath(content) {
  return content.includes('shared/universal-quantity-enhancement.js') && 
         !content.includes('../shared/universal-quantity-enhancement.js');
}

function injectScript(content) {
  const scriptTag = `<script src="../shared/universal-quantity-enhancement.js"></script>`;
  
  // Try to inject before </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `  ${scriptTag}\n</body>`);
  }
  
  // Fallback: inject before </html>
  if (content.includes('</html>')) {
    return content.replace('</html>', `  ${scriptTag}\n</html>`);
  }
  
  // Last resort: append at end
  return content + '\n' + scriptTag;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!hasQuantitySelectors(content)) {
      return { status: 'no_selectors', path: filePath };
    }
    
    // Fix wrong path
    if (hasWrongPath(content)) {
      const fixedContent = content.replace(
        /src="shared\/universal-quantity-enhancement\.js"/g, 
        'src="../shared/universal-quantity-enhancement.js"'
      );
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      return { status: 'fixed_path', path: filePath };
    }
    
    if (hasEnhancementScript(content)) {
      return { status: 'already_enhanced', path: filePath };
    }
    
    const newContent = injectScript(content);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return { status: 'enhanced', path: filePath };
    
  } catch (error) {
    return { status: 'error', path: filePath, error: error.message };
  }
}

function scanDirectory(dirPath) {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return results;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    
    const fullPath = path.join(dirPath, file);
    const result = processFile(fullPath);
    results.push(result);
  }
  
  return results;
}

function main() {
  console.log('🚀 Universal Quantity Enhancement - Mass Injection\n');
  console.log('='.repeat(70));
  console.log('Scanning all HTML pages for quantity selectors...\n');
  
  const directories = [
    'public/desktop',
    'public/mobile'
  ];
  
  const allResults = {
    enhanced: [],
    fixed_path: [],
    already_enhanced: [],
    no_selectors: [],
    errors: []
  };
  
  for (const dir of directories) {
    console.log(`\n📂 Processing: ${dir}`);
    console.log('-'.repeat(70));
    
    const results = scanDirectory(dir);
    
    for (const result of results) {
      const fileName = path.basename(result.path);
      const icons = {
        enhanced: '✅',
        fixed_path: '🔧',
        already_enhanced: '⏭️ ',
        no_selectors: '⚠️ ',
        error: '🔥'
      };
      
      const icon = icons[result.status];
      console.log(`${icon} ${fileName} - ${result.status.replace('_', ' ')}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      allResults[result.status].push(result);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Enhanced:          ${allResults.enhanced.length} pages`);
  console.log(`🔧 Fixed path:        ${allResults.fixed_path.length} pages`);
  console.log(`⏭️  Already enhanced:  ${allResults.already_enhanced.length} pages`);
  console.log(`⚠️  No selectors:      ${allResults.no_selectors.length} pages`);
  console.log(`🔥 Errors:            ${allResults.errors.length} pages`);
  console.log('='.repeat(70));
  
  if (allResults.enhanced.length > 0) {
    console.log('\n✨ Success! Enhanced pages:');
    allResults.enhanced.forEach(r => {
      console.log(`   - ${path.basename(r.path)}`);
    });
  }
  
  if (allResults.fixed_path.length > 0) {
    console.log('\n🔧 Fixed script paths in:');
    allResults.fixed_path.forEach(r => {
      console.log(`   - ${path.basename(r.path)}`);
    });
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      enhanced: allResults.enhanced.length,
      fixed_path: allResults.fixed_path.length,
      already_enhanced: allResults.already_enhanced.length,
      no_selectors: allResults.no_selectors.length,
      errors: allResults.errors.length
    },
    details: allResults
  };
  
  fs.writeFileSync('quantity-enhancement-report.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Detailed report saved to: quantity-enhancement-report.json');
  console.log('\n✅ Done! All pages processed.\n');
}

main();
