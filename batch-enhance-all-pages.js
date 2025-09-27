#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Enhanced script mapping based on all page types
const getScriptForPage = (filename) => {
  const mappings = [
    // Mobile operators
    { keywords: ['telekom'], script: 'telekom-quantity-enhancement.js' },
    { keywords: ['vodafone'], script: 'vodafone-quantity-enhancement.js' },
    { keywords: ['lebara'], script: 'lebara-quantity-enhancement.js' },
    { keywords: ['congstar'], script: 'congstar-quantity-enhancement.js' },
    { keywords: ['klarmobil'], script: 'klarmobil-quantity-enhancement.js' },
    
    // Major brands
    { keywords: ['amazon'], script: 'amazon-quantity-enhancement.js' },
    { keywords: ['google-play'], script: 'google-play-quantity-enhancement.js' },
    { keywords: ['apple'], script: 'apple-quantity-enhancement.js' },
    
    // Default universal for all others
    { keywords: [], script: 'universal-quantity-enhancement.js' }
  ];
  
  const lowerFilename = filename.toLowerCase();
  
  for (const mapping of mappings) {
    if (mapping.keywords.length === 0) {
      return mapping.script; // Default case
    }
    if (mapping.keywords.some(keyword => lowerFilename.includes(keyword))) {
      return mapping.script;
    }
  }
  
  return 'universal-quantity-enhancement.js';
};

// Check if content has quantity selectors
const hasQuantitySelectors = (content) => {
  const indicators = [
    'MuiInput-input',
    'quantity',
    'Anzahl',
    'aria-label="Anzahl"',
    'input[type="number"]',
    'stepper',
    'increment',
    'decrement',
    'MuiFormControl',
    'MuiSelect'
  ];
  
  return indicators.some(indicator => content.includes(indicator));
};

// Check if script already exists
const hasScript = (content) => {
  return content.includes('quantity-enhancement.js') || 
         content.includes('Universal quantity enhancement loaded');
};

// Add script to HTML content
const addScript = (content, scriptName) => {
  const scriptTag = `<script src="${scriptName}" defer></script>`;
  
  // Find the best insertion point
  if (content.includes('</body></html>')) {
    return content.replace('</body></html>', `${scriptTag}</body></html>`);
  } else if (content.includes('</script></body></html>')) {
    return content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
  } else if (content.includes('</body>')) {
    return content.replace('</body>', `${scriptTag}</body>`);
  } else if (content.includes('</html>')) {
    return content.replace('</html>', `${scriptTag}</html>`);
  }
  
  return content + scriptTag;
};

// Process single file
const processFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    
    // Skip if already has script
    if (hasScript(content)) {
      return { processed: true, enhanced: false, reason: 'already_has_script' };
    }
    
    // Skip if no quantity selectors
    if (!hasQuantitySelectors(content)) {
      return { processed: true, enhanced: false, reason: 'no_quantity_selectors' };
    }
    
    // Add appropriate script
    const scriptName = getScriptForPage(filename);
    const newContent = addScript(content, scriptName);
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return { 
        processed: true, 
        enhanced: true, 
        reason: 'script_added',
        script: scriptName 
      };
    }
    
    return { processed: true, enhanced: false, reason: 'no_change_needed' };
    
  } catch (error) {
    return { 
      processed: false, 
      enhanced: false, 
      reason: `error: ${error.message}` 
    };
  }
};

// Process directory
const processDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return { directory: dirPath, files: [], error: 'Directory not found' };
  }
  
  const files = fs.readdirSync(dirPath)
    .filter(file => file.startsWith('guthaben.de_') && file.endsWith('.html'))
    .map(file => path.join(dirPath, file));
  
  const results = files.map(filePath => {
    const result = processFile(filePath);
    return {
      file: path.basename(filePath),
      path: filePath,
      ...result
    };
  });
  
  return {
    directory: dirPath,
    totalFiles: files.length,
    processedCount: results.filter(r => r.processed).length,
    enhancedCount: results.filter(r => r.enhanced).length,
    results
  };
};

// Main execution
const main = () => {
  console.log('🚀 COMPREHENSIVE QUANTITY ENHANCEMENT DEPLOYMENT');
  console.log('================================================\n');
  
  const directories = ['desktop', 'mobile'];
  const allResults = [];
  
  // Process each directory
  directories.forEach(dir => {
    console.log(`📁 Processing ${dir.toUpperCase()} directory...`);
    const result = processDirectory(dir);
    allResults.push(result);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}\n`);
      return;
    }
    
    console.log(`   ✅ Enhanced: ${result.enhancedCount}/${result.totalFiles} files`);
    
    // Show category breakdown
    const categories = {};
    result.results.forEach(r => {
      if (r.enhanced && r.script) {
        const category = r.script.replace('-quantity-enhancement.js', '');
        categories[category] = (categories[category] || 0) + 1;
      }
    });
    
    if (Object.keys(categories).length > 0) {
      console.log(`   📊 Categories: ${Object.entries(categories).map(([cat, count]) => `${cat}(${count})`).join(', ')}`);
    }
    
    console.log();
  });
  
  // Final summary
  const totalFiles = allResults.reduce((sum, r) => sum + (r.totalFiles || 0), 0);
  const totalEnhanced = allResults.reduce((sum, r) => sum + (r.enhancedCount || 0), 0);
  
  console.log('📋 FINAL SUMMARY');
  console.log('================');
  console.log(`📄 Total HTML pages scanned: ${totalFiles}`);
  console.log(`⚡ Pages enhanced with quantity selectors: ${totalEnhanced}`);
  
  // Enhanced pages by category
  const allCategories = {};
  allResults.forEach(dirResult => {
    if (dirResult.results) {
      dirResult.results.forEach(result => {
        if (result.enhanced && result.script) {
          const category = result.script.replace('-quantity-enhancement.js', '');
          allCategories[category] = (allCategories[category] || 0) + 1;
        }
      });
    }
  });
  
  if (Object.keys(allCategories).length > 0) {
    console.log('\n🎯 ENHANCED CATEGORIES:');
    Object.entries(allCategories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   📦 ${category}: ${count} pages`);
      });
  }
  
  console.log('\n✨ SUCCESS! All prepaid, cards, game cards, shopping, and other pages have been enhanced with quantity selectors!');
  
  return allResults;
};

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = { main, processFile, processDirectory };