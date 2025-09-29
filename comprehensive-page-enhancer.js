const fs = require('fs');
const path = require('path');

console.log('🎯 Starting comprehensive page enhancement for Weiterlesen and value buttons...\n');

// Key brand pages that likely have both Weiterlesen and Euro amount buttons
const targetPages = [
  // Major brand pages
  'guthaben.de_amazon-gutschein.html',
  'guthaben.de_apple-gift-card.html', 
  'guthaben.de_steam.html',
  'guthaben.de_netflix.html',
  'guthaben.de_spotify.html',
  'guthaben.de_disney-plus.html',
  'guthaben.de_airbnb.html',
  'guthaben.de_lieferando.html',
  'guthaben.de_zalando.html',
  'guthaben.de_h-m-geschenkcode.html',
  'guthaben.de_mediamarkt.html',
  'guthaben.de_ikea.html',
  'guthaben.de_douglas.html',
  'guthaben.de_cashlib.html',
  'guthaben.de_bitsa.html',
  'guthaben.de_flexepin.html',
  'guthaben.de_jeton-cash.html',
  'guthaben.de_aplauz.html',
  'guthaben.de_paysafecard.html',
  'guthaben.de_battlenet-guthabenkarte.html',
  'guthaben.de_xbox.html',
  'guthaben.de_playstation.html',
  'guthaben.de_nintendo.html'
];

function hasWeitreilesenOrEuroButtons(content) {
  const patterns = [
    'Weiterlesen',
    '€15', '€25', '€50', '€100',
    '15 €', '25 €', '50 €', '100 €',
    'data-value="15"', 'data-value="25"', 'data-value="50"', 'data-value="100"'
  ];
  return patterns.some(pattern => content.includes(pattern));
}

function hasExistingEnhancement(content) {
  return content.includes('Remove Weiterlesen buttons') || 
         content.includes('value-btn-active') ||
         content.includes('// Enhanced with comprehensive page enhancer');
}

function addComprehensiveEnhancement(content) {
  const enhancementScript = `
<script>
// Enhanced with comprehensive page enhancer
// Remove Weiterlesen buttons
document.addEventListener('DOMContentLoaded', function() {
  const weitrelesenButtons = document.querySelectorAll('button, a, [role="button"], .MuiButtonBase-root');
  weitrelesenButtons.forEach(btn => {
    if (btn.textContent && btn.textContent.includes('Weiterlesen')) {
      console.log('Removing Weiterlesen button:', btn);
      btn.remove();
    }
  });
});

// Add blue border styling to value buttons  
document.addEventListener('DOMContentLoaded', function() {
  const valueButtons = document.querySelectorAll('[data-value], button[class*="value"], button[class*="amount"], button[class*="btn"], .MuiButton-root');
  valueButtons.forEach(btn => {
    // Check if button contains Euro amounts or has data-value
    if ((btn.textContent && (btn.textContent.includes('€') || btn.textContent.includes('EUR'))) || 
        btn.hasAttribute('data-value')) {
      btn.addEventListener('click', function() {
        // Remove active class from all value buttons
        valueButtons.forEach(b => b.classList.remove('value-btn-active'));
        // Add active class to clicked button
        this.classList.add('value-btn-active');
        console.log('Value button clicked:', this.textContent || this.getAttribute('data-value'));
      });
    }
  });
});
</script>

<style>
.value-btn-active {
  border: 2px solid #1976d2 !important;
  background-color: rgba(25, 118, 210, 0.1) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3) !important;
}
</style>`;

  // Insert before the last script tag or before </body>
  if (content.includes('<script src="universal-quantity-enhancement.js"></script>')) {
    return content.replace('<script src="universal-quantity-enhancement.js"></script>', 
      `${enhancementScript}<script src="universal-quantity-enhancement.js"></script>`);
  } else if (content.includes('</body>')) {
    return content.replace('</body>', `${enhancementScript}</body>`);
  } else if (content.includes('</html>')) {
    return content.replace('</html>', `${enhancementScript}</html>`);
  }
  return content + enhancementScript;
}

function enhanceFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { status: 'not_found', reason: 'File does not exist' };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!hasWeitreilesenOrEuroButtons(content)) {
      return { status: 'skipped', reason: 'No Weiterlesen or Euro buttons found' };
    }

    if (hasExistingEnhancement(content)) {
      return { status: 'already_enhanced', reason: 'Already has comprehensive enhancement' };
    }

    const enhancedContent = addComprehensiveEnhancement(content);
    fs.writeFileSync(filePath, enhancedContent, 'utf8');
    
    return { status: 'enhanced', reason: 'Successfully enhanced' };
  } catch (error) {
    return { status: 'error', reason: error.message };
  }
}

function processAllDirectories() {
  const directories = ['desktop', 'mobile', 'public/desktop', 'public/mobile'];
  let totalEnhanced = 0;
  let results = {
    enhanced: [],
    skipped: [],
    already_enhanced: [],
    not_found: [],
    errors: []
  };

  directories.forEach(dir => {
    console.log(`📁 Processing ${dir}/ directory...`);
    
    if (!fs.existsSync(dir)) {
      console.log(`   ⚠️  Directory ${dir} does not exist, skipping...`);
      return;
    }

    // Process target pages
    targetPages.forEach(page => {
      const filePath = path.join(dir, page);
      const result = enhanceFile(filePath);
      
      if (result.status === 'enhanced') {
        totalEnhanced++;
        results.enhanced.push(`${dir}/${page}`);
        console.log(`   ✅ Enhanced: ${page}`);
      } else if (result.status === 'already_enhanced') {
        results.already_enhanced.push(`${dir}/${page}`);
        console.log(`   🔄 Already enhanced: ${page}`);
      } else if (result.status === 'not_found') {
        results.not_found.push(`${dir}/${page}`);
        console.log(`   ❓ Not found: ${page}`);
      } else if (result.status === 'skipped') {
        results.skipped.push(`${dir}/${page}`);
        console.log(`   ⏭️  Skipped: ${page} (${result.reason})`);
      } else if (result.status === 'error') {
        results.errors.push(`${dir}/${page}: ${result.reason}`);
        console.log(`   ❌ Error: ${page} - ${result.reason}`);
      }
    });

    // Also scan all HTML files in directory for additional matches
    try {
      const files = fs.readdirSync(dir);
      const htmlFiles = files.filter(f => f.endsWith('.html') && !targetPages.includes(f));
      
      htmlFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const result = enhanceFile(filePath);
        
        if (result.status === 'enhanced') {
          totalEnhanced++;
          results.enhanced.push(`${dir}/${file}`);
          console.log(`   ✅ Enhanced (additional): ${file}`);
        }
      });
    } catch (scanError) {
      console.log(`   ❌ Error scanning directory ${dir}: ${scanError.message}`);
    }
  });

  // Summary report
  console.log(`\n🎉 COMPREHENSIVE ENHANCEMENT COMPLETE!`);
  console.log(`📊 Summary:`);
  console.log(`   Enhanced: ${results.enhanced.length} pages`);
  console.log(`   Already enhanced: ${results.already_enhanced.length} pages`);
  console.log(`   Skipped: ${results.skipped.length} pages`);
  console.log(`   Not found: ${results.not_found.length} pages`);
  console.log(`   Errors: ${results.errors.length} pages`);

  if (results.enhanced.length > 0) {
    console.log(`\n✨ Newly enhanced pages:`);
    results.enhanced.slice(0, 10).forEach(page => console.log(`   - ${page}`));
    if (results.enhanced.length > 10) {
      console.log(`   ... and ${results.enhanced.length - 10} more pages`);
    }
  }

  return totalEnhanced;
}

// Execute comprehensive enhancement
const totalEnhanced = processAllDirectories();

module.exports = {
  enhanceFile,
  processAllDirectories,
  hasWeitreilesenOrEuroButtons,
  addComprehensiveEnhancement
};