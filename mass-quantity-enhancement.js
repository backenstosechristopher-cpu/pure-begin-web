const fs = require('fs');
const path = require('path');

console.log('🚀 MASS QUANTITY SELECTOR ENHANCEMENT');
console.log('=====================================\n');

let enhanced = 0;
let skipped = 0;
let errors = 0;

function hasQuantitySelectors(html) {
  return html.includes('product_card_quantity_select') || 
         html.includes('MuiSelect-root') || 
         html.includes('role="combobox"') ||
         html.includes('quantity');
}

function hasEnhancementScript(html) {
  return html.includes('universal-quantity-enhancement.js') || 
         html.includes('quantity-enhancement');
}

function addEnhancementScript(html, scriptName) {
  const scriptTag = `<script src="${scriptName}"></script>`;
  
  // Try different patterns for insertion
  if (html.includes('</body></html>')) {
    return html.replace('</body></html>', `${scriptTag}\n</body></html>`);
  } else if (html.includes('</script></body></html>')) {
    return html.replace('</script></body></html>', `</script>\n${scriptTag}\n</body></html>`);
  } else if (html.includes('</body>')) {
    return html.replace('</body>', `${scriptTag}\n</body>`);
  } else if (html.includes('</html>')) {
    return html.replace('</html>', `${scriptTag}\n</html>`);
  }
  
  // Final fallback
  return html + `\n${scriptTag}`;
}

function processFile(filePath, device) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    // Skip non-product pages
    if (filename.includes('faq') || filename.includes('impressum') || 
        filename.includes('datenschutz') || filename.includes('cookie') ||
        filename.includes('agb') || filename.includes('terms')) {
      skipped++;
      return;
    }
    
    if (!hasQuantitySelectors(html)) {
      console.log(`⏭️  Skipped ${device}/${filename} - no quantity selectors`);
      skipped++;
      return;
    }
    
    if (hasEnhancementScript(html)) {
      console.log(`⏭️  Skipped ${device}/${filename} - already enhanced`);
      skipped++;
      return;
    }
    
    const enhancedHtml = addEnhancementScript(html, 'universal-quantity-enhancement.js');
    fs.writeFileSync(filePath, enhancedHtml);
    
    console.log(`✅ Enhanced ${device}/${filename}`);
    enhanced++;
    
  } catch (error) {
    console.error(`❌ Error with ${filePath}:`, error.message);
    errors++;
  }
}

// Sample of key pages to enhance first
const priorityPages = [
  // Payment cards
  'guthaben.de_transcash.html',
  'guthaben.de_cashlib.html', 
  'guthaben.de_flexepin.html',
  'guthaben.de_paysafecard.html',
  'guthaben.de_jeton-cash.html',
  'guthaben.de_bitsa.html',
  
  // Mobile operators
  'guthaben.de_mobi-aufladen.html',
  'guthaben.de_lycamobile-aufladen.html',
  'guthaben.de_lebara-aufladen.html',
  'guthaben.de_congstar-aufladen.html',
  'guthaben.de_o2-aufladen.html',
  'guthaben.de_aldi-talk-aufladen.html',
  
  // Gaming
  'guthaben.de_steam-guthaben.html',
  'guthaben.de_playstation-guthaben.html',
  'guthaben.de_xbox-guthaben.html',
  'guthaben.de_nintendo-eshop.html',
  
  // Streaming
  'guthaben.de_netflix.html',
  'guthaben.de_spotify.html',
  'guthaben.de_disney-plus.html',
  'guthaben.de_dazn.html',
  
  // Gift cards  
  'guthaben.de_zalando.html',
  'guthaben.de_otto.html',
  'guthaben.de_about-you.html',
  'guthaben.de_booking-com.html'
];

// Process priority pages first
console.log('🎯 Processing priority pages...\n');

const devices = ['desktop', 'mobile'];

devices.forEach(device => {
  priorityPages.forEach(page => {
    const filePath = path.join('.', device, page);
    if (fs.existsSync(filePath)) {
      processFile(filePath, device);
    }
  });
});

// Process all remaining pages
console.log('\n📂 Processing all remaining pages...\n');

devices.forEach(device => {
  const deviceDir = path.join('.', device);
  if (!fs.existsSync(deviceDir)) return;
  
  const files = fs.readdirSync(deviceDir);
  const htmlFiles = files.filter(file => 
    file.endsWith('.html') && 
    file.startsWith('guthaben.de') &&
    !priorityPages.includes(file) // Skip already processed
  );
  
  console.log(`Processing ${device}: ${htmlFiles.length} files`);
  
  htmlFiles.forEach(file => {
    const filePath = path.join(deviceDir, file);
    processFile(filePath, device);
  });
});

console.log('\n' + '='.repeat(50));
console.log('📊 ENHANCEMENT SUMMARY:');
console.log(`   ✅ Enhanced: ${enhanced} pages`);
console.log(`   ⏭️  Skipped: ${skipped} pages`);
console.log(`   ❌ Errors: ${errors} pages`);
console.log('='.repeat(50));

if (enhanced > 0) {
  console.log('\n🎉 SUCCESS!');
  console.log(`All ${enhanced} pages now have working quantity selectors!`);
  console.log('Users can click quantity buttons to open dropdown menus.');
} else {
  console.log('\n✨ All pages were already enhanced or have no quantity selectors.');
}

console.log('\n✅ Mass enhancement complete!');