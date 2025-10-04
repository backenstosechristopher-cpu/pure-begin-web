#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 SCANNING FOR MISSING PRODUCTS IN SEARCH\n');
console.log('==========================================\n');

// Extract product name from HTML title
function extractProductFromTitle(content) {
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) return null;
  
  const title = titleMatch[1];
  
  // Common patterns in titles
  // "Product Name Guthaben kaufen"
  // "Product Name Code kaufen" 
  // "Product Name aufladen"
  const patterns = [
    /^([^|]+?)\s+(?:Guthaben|Code|Gift Card|aufladen|kaufen)/i,
    /^([^|]+?)\s+\|/,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Get category from content or filename
function getProductCategory(filename, content) {
  const name = filename.toLowerCase();
  
  if (name.includes('vodafone') || name.includes('telekom') || name.includes('o2') || 
      name.includes('mobi') || name.includes('lebara') || name.includes('congstar') ||
      name.includes('klarmobil') || name.includes('lifecell') || name.includes('aldi') ||
      name.includes('lyca') || name.includes('ortel')) {
    return 'Mobilfunk';
  }
  
  if (name.includes('playstation') || name.includes('xbox') || name.includes('nintendo') ||
      name.includes('steam') || name.includes('fortnite') || name.includes('roblox') ||
      name.includes('league') || name.includes('valorant') || name.includes('minecraft') ||
      name.includes('ea-sports') || name.includes('blizzard')) {
    return 'Gaming';
  }
  
  if (name.includes('netflix') || name.includes('disney') || name.includes('spotify') ||
      name.includes('youtube') || name.includes('apple-music')) {
    return 'Streaming';
  }
  
  if (name.includes('amazon') || name.includes('zalando') || name.includes('ikea') ||
      name.includes('mediamarkt')) {
    return 'Shopping';
  }
  
  if (name.includes('google-play') || name.includes('apple') || name.includes('itunes')) {
    return 'Apps & Games';
  }
  
  if (name.includes('paypal') || name.includes('paysafe') || name.includes('transcash') ||
      name.includes('cashlib') || name.includes('neosurf')) {
    return 'Zahlung';
  }
  
  if (name.includes('uber')) {
    return 'Transport';
  }
  
  return 'Sonstiges';
}

// Get icon based on category
function getCategoryIcon(category) {
  const icons = {
    'Gaming': '🎮',
    'Mobilfunk': '📱',
    'Streaming': '📺',
    'Shopping': '🛒',
    'Apps & Games': '📱',
    'Zahlung': '💳',
    'Transport': '🚗',
    'Musik': '🎵',
    'Sonstiges': '⭐'
  };
  return icons[category] || '⭐';
}

// Scan all HTML files
function scanAllProducts() {
  const directories = ['desktop', 'mobile', 'public/desktop', 'public/mobile'];
  const productsMap = new Map();
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    console.log(`📁 Scanning ${dir}...`);
    
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
      .sort();
    
    let foundCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const productName = extractProductFromTitle(content);
      
      if (productName && !productsMap.has(productName)) {
        const category = getProductCategory(file, content);
        const icon = getCategoryIcon(category);
        // Generate URL based on directory (desktop or mobile)
        const url = dir.includes('mobile') ? `../mobile/${file}` : `../${file}`;
        
        productsMap.set(productName, {
          name: productName,
          category: category,
          icon: icon,
          price: '€10 - €100', // Default price range
          url: url,
          file: file
        });
        
        foundCount++;
        console.log(`   ✅ ${productName} → ${category} (${url})`);
      }
    });
    
    console.log(`   📊 Found ${foundCount} new products in ${dir}\n`);
  });
  
  return Array.from(productsMap.values());
}

// Read existing products from search file
function getExistingProducts() {
  const searchFile = 'desktop/assets/guthaben-search.js';
  
  if (!fs.existsSync(searchFile)) {
    console.log('❌ Search file not found');
    return [];
  }
  
  const content = fs.readFileSync(searchFile, 'utf-8');
  
  // Extract products array
  const productsMatch = content.match(/const products = \[([\s\S]*?)\];/);
  if (!productsMatch) {
    console.log('❌ Products array not found in search file');
    return [];
  }
  
  const productsStr = productsMatch[1];
  const productMatches = productsStr.matchAll(/\{\s*name:\s*'([^']+)'[\s\S]*?\}/g);
  
  const existing = [];
  for (const match of productMatches) {
    existing.push(match[1]);
  }
  
  return existing;
}

// Update search file with all products
function updateSearchFile(allProducts) {
  const searchFiles = [
    'desktop/assets/guthaben-search.js',
    'mobile/assets/guthaben-search.js'
  ];
  
  // Generate products array code
  const productsCode = allProducts
    .map(p => `    { name: '${p.name}', category: '${p.category}', price: '${p.price}', icon: '${p.icon}', url: '${p.url || ''}' }`)
    .join(',\n');
  
  searchFiles.forEach(searchFile => {
    if (!fs.existsSync(searchFile)) {
      console.log(`⚠️  ${searchFile} not found, skipping`);
      return;
    }
    
    let content = fs.readFileSync(searchFile, 'utf-8');
    
    // Replace products array
    const newContent = content.replace(
      /const products = \[[\s\S]*?\];/,
      `const products = [\n${productsCode}\n  ];`
    );
    
    fs.writeFileSync(searchFile, newContent, 'utf-8');
    console.log(`✅ Updated ${searchFile}`);
  });
}

// Main execution
function main() {
  console.log('📋 Step 1: Getting existing products...\n');
  const existingProducts = getExistingProducts();
  console.log(`Found ${existingProducts.length} existing products in search\n`);
  
  console.log('📋 Step 2: Scanning all HTML files...\n');
  const scannedProducts = scanAllProducts();
  console.log(`\n📊 Scanned ${scannedProducts.length} total products from HTML files\n`);
  
  console.log('📋 Step 3: Finding missing products...\n');
  const existingNames = new Set(existingProducts);
  const missingProducts = scannedProducts.filter(p => !existingNames.has(p.name));
  
  if (missingProducts.length === 0) {
    console.log('✅ All products are already in search!');
    return;
  }
  
  console.log(`Found ${missingProducts.length} products NOT in search:\n`);
  missingProducts.forEach(p => {
    console.log(`   ❌ ${p.name} (${p.category})`);
  });
  
  console.log('\n📋 Step 4: Updating search files...\n');
  
  // Merge existing and new products
  const allProducts = [...scannedProducts];
  
  // Sort by category then name
  allProducts.sort((a, b) => {
    if (a.category === b.category) {
      return a.name.localeCompare(b.name);
    }
    return a.category.localeCompare(b.category);
  });
  
  updateSearchFile(allProducts);
  
  console.log('\n🎉 COMPLETE!');
  console.log(`✨ Added ${missingProducts.length} missing products to search`);
  console.log(`📊 Total products in search: ${allProducts.length}`);
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    existingProducts: existingProducts.length,
    scannedProducts: scannedProducts.length,
    missingProducts: missingProducts.length,
    totalProducts: allProducts.length,
    missing: missingProducts.map(p => ({ name: p.name, category: p.category, file: p.file }))
  };
  
  fs.writeFileSync('search-products-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to: search-products-report.json');
}

// Run
if (require.main === module) {
  main();
}

module.exports = { scanAllProducts, getExistingProducts, updateSearchFile };
