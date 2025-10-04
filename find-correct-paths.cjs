#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 FINDING CORRECT PATHS FOR BROKEN URLS\n');

// Broken product names we need to find
const brokenProducts = [
  'minecraft',
  'nintendo-eshop',
  'paypal-guthabenkarte',
  'roblox',
  'skype',
  'spotify',
  'steam-gift-card',
  'telekom-aufladen',
  'valorant-riot-points',
  'xbox-live',
  'youtube-premium',
  'zalando'
];

// Get all HTML files from desktop and mobile directories
function getAllHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'));
}

// Find matching files for a product keyword
function findMatchingFiles(productKeyword) {
  const desktopFiles = getAllHtmlFiles('public/desktop');
  const mobileFiles = getAllHtmlFiles('public/mobile');
  
  // Search for files containing the product keyword
  const matches = {
    desktop: desktopFiles.filter(file => 
      file.toLowerCase().includes(productKeyword.toLowerCase())
    ),
    mobile: mobileFiles.filter(file => 
      file.toLowerCase().includes(productKeyword.toLowerCase())
    )
  };
  
  return matches;
}

// Main
const results = {};

brokenProducts.forEach(product => {
  console.log(`\n🔎 Searching for: ${product}`);
  const matches = findMatchingFiles(product);
  
  if (matches.desktop.length > 0 || matches.mobile.length > 0) {
    console.log(`   ✅ Found matches:`);
    if (matches.desktop.length > 0) {
      console.log(`      Desktop: ${matches.desktop[0]}`);
    }
    if (matches.mobile.length > 0) {
      console.log(`      Mobile: ${matches.mobile[0]}`);
    }
    results[product] = {
      broken: `guthaben.de_${product}.html`,
      correct: matches.desktop[0] || matches.mobile[0]
    };
  } else {
    console.log(`   ❌ No matching files found`);
    results[product] = {
      broken: `guthaben.de_${product}.html`,
      correct: null
    };
  }
});

// Save results
fs.writeFileSync('path-mapping.json', JSON.stringify(results, null, 2));
console.log('\n\n📄 Path mapping saved to: path-mapping.json');
