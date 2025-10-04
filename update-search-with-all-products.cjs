#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating search files with all products...\n');

// Read the scan report
const report = JSON.parse(fs.readFileSync('product-scan-report.json', 'utf-8'));

// Improved category detection
function getCategoryAndIcon(product) {
  const name = product.name.toLowerCase();
  const filename = product.filename.toLowerCase();
  
  // Gaming
  if (filename.includes('psn') || filename.includes('playstation') || name.includes('playstation')) {
    return { category: 'Gaming', icon: '🎮' };
  }
  if (filename.includes('xbox') || name.includes('xbox')) {
    return { category: 'Gaming', icon: '🎮' };
  }
  if (filename.includes('nintendo') || filename.includes('eshop') || name.includes('nintendo')) {
    return { category: 'Gaming', icon: '🎮' };
  }
  if (filename.includes('steam') || name.includes('steam')) {
    return { category: 'Gaming', icon: '🎮' };
  }
  if (filename.includes('fortnite') || filename.includes('roblox') || filename.includes('valorant') || 
      filename.includes('league-of-legends') || filename.includes('riot') || filename.includes('battlenet') ||
      filename.includes('battle.net') || filename.includes('ea-') || filename.includes('origin') ||
      filename.includes('hearthstone') || filename.includes('wow') || filename.includes('apex') ||
      filename.includes('pubg')) {
    return { category: 'Gaming', icon: '🎮' };
  }
  
  // Mobilfunk
  if (filename.includes('aufladen') || filename.includes('mobile') || filename.includes('prepaid') ||
      filename.includes('telekom') || filename.includes('vodafone') || filename.includes('o2') ||
      filename.includes('aldi-talk') || filename.includes('congstar') || filename.includes('lebara') ||
      filename.includes('lycamobile') || filename.includes('otelo') || filename.includes('klarmobil') ||
      filename.includes('blau') || filename.includes('ay-yildiz') || filename.includes('turk-telekom') ||
      filename.includes('ortel') || filename.includes('netzclub') || filename.includes('fyve') ||
      filename.includes('mobi') || filename.includes('eplus') || filename.includes('simyo') ||
      filename.includes('fonic') || filename.includes('bildmobil') || filename.includes('nettokom')) {
    return { category: 'Mobilfunk', icon: '📱' };
  }
  
  // Streaming
  if (filename.includes('netflix') || filename.includes('disney') || filename.includes('spotify') ||
      filename.includes('dazn') || filename.includes('rtl') || name.includes('streaming')) {
    return { category: 'Streaming', icon: '📺' };
  }
  
  // Shopping
  if (filename.includes('amazon') || filename.includes('zalando') || filename.includes('ikea') ||
      filename.includes('mediamarkt') || filename.includes('saturn') || filename.includes('otto') ||
      filename.includes('h&m') || filename.includes('nike') || filename.includes('adidas') ||
      filename.includes('douglas') || filename.includes('dm') || filename.includes('rossmann') ||
      filename.includes('c&a') || filename.includes('tchibo') || filename.includes('lush') ||
      filename.includes('mango') || filename.includes('cyberport') || filename.includes('tk-maxx')) {
    return { category: 'Shopping', icon: '🛒' };
  }
  
  // Zahlung / Payment
  if (filename.includes('paysafe') || filename.includes('cashlib') || filename.includes('neosurf') ||
      filename.includes('flexepin') || filename.includes('jeton') || filename.includes('bitsa') ||
      filename.includes('transcash') || filename.includes('pcs') || filename.includes('toneo') ||
      filename.includes('mifinity') || filename.includes('rewarble') || filename.includes('astropay')) {
    return { category: 'Zahlung', icon: '💳' };
  }
  
  // Entertainment / Verschiedenes
  if (filename.includes('google-play') || filename.includes('apple') || filename.includes('itunes') ||
      filename.includes('microsoft') || filename.includes('meta-quest')) {
    return { category: 'Apps & Dienste', icon: '📱' };
  }
  
  if (filename.includes('uber') || filename.includes('airbnb') || filename.includes('lieferando') ||
      filename.includes('jochen-schweizer') || filename.includes('eventim') || filename.includes('cineplex') ||
      filename.includes('ticketmaster')) {
    return { category: 'Services', icon: '🎫' };
  }
  
  if (filename.includes('twitch') || filename.includes('tiktok')) {
    return { category: 'Social Media', icon: '💬' };
  }
  
  return { category: 'Verschiedenes', icon: '🎁' };
}

// Extract price from product name
function extractPrice(name) {
  const priceMatch = name.match(/€\s*(\d+(?:,\d+)?)/);
  if (priceMatch) {
    return `ab €${priceMatch[1]}`;
  }
  return 'Preis variiert';
}

// Clean product name for better search
function cleanProductName(name) {
  return name
    .replace(/\s*-\s*Guthaben\s*€\d+.*online kaufen/i, '')
    .replace(/\s*Guthaben\s*€\d+.*online kaufen/i, '')
    .replace(/\s*kaufen\?.*$/i, '')
    .replace(/\s*\|\s*.*$/i, '')
    .trim();
}

// Get all valid products
const validProducts = report.allProducts || [];
console.log(`📊 Total valid products: ${validProducts.length}\n`);

// Group by base product name to avoid duplicates
const productMap = new Map();

validProducts.forEach(product => {
  const { category, icon } = getCategoryAndIcon(product);
  const price = extractPrice(product.name);
  const cleanName = cleanProductName(product.name);
  
  // Use clean name as key to group variations
  if (!productMap.has(cleanName)) {
    productMap.set(cleanName, {
      name: cleanName,
      category,
      price,
      icon,
      url: product.filename,
      searchTerms: product.name.toLowerCase()
    });
  }
});

const uniqueProducts = Array.from(productMap.values())
  .sort((a, b) => a.name.localeCompare(b.name));

console.log(`🎯 Unique products after deduplication: ${uniqueProducts.length}\n`);

// Generate JavaScript array string
function generateProductsArray(products) {
  const jsLines = products.map(product => {
    const escapedName = product.name.replace(/'/g, "\\'");
    return `    { name: '${escapedName}', category: '${product.category}', price: '${product.price}', icon: '${product.icon}', url: '${product.url}' }`;
  });
  
  return `const products = [\n${jsLines.join(',\n')}\n  ];`;
}

const productsArrayCode = generateProductsArray(uniqueProducts);

// Save to file for reference
fs.writeFileSync('products-search-array.js', productsArrayCode);
console.log('✅ Generated products-search-array.js\n');

// Update desktop search file
const desktopSearchPath = 'public/desktop/assets/universal-search.js';
if (fs.existsSync(desktopSearchPath)) {
  let desktopContent = fs.readFileSync(desktopSearchPath, 'utf-8');
  
  // Replace the products array
  const productsRegex = /const products = \[[\s\S]*?\];/;
  desktopContent = desktopContent.replace(productsRegex, productsArrayCode);
  
  fs.writeFileSync(desktopSearchPath, desktopContent);
  console.log('✅ Updated desktop/assets/universal-search.js');
} else {
  console.log('⚠️  Desktop search file not found');
}

// Update mobile search file
const mobileSearchPath = 'public/mobile/assets/universal-search.js';
if (fs.existsSync(mobileSearchPath)) {
  let mobileContent = fs.readFileSync(mobileSearchPath, 'utf-8');
  
  // Replace the products array
  const productsRegex = /const products = \[[\s\S]*?\];/;
  mobileContent = mobileContent.replace(productsRegex, productsArrayCode);
  
  fs.writeFileSync(mobileSearchPath, mobileContent);
  console.log('✅ Updated mobile/assets/universal-search.js');
} else {
  console.log('⚠️  Mobile search file not found');
}

// Stats by category
const byCategory = {};
uniqueProducts.forEach(p => {
  byCategory[p.category] = (byCategory[p.category] || 0) + 1;
});

console.log('\n📊 Products by category:');
Object.entries(byCategory)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });

console.log('\n✅ All search files updated successfully!\n');
console.log('💡 Next step: Test the search functionality on any page\n');
