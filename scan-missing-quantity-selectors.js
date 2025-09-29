const fs = require('fs');
const path = require('path');

// Patterns to identify quantity selectors
const QUANTITY_PATTERNS = [
  'product_card_quantity_select',
  'data-quantity',
  'quantity.*select',
  'quantity.*button',
  'select.*quantity',
  'data-value="[0-9]+"',
  'data-denomination'
];

// Enhancement scripts to check for
const ENHANCEMENT_SCRIPTS = [
  'universal-quantity-enhancement.js',
  'quantity-enhancement.js',
  'blau-quantity-enhancement.js',
  'telekom-quantity-enhancement.js',
  'lebara-quantity-enhancement.js',
  'vodafone-quantity-enhancement.js',
  'klarmobil-quantity-enhancement.js'
];

// Specific pages mentioned by user
const PRIORITY_PAGES = [
  'pubg',
  'pub-mobile',
  'xbox',
  'meta-quest',
  'meta',
  'PUBG',
  'Xbox',
  'Meta'
];

function hasQuantitySelectors(content) {
  return QUANTITY_PATTERNS.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(content);
  });
}

function hasEnhancementScript(content) {
  return ENHANCEMENT_SCRIPTS.some(script => content.includes(script));
}

function addEnhancementScript(content, scriptName = 'universal-quantity-enhancement.js') {
  // Try to insert before </body>
  if (content.includes('</body>')) {
    return content.replace('</body>', `<script src="${scriptName}"></script></body>`);
  }
  // Try to insert before </html>
  if (content.includes('</html>')) {
    return content.replace('</html>', `<script src="${scriptName}"></script></html>`);
  }
  // Fallback: append at the end
  return content + `<script src="${scriptName}"></script>`;
}

function isPriorityPage(filename) {
  return PRIORITY_PAGES.some(keyword => 
    filename.toLowerCase().includes(keyword.toLowerCase())
  );
}

function scanDirectory(dirPath) {
  const results = {
    scanned: 0,
    withQuantitySelectors: 0,
    alreadyEnhanced: 0,
    needsEnhancement: 0,
    priorityPagesFound: [],
    pagesNeedingEnhancement: [],
    errors: []
  };

  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist`);
    return results;
  }

  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (!file.endsWith('.html') || !file.startsWith('guthaben.de_')) {
      continue;
    }

    results.scanned++;
    const filePath = path.join(dirPath, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (hasQuantitySelectors(content)) {
        results.withQuantitySelectors++;
        
        if (isPriorityPage(file)) {
          results.priorityPagesFound.push(file);
        }
        
        if (!hasEnhancementScript(content)) {
          results.needsEnhancement++;
          results.pagesNeedingEnhancement.push(file);
          
          // Add the enhancement script
          const enhancedContent = addEnhancementScript(content);
          fs.writeFileSync(filePath, enhancedContent, 'utf8');
          console.log(`✅ Enhanced: ${file}`);
        } else {
          results.alreadyEnhanced++;
          console.log(`⏭️  Already enhanced: ${file}`);
        }
      }
    } catch (error) {
      results.errors.push({ file, error: error.message });
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  return results;
}

function main() {
  console.log('🔍 Scanning for pages needing quantity selector enhancement...\n');
  
  const directories = ['desktop', 'mobile', 'public/desktop', 'public/mobile'];
  let totalResults = {
    scanned: 0,
    withQuantitySelectors: 0,
    alreadyEnhanced: 0,
    needsEnhancement: 0,
    priorityPagesFound: [],
    pagesNeedingEnhancement: [],
    errors: []
  };

  for (const dir of directories) {
    console.log(`\n📁 Processing ${dir}/...`);
    const results = scanDirectory(dir);
    
    // Aggregate results
    totalResults.scanned += results.scanned;
    totalResults.withQuantitySelectors += results.withQuantitySelectors;
    totalResults.alreadyEnhanced += results.alreadyEnhanced;
    totalResults.needsEnhancement += results.needsEnhancement;
    totalResults.priorityPagesFound.push(...results.priorityPagesFound.map(f => `${dir}/${f}`));
    totalResults.pagesNeedingEnhancement.push(...results.pagesNeedingEnhancement.map(f => `${dir}/${f}`));
    totalResults.errors.push(...results.errors.map(e => ({ ...e, file: `${dir}/${e.file}` })));
  }

  // Summary report
  console.log('\n' + '='.repeat(60));
  console.log('📊 QUANTITY SELECTOR ENHANCEMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`📄 Total pages scanned: ${totalResults.scanned}`);
  console.log(`🎯 Pages with quantity selectors: ${totalResults.withQuantitySelectors}`);
  console.log(`✅ Already enhanced: ${totalResults.alreadyEnhanced}`);
  console.log(`🔧 Newly enhanced: ${totalResults.needsEnhancement}`);
  console.log(`❌ Errors: ${totalResults.errors.length}`);

  if (totalResults.priorityPagesFound.length > 0) {
    console.log('\n🚨 PRIORITY PAGES FOUND:');
    totalResults.priorityPagesFound.forEach(page => console.log(`   • ${page}`));
  }

  if (totalResults.pagesNeedingEnhancement.length > 0) {
    console.log('\n🔧 PAGES ENHANCED:');
    totalResults.pagesNeedingEnhancement.forEach(page => console.log(`   • ${page}`));
  }

  if (totalResults.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    totalResults.errors.forEach(err => console.log(`   • ${err.file}: ${err.error}`));
  }

  console.log('\n✨ Scan complete!');
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, main };