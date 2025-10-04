#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map of broken product names to correct file paths (based on actual files found)
const pathMapping = {
  // Products that exist - using the first non-oesterreich version when available
  'nintendo-eshop': 'guthaben.de_nintendo-eshop-card.html',
  'roblox': 'guthaben.de_roblox-gift-card.html',
  'spotify': 'guthaben.de_spotify-premium-code-oesterreich.html', // Only Austria version exists
  'steam-gift-card': 'guthaben.de_steam-oesterreich.html', // Only Austria version exists  
  'telekom-aufladen': 'guthaben.de_telekom.html',
  'valorant-riot-points': 'guthaben.de_valorant.html',
  'xbox-live': 'guthaben.de_xbox-game-pass-oesterreich.html', // Only Austria version exists
  'zalando': 'guthaben.de_zalando-gutschein-oesterreich.html', // Only Austria version exists
  
  // Products that DON'T exist - will be removed
  'minecraft': null,
  'paypal-guthabenkarte': null,
  'skype': null,
  'youtube-premium': null
};

console.log('📋 BROKEN URL MAPPING:\n');
console.log('==========================================\n');

Object.entries(pathMapping).forEach(([product, correctPath]) => {
  const brokenPath = `guthaben.de_${product}.html`;
  
  if (correctPath) {
    console.log(`✅ ${product}`);
    console.log(`   Broken:  ${brokenPath}`);
    console.log(`   Correct: ${correctPath}`);
  } else {
    console.log(`❌ ${product}`);
    console.log(`   Broken:  ${brokenPath}`);
    console.log(`   Action:  REMOVE (file doesn't exist)`);
  }
  console.log('');
});

// Save to JSON
fs.writeFileSync('url-fix-mapping.json', JSON.stringify(pathMapping, null, 2));
console.log('\n📄 Mapping saved to: url-fix-mapping.json');
