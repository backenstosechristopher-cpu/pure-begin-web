const fs = require('fs');
const path = require('path');

// Convert URL to file path
function urlToFilePath(url, directory) {
  // Remove protocol and domain
  let cleanUrl = url.replace(/^https?:\/\/guthaben\.de\/?/, '');
  
  // Handle root URL
  if (!cleanUrl) {
    return path.join(directory, 'guthaben.de.html');
  }
  
  // Convert slashes to underscores and add guthaben.de_ prefix
  let fileName = 'guthaben.de_' + cleanUrl.replace(/\//g, '_') + '.html';
  
  return path.join(directory, fileName);
}

// Check if file has quantity selectors
function hasQuantitySelectors(content) {
  const patterns = [
    'role="combobox"',
    'MuiSelect',
    'quantity',
    'Quantity',
    'Anzahl',
    'product_card_quantity',
    'data-testid.*quantity',
    'aria-label.*quantity',
    'aria-label.*Quantity',
    'aria-label.*Anzahl'
  ];
  
  return patterns.some(pattern => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(content);
  });
}

// Check if script already exists
function hasEnhancementScript(content) {
  return content.includes('universal-quantity-enhancement.js');
}

// Add script to file
function addScriptToFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { status: 'not_found', reason: 'File does not exist' };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!hasQuantitySelectors(content)) {
      return { status: 'no_selectors', reason: 'No quantity selectors found' };
    }
    
    if (hasEnhancementScript(content)) {
      return { status: 'already_enhanced', reason: 'Script already present' };
    }
    
    // Add script before closing body/html tags
    let enhanced = content;
    if (content.includes('</body></html>')) {
      enhanced = content.replace('</body></html>', '<script src="universal-quantity-enhancement.js"></script></body></html>');
    } else if (content.includes('</body>')) {
      enhanced = content.replace('</body>', '<script src="universal-quantity-enhancement.js"></script></body>');
    } else if (content.includes('</html>')) {
      enhanced = content.replace('</html>', '<script src="universal-quantity-enhancement.js"></script></html>');
    } else {
      enhanced = content + '\n<script src="universal-quantity-enhancement.js"></script>';
    }
    
    if (enhanced !== content) {
      fs.writeFileSync(filePath, enhanced, 'utf8');
      return { status: 'enhanced', reason: 'Script added successfully' };
    }
    
    return { status: 'error', reason: 'Could not inject script' };
  } catch (error) {
    return { status: 'error', reason: error.message };
  }
}

// URLs to process
const urls = [
  'https://guthaben.de',
  'https://guthaben.de/',
  'https://guthaben.de/google-play-guthaben',
  'https://guthaben.de/psn-card',
  'https://guthaben.de/handy-aufladen',
  'https://guthaben.de/e-plus-aufladen',
  'https://guthaben.de/vodafone-aufladen',
  'https://guthaben.de/telekom',
  'https://guthaben.de/lycamobile-aufladen',
  'https://guthaben.de/ortel-mobile-aufladen',
  'https://guthaben.de/blau-de-aufladen',
  'https://guthaben.de/congstar-aufladen',
  'https://guthaben.de/lebara-aufladen',
  'https://guthaben.de/fonic-aufladen',
  'https://guthaben.de/klarmobil-aufladen',
  'https://guthaben.de/otelo-aufladen',
  'https://guthaben.de/bildmobil-aufladen',
  'https://guthaben.de/blauworld-aufladen',
  'https://guthaben.de/mobi-aufladen',
  'https://guthaben.de/paysafecard',
  'https://guthaben.de/cashlib',
  'https://guthaben.de/jeton-cash',
  'https://guthaben.de/transcash',
  'https://guthaben.de/bitsa',
  'https://guthaben.de/a-bon',
  'https://guthaben.de/pcs',
  'https://guthaben.de/mifinity',
  'https://guthaben.de/aplauz',
  'https://guthaben.de/flexepin',
  'https://guthaben.de/apple-gift-card',
  'https://guthaben.de/netflix-geschenkkarte',
  'https://guthaben.de/spotify-premium',
  'https://guthaben.de/disney-plus',
  'https://guthaben.de/dazn',
  'https://guthaben.de/eventim',
  'https://guthaben.de/cineplex',
  'https://guthaben.de/jochen-schweizer',
  'https://guthaben.de/microsoft-geschenkkarte',
  'https://guthaben.de/twitch-geschenkkarte',
  'https://guthaben.de/steam',
  'https://guthaben.de/xbox-gift-card',
  'https://guthaben.de/nintendo-eshop-card',
  'https://guthaben.de/roblox-gift-card',
  'https://guthaben.de/battlenet-guthabenkarte',
  'https://guthaben.de/league-of-legends-riot-points',
  'https://guthaben.de/valorant',
  'https://guthaben.de/amazon-gutschein',
  'https://guthaben.de/zalando-gutscheincode',
  'https://guthaben.de/lieferando',
  'https://guthaben.de/uber',
  'https://guthaben.de/airbnb',
  'https://guthaben.de/douglas',
  'https://guthaben.de/nike-gutscheincode',
  'https://guthaben.de/ikea',
  'https://guthaben.de/h-m-geschenkcode',
  'https://guthaben.de/mediamarkt',
  'https://guthaben.de/ay-yildiz-aufladen',
  'https://guthaben.de/nettokom-aufladen',
  'https://guthaben.de/aldi-talk-aufladen',
  'https://guthaben.de/rossmann-mobil-aufladen',
  'https://guthaben.de/turk-telekom-aufladen',
  'https://guthaben.de/fyve-aufladen',
  'https://guthaben.de/einfach-prepaid-aufladen',
  'https://guthaben.de/gt-mobile-aufladen',
  'https://guthaben.de/netzclub-aufladen',
  'https://guthaben.de/simyo',
  'https://guthaben.de/o2-aufladen',
  'https://guthaben.de/libon',
  'https://guthaben.de/lifecell',
  'https://guthaben.de/meta-quest',
  'https://guthaben.de/tiktok-de',
  'https://guthaben.de/ea-game-card',
  'https://guthaben.de/razer-gold',
  'https://guthaben.de/candy-crush',
  'https://guthaben.de/hearthstone-guthabenkarte',
  'https://guthaben.de/fortnite'
];

