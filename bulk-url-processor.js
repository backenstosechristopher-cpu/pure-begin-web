const fs = require('fs');
const path = require('path');

// Convert URL to filename
function urlToFilename(url) {
  let cleanUrl = url.replace(/^https?:\/\/guthaben\.de\/?/, '');
  if (!cleanUrl) return 'guthaben.de.html';
  
  // Handle special cases
  cleanUrl = cleanUrl.replace(/\/$/, ''); // Remove trailing slash
  
  return 'guthaben.de_' + cleanUrl.replace(/\//g, '_') + '.html';
}

// Check if content has quantity selectors
function hasQuantitySelectors(content) {
  const patterns = [
    'role="combobox"',
    'MuiSelect',
    'quantity',
    'Quantity', 
    'Anzahl',
    'product_card_quantity'
  ];
  
  return patterns.some(pattern => content.toLowerCase().includes(pattern.toLowerCase()));
}

// Check if script exists
function hasScript(content) {
  return content.includes('universal-quantity-enhancement.js');
}

// Add script to file
function processFile(directory, filename) {
  const filePath = path.join(directory, filename);
  
  try {
    if (!fs.existsSync(filePath)) {
      return { status: 'not_found' };
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!hasQuantitySelectors(content)) {
      return { status: 'no_selectors' };
    }
    
    if (hasScript(content)) {
      return { status: 'already_has_script' };
    }
    
    // Add script before closing tags
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
      return { status: 'enhanced' };
    }
    
    return { status: 'failed' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

// URLs to process
const urls = [
  'https://guthaben.de',
  'https://guthaben.de/google-play-guthaben',
  'https://guthaben.de/psn-card',
  'https://guthaben.de/handy-aufladen',
  'https://guthaben.de/paysafecard',
  'https://guthaben.de/cashlib',
  'https://guthaben.de/jeton-cash',
  'https://guthaben.de/transcash',
  'https://guthaben.de/bitsa',
  'https://guthaben.de/a-bon',
  'https://guthaben.de/pcs',
  'https://guthaben.de/mifinity',
  'https://guthaben.de/rewarble-advanced',
  'https://guthaben.de/mint-prepaid',
  'https://guthaben.de/aplauz',
  'https://guthaben.de/flexepin',
  'https://guthaben.de/toneo-first',
  'https://guthaben.de/entertainment-cards',
  'https://guthaben.de/tvnow',
  'https://guthaben.de/tinder-gold',
  'https://guthaben.de/tinder-plus',
  'https://guthaben.de/gamecards',
  'https://guthaben.de/paysafecard-players-pass',
  'https://guthaben.de/playstation-plus-mitgliedschaft',
  'https://guthaben.de/nintendo-switch-online',
  'https://guthaben.de/wow-gamecard',
  'https://guthaben.de/shopping-gutscheine',
  'https://guthaben.de/otto-gutscheincode',
  'https://guthaben.de/tchibo',
  'https://guthaben.de/tk-maxx'
];

// Process all URLs
function processAllUrls() {
  console.log('🔄 Processing URLs for quantity enhancement...\n');
  
  const results = {
    desktop: { processed: 0, enhanced: 0, already: 0, noSelectors: 0, notFound: 0, errors: 0 },
    mobile: { processed: 0, enhanced: 0, already: 0, noSelectors: 0, notFound: 0, errors: 0 }
  };
  
  const enhanced = [];
  
  urls.forEach(url => {
    const filename = urlToFilename(url);
    
    ['desktop', 'mobile'].forEach(dir => {
      results[dir].processed++;
      const result = processFile(dir, filename);
      
      switch (result.status) {
        case 'enhanced':
          results[dir].enhanced++;
          enhanced.push(`${dir}/${filename}`);
          console.log(`✅ Enhanced: ${dir}/${filename}`);
          break;
        case 'already_has_script':
          results[dir].already++;
          break;
        case 'no_selectors':
          results[dir].noSelectors++;
          break;
        case 'not_found':
          results[dir].notFound++;
          break;
        case 'error':
          results[dir].errors++;
          console.log(`❌ Error: ${dir}/${filename} - ${result.error}`);
          break;
      }
    });
  });
  
  // Summary
  console.log('\n📊 SUMMARY:');
  ['desktop', 'mobile'].forEach(dir => {
    const r = results[dir];
    console.log(`\n${dir.toUpperCase()}:`);
    console.log(`  📄 Processed: ${r.processed}`);
    console.log(`  ✅ Enhanced: ${r.enhanced}`);
    console.log(`  ⚪ Already had script: ${r.already}`);
    console.log(`  🔍 No quantity selectors: ${r.noSelectors}`);
    console.log(`  ❓ Not found: ${r.notFound}`);
    console.log(`  ❌ Errors: ${r.errors}`);
  });
  
  const totalEnhanced = results.desktop.enhanced + results.mobile.enhanced;
  console.log(`\n🎯 TOTAL ENHANCED: ${totalEnhanced} files`);
  
  if (enhanced.length > 0) {
    console.log('\n🚀 ENHANCED FILES:');
    enhanced.forEach(file => console.log(`  - ${file}`));
  }
  
  console.log('\n✨ All pages processed!');
}

if (require.main === module) {
  processAllUrls();
}

module.exports = { processAllUrls, urlToFilename, processFile };