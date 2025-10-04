// Injects quantity enhancement script into specified pages
// Usage: 
//   node inject-quantity-enhancement.cjs                    (auto-scan all pages)
//   node inject-quantity-enhancement.cjs page1.html page2.html  (specific pages)
//   node inject-quantity-enhancement.cjs desktop/page1.html mobile/page2.html

const fs = require('fs');
const path = require('path');

// Get pages from command line arguments (skip first 2: node and script path)
const CMD_PAGES = process.argv.slice(2);

function hasQuantitySelectors(content) {
  const patterns = [
    'role="combobox"',
    'product_card_quantity_select',
    'MuiSelect',
    'aria-haspopup="listbox"',
    'quantity-selector'
  ];
  return patterns.some(pattern => content.toLowerCase().includes(pattern.toLowerCase()));
}

function hasEnhancementScript(content) {
  return content.includes('../shared/universal-quantity-enhancement.js');
}

function hasWrongPath(content) {
  // Check if it has the old wrong path
  return content.includes('shared/universal-quantity-enhancement.js') && 
         !content.includes('../shared/universal-quantity-enhancement.js');
}

function injectScript(content, device) {
  // Always use relative path from device folder to shared folder
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

function processPage(pagePath) {
  const fullPath = path.join('public', pagePath);
  
  if (!fs.existsSync(fullPath)) {
    return { status: 'not_found', path: pagePath };
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (!hasQuantitySelectors(content)) {
      return { status: 'no_selectors', path: pagePath };
    }
    
    // Check if it needs fixing (wrong path)
    if (hasWrongPath(content)) {
      const fixedContent = content.replace(/src="shared\/universal-quantity-enhancement\.js"/g, 'src="../shared/universal-quantity-enhancement.js"');
      fs.writeFileSync(fullPath, fixedContent, 'utf8');
      return { status: 'fixed_path', path: pagePath };
    }
    
    if (hasEnhancementScript(content)) {
      return { status: 'already_enhanced', path: pagePath };
    }
    
    const device = pagePath.includes('mobile') ? 'mobile' : 'desktop';
    const newContent = injectScript(content, device);
    
    fs.writeFileSync(fullPath, newContent, 'utf8');
    return { status: 'enhanced', path: pagePath };
    
  } catch (error) {
    return { status: 'error', path: pagePath, error: error.message };
  }
}

function scanAllPages() {
  console.log('🔍 Scanning all pages in public/ directories...\n');
  
  const foundPages = [];
  const dirs = ['public/desktop', 'public/mobile'];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      if (hasQuantitySelectors(content) && !hasEnhancementScript(content)) {
        foundPages.push(dir.replace('public/', '') + '/' + file);
      }
    }
  }
  
  return foundPages;
}

function main() {
  console.log('🚀 Quantity Enhancement Injector\n');
  console.log('='.repeat(60));
  
  // Use command line arguments if provided, otherwise auto-scan
  let pagesToProcess = CMD_PAGES.length > 0 ? CMD_PAGES : [];
  
  if (pagesToProcess.length === 0) {
    console.log('📋 No pages specified, scanning for all pages needing enhancement...\n');
    pagesToProcess = scanAllPages();
    console.log(`Found ${pagesToProcess.length} pages needing enhancement\n`);
  } else {
    console.log(`📋 Processing ${pagesToProcess.length} pages from command line\n`);
  }
  
  if (pagesToProcess.length === 0) {
    console.log('✅ No pages need enhancement!');
    return;
  }
  
  const results = {
    enhanced: [],
    fixed_path: [],
    already_enhanced: [],
    no_selectors: [],
    not_found: [],
    errors: []
  };
  
  console.log(`Processing ${pagesToProcess.length} pages...\n`);
  
  for (const page of pagesToProcess) {
    const result = processPage(page);
    results[result.status].push(result);
    
    const icons = {
      enhanced: '✅',
      fixed_path: '🔧',
      already_enhanced: '⏭️ ',
      no_selectors: '⚠️ ',
      not_found: '❌',
      error: '🔥'
    };
    
    console.log(`${icons[result.status]} ${result.path} - ${result.status.replace('_', ' ')}`);
    if (result.error) console.log(`   Error: ${result.error}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Enhanced:          ${results.enhanced.length}`);
  console.log(`🔧 Fixed path:        ${results.fixed_path.length}`);
  console.log(`⏭️  Already enhanced:  ${results.already_enhanced.length}`);
  console.log(`⚠️  No selectors:      ${results.no_selectors.length}`);
  console.log(`❌ Not found:         ${results.not_found.length}`);
  console.log(`🔥 Errors:            ${results.errors.length}`);
  console.log('='.repeat(60));
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    processed: pagesToProcess.length,
    results
  };
  
  fs.writeFileSync('quantity-enhancement-report.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Report saved to: quantity-enhancement-report.json');
}

main();
