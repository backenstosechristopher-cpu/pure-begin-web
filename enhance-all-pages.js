#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Categories and their corresponding script files
const categoryMappings = {
  'amazon': 'amazon-quantity-enhancement.js',
  'google-play': 'google-play-quantity-enhancement.js',
  'apple': 'apple-quantity-enhancement.js',
  'battle': 'universal-quantity-enhancement.js',
  'fortnite': 'universal-quantity-enhancement.js',
  'hearthstone': 'universal-quantity-enhancement.js',
  'league-of-legends': 'universal-quantity-enhancement.js',
  'telekom': 'telekom-quantity-enhancement.js',
  'vodafone': 'vodafone-quantity-enhancement.js',
  'lebara': 'lebara-quantity-enhancement.js',
  'lycamobile': 'universal-quantity-enhancement.js',
  'aldi-talk': 'universal-quantity-enhancement.js',
  'congstar': 'congstar-quantity-enhancement.js',
  'klarmobil': 'klarmobil-quantity-enhancement.js',
  'blau': 'universal-quantity-enhancement.js',
  'bildmobil': 'universal-quantity-enhancement.js',
  'einfach-prepaid': 'universal-quantity-enhancement.js',
  'fonic': 'universal-quantity-enhancement.js',
  'fyve': 'universal-quantity-enhancement.js',
  'gt-mobile': 'universal-quantity-enhancement.js',
  'e-plus': 'universal-quantity-enhancement.js',
  'ay-yildiz': 'universal-quantity-enhancement.js',
  'blauworld': 'universal-quantity-enhancement.js'
};

// Function to determine script file based on filename
function getScriptForFile(filename) {
  // Check for specific categories first
  for (const [category, scriptFile] of Object.entries(categoryMappings)) {
    if (filename.includes(category)) {
      return scriptFile;
    }
  }
  
  // Default to universal enhancement
  return 'universal-quantity-enhancement.js';
}

// Function to check if HTML content has quantity selectors
function hasQuantitySelectors(content) {
  const indicators = [
    'MuiInput-input',
    'quantity',
    'Anzahl',
    'aria-label="Anzahl"',
    'input[type="number"]',
    'stepper',
    'increment',
    'decrement',
    '+',
    '-'
  ];
  
  return indicators.some(indicator => content.includes(indicator));
}

// Function to check if script is already injected
function hasScriptInjected(content) {
  return content.includes('quantity-enhancement.js') || 
         content.includes('Universal quantity enhancement loaded');
}

// Function to inject script into HTML
function injectScript(filePath, scriptName) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Skip if script already injected
    if (hasScriptInjected(content)) {
      return { processed: true, enhanced: false, reason: 'already_has_script' };
    }
    
    // Skip if no quantity selectors
    if (!hasQuantitySelectors(content)) {
      return { processed: true, enhanced: false, reason: 'no_quantity_selectors' };
    }
    
    // Find the last script tag or </body> tag to inject before
    const scriptTag = `<script src="${scriptName}" defer></script>`;
    
    let modifiedContent;
    if (content.includes('</body>')) {
      modifiedContent = content.replace('</body>', `${scriptTag}</body>`);
    } else if (content.includes('</script></body></html>')) {
      modifiedContent = content.replace('</script></body></html>', `</script>${scriptTag}</body></html>`);
    } else {
      // Fallback: add at the very end before </html>
      modifiedContent = content.replace('</html>', `${scriptTag}</html>`);
    }
    
    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent, 'utf-8');
      return { processed: true, enhanced: true, reason: 'script_added' };
    }
    
    return { processed: true, enhanced: false, reason: 'no_suitable_location' };
    
  } catch (error) {
    return { processed: false, enhanced: false, reason: `error: ${error.message}` };
  }
}

// Function to process directory
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const htmlFiles = files.filter(file => 
    file.startsWith('guthaben.de_') && 
    file.endsWith('.html')
  );
  
  let processedCount = 0;
  let enhancedCount = 0;
  const results = [];
  
  htmlFiles.forEach(filename => {
    const filePath = path.join(dirPath, filename);
    const scriptName = getScriptForFile(filename);
    const result = injectScript(filePath, scriptName);
    
    results.push({
      file: filename,
      script: scriptName,
      ...result
    });
    
    if (result.processed) processedCount++;
    if (result.enhanced) enhancedCount++;
  });
  
  return {
    directory: dirPath,
    totalFiles: htmlFiles.length,
    processedCount,
    enhancedCount,
    results
  };
}

// Main execution
function main() {
  console.log('🚀 Starting comprehensive quantity enhancement deployment...\n');
  
  const directories = ['desktop', 'mobile'];
  const allResults = [];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Processing ${dir} directory...`);
      const result = processDirectory(dir);
      allResults.push(result);
      
      console.log(`   ✅ ${result.enhancedCount}/${result.totalFiles} files enhanced`);
      console.log(`   📊 Categories found: ${[...new Set(result.results.map(r => r.script))].join(', ')}\n`);
    }
  });
  
  // Summary
  const totalProcessed = allResults.reduce((sum, r) => sum + r.processedCount, 0);
  const totalEnhanced = allResults.reduce((sum, r) => sum + r.enhancedCount, 0);
  const totalFiles = allResults.reduce((sum, r) => sum + r.totalFiles, 0);
  
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('===================');
  console.log(`📄 Total HTML files found: ${totalFiles}`);
  console.log(`⚡ Files enhanced with quantity selectors: ${totalEnhanced}`);
  console.log(`✅ Files processed: ${totalProcessed}`);
  
  // Detailed breakdown
  console.log('\n📊 ENHANCEMENT BREAKDOWN:');
  allResults.forEach(dirResult => {
    console.log(`\n${dirResult.directory.toUpperCase()}:`);
    
    const categoryBreakdown = {};
    dirResult.results.forEach(result => {
      if (result.enhanced) {
        const category = result.script.replace('-quantity-enhancement.js', '');
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      }
    });
    
    Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  📦 ${category}: ${count} pages`);
      });
  });
  
  console.log('\n🎯 All quantity selectors across prepaid, cards, game cards, and shopping pages have been enhanced!');
  
  return allResults;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { processDirectory, getScriptForFile, main };