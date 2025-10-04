#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Detection for quantity selectors
function hasQuantitySelectors(content) {
  const indicators = [
    'product_card',
    'quantity',
    'Anzahl', 
    'MuiSelect',
    'select',
    'dropdown',
    'combobox',
    'stepper',
    'input[type="number"]',
    'role="combobox"',
    'fixed_value_'
  ];
  
  return indicators.some(indicator => 
    content.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Check if script already exists
function hasEnhancementScript(content) {
  return content.includes('quantity-enhancement.js') || 
         content.includes('universal-quantity-enhancement.js');
}

// Find all pages missing quantity selectors
function findMissingPages() {
  console.log('🔍 SCANNING FOR PAGES MISSING QUANTITY SELECTORS');
  console.log('=================================================\n');
  
  const directories = ['desktop', 'mobile'];
  const missing = {
    desktop: [],
    mobile: []
  };
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Directory ${dir} not found\n`);
      return;
    }
    
    console.log(`📁 Scanning ${dir.toUpperCase()} directory...`);
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .sort();
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const hasSelectors = hasQuantitySelectors(content);
      const hasScript = hasEnhancementScript(content);
      
      if (hasSelectors && !hasScript) {
        missing[dir].push(file);
        console.log(`   ❌ MISSING: ${file}`);
      }
    });
    
    console.log(`   Found ${missing[dir].length} pages without enhancement\n`);
  });
  
  // Summary
  console.log('\n📋 SUMMARY');
  console.log('=========');
  console.log(`Desktop: ${missing.desktop.length} pages need enhancement`);
  console.log(`Mobile: ${missing.mobile.length} pages need enhancement`);
  console.log(`Total: ${missing.desktop.length + missing.mobile.length} pages need enhancement`);
  
  if (missing.desktop.length > 0) {
    console.log('\n📱 DESKTOP PAGES MISSING ENHANCEMENT:');
    missing.desktop.forEach(file => console.log(`   - ${file}`));
  }
  
  if (missing.mobile.length > 0) {
    console.log('\n📱 MOBILE PAGES MISSING ENHANCEMENT:');
    missing.mobile.forEach(file => console.log(`   - ${file}`));
  }
  
  // Write report
  const report = {
    timestamp: new Date().toISOString(),
    total: missing.desktop.length + missing.mobile.length,
    desktop: missing.desktop,
    mobile: missing.mobile
  };
  
  fs.writeFileSync('missing-quantity-selectors-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to: missing-quantity-selectors-report.json');
  
  return report;
}

// Run scan
if (require.main === module) {
  findMissingPages();
}

module.exports = { findMissingPages };