// Main processing function
function processUrls() {
  console.log('🔍 COMPREHENSIVE URL SCANNER FOR QUANTITY SELECTORS');
  console.log('==================================================\n');
  
  const results = {
    desktop: { scanned: 0, enhanced: 0, alreadyEnhanced: 0, noSelectors: 0, notFound: 0, errors: 0 },
    mobile: { scanned: 0, enhanced: 0, alreadyEnhanced: 0, noSelectors: 0, notFound: 0, errors: 0 }
  };
  
  const enhancedFiles = [];
  
  urls.forEach(url => {
    ['desktop', 'mobile'].forEach(directory => {
      const filePath = urlToFilePath(url, directory);
      const fileName = path.basename(filePath);
      
      results[directory].scanned++;
      
      const result = addScriptToFile(filePath);
      
      switch (result.status) {
        case 'enhanced':
          results[directory].enhanced++;
          enhancedFiles.push(`${directory}/${fileName}`);
          console.log(`✅ Enhanced: ${directory}/${fileName}`);
          break;
        case 'already_enhanced':
          results[directory].alreadyEnhanced++;
          break;
        case 'no_selectors':
          results[directory].noSelectors++;
          break;
        case 'not_found':
          results[directory].notFound++;
          break;
        case 'error':
          results[directory].errors++;
          console.log(`❌ Error in ${directory}/${fileName}: ${result.reason}`);
          break;
      }
    });
  });
  
  // Summary
  console.log('\n📊 SCAN RESULTS SUMMARY');
  console.log('=======================');
  
  ['desktop', 'mobile'].forEach(dir => {
    const r = results[dir];
    console.log(`\n📁 ${dir.toUpperCase()}:`);
    console.log(`   📄 Files scanned: ${r.scanned}`);
    console.log(`   ✅ Enhanced: ${r.enhanced}`);
    console.log(`   ⚪ Already enhanced: ${r.alreadyEnhanced}`);
    console.log(`   🔍 No quantity selectors: ${r.noSelectors}`);
    console.log(`   ❓ Files not found: ${r.notFound}`);
    console.log(`   ❌ Errors: ${r.errors}`);
  });
  
  const totalEnhanced = results.desktop.enhanced + results.mobile.enhanced;
  const totalScanned = results.desktop.scanned + results.mobile.scanned;
  
  console.log(`\n🎯 TOTAL ENHANCED: ${totalEnhanced}/${totalScanned} files`);
  
  if (enhancedFiles.length > 0) {
    console.log('\n🚀 NEWLY ENHANCED FILES:');
    enhancedFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  console.log('\n✨ Scan complete! All pages with quantity selectors now have the enhancement.');
  
  return results;
}

// Run the scanner
if (require.main === module) {
  processUrls();
}

module.exports = { processUrls, urlToFilePath, addScriptToFile };