// Injects quantity enhancement script into specified pages
// Usage: node inject-quantity-enhancement.cjs

const fs = require('fs');
const path = require('path');

// Add your list of pages here (relative paths from public/)
const PAGES_TO_ENHANCE = [
  'desktop/guthaben.de_lifecell_15-eur.html',
  'mobile/guthaben.de_lifecell_15-eur.html',
  // Add more pages here
];

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
  return content.includes('universal-quantity-enhancement.js');
}

function injectScript(content, device) {
  const scriptTag = `<script src="${device === 'mobile' ? '../' : ''}shared/universal-quantity-enhancement.js"></script>`;
  
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
  
  // If no pages specified, scan for all pages that need enhancement
  let pagesToProcess = PAGES_TO_ENHANCE.filter(p => p && !p.startsWith('//'));
  
  if (pagesToProcess.length === 0) {
    console.log('📋 No pages specified, scanning for all pages needing enhancement...\n');
    pagesToProcess = scanAllPages();
    console.log(`Found ${pagesToProcess.length} pages needing enhancement\n`);
  }
  
  if (pagesToProcess.length === 0) {
    console.log('✅ No pages need enhancement!');
    return;
  }
  
  const results = {
    enhanced: [],
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
