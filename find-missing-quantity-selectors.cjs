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
  
  const directories = ['desktop', 'mobile', 'public/desktop', 'public/mobile'];
  const missing = {
    desktop: [],
    mobile: [],
    'public/desktop': [],
    'public/mobile': []
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
  const totalMissing = Object.values(missing).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Desktop: ${missing.desktop.length} pages need enhancement`);
  console.log(`Mobile: ${missing.mobile.length} pages need enhancement`);
  console.log(`Public/Desktop: ${missing['public/desktop'].length} pages need enhancement`);
  console.log(`Public/Mobile: ${missing['public/mobile'].length} pages need enhancement`);
  console.log(`Total: ${totalMissing} pages need enhancement`);
  
  Object.keys(missing).forEach(dir => {
    if (missing[dir].length > 0) {
      console.log(`\n📱 ${dir.toUpperCase()} PAGES MISSING ENHANCEMENT:`);
      missing[dir].forEach(file => console.log(`   - ${file}`));
    }
  });
  
  // Write report
  const totalMissing = Object.values(missing).reduce((sum, arr) => sum + arr.length, 0);
  const report = {
    timestamp: new Date().toISOString(),
    total: totalMissing,
    desktop: missing.desktop,
    mobile: missing.mobile,
    'public/desktop': missing['public/desktop'],
    'public/mobile': missing['public/mobile']
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
