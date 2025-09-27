const fs = require('fs');
const path = require('path');

// Map categories to their script names
const categoryMappings = {
  'amazon': 'amazon-quantity-enhancement.js',
  'google-play': 'google-play-quantity-enhancement.js',
  'apple': 'apple-quantity-enhancement.js',
  'telekom': 'telekom-quantity-enhancement.js',
  'vodafone': 'vodafone-quantity-enhancement.js',
  'lebara': 'lebara-quantity-enhancement.js',
  'lycamobile': 'universal-quantity-enhancement.js',
  'aldi-talk': 'universal-quantity-enhancement.js',
  'congstar': 'universal-quantity-enhancement.js',
  'blau': 'universal-quantity-enhancement.js',
  'o2': 'universal-quantity-enhancement.js',
  'ay-yildiz': 'universal-quantity-enhancement.js',
  'bildmobil': 'universal-quantity-enhancement.js',
  'klarmobil': 'universal-quantity-enhancement.js',
  'fonic': 'universal-quantity-enhancement.js',
  'einfach-prepaid': 'universal-quantity-enhancement.js',
  'fyve': 'universal-quantity-enhancement.js',
  'default': 'universal-quantity-enhancement.js'
};

function getScriptForFile(filename) {
  // Extract category from filename
  if (filename.includes('_amazon')) return categoryMappings.amazon;
  if (filename.includes('_google-play')) return categoryMappings['google-play'];
  if (filename.includes('_apple')) return categoryMappings.apple;
  if (filename.includes('_telekom')) return categoryMappings.telekom;
  if (filename.includes('_vodafone')) return categoryMappings.vodafone;
  if (filename.includes('_lebara')) return categoryMappings.lebara;
  if (filename.includes('_lycamobile')) return categoryMappings.lycamobile;
  if (filename.includes('_aldi-talk')) return categoryMappings['aldi-talk'];
  if (filename.includes('_congstar')) return categoryMappings.congstar;
  if (filename.includes('_blau')) return categoryMappings.blau;
  if (filename.includes('_o2')) return categoryMappings.o2;
  if (filename.includes('_ay-yildiz')) return categoryMappings['ay-yildiz'];
  if (filename.includes('_bildmobil')) return categoryMappings.bildmobil;
  if (filename.includes('_klarmobil')) return categoryMappings.klarmobil;
  if (filename.includes('_fonic')) return categoryMappings.fonic;
  if (filename.includes('_einfach-prepaid')) return categoryMappings['einfach-prepaid'];
  if (filename.includes('_fyve')) return categoryMappings.fyve;
  
  return categoryMappings.default;
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let processedCount = 0;
  let enhancedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.html') && file.startsWith('guthaben.de_')) {
      const filePath = path.join(dirPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if file contains quantity selectors
      if (content.includes('product_card_quantity_select') || content.includes('MuiSelect')) {
        const scriptName = getScriptForFile(file);
        const scriptTag = `<script src="${scriptName}"></script>`;
        
        // Check if script is already added
        if (!content.includes(scriptTag)) {
          // Insert script before closing body tag
          if (content.includes('</body>')) {
            content = content.replace('</body>', `${scriptTag}\n</body>`);
          } else {
            // If no closing body tag, add at end
            content += `\n${scriptTag}`;
          }
          
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Enhanced: ${file} with ${scriptName}`);
          enhancedCount++;
        } else {
          console.log(`⏩ Already enhanced: ${file}`);
        }
      }
      processedCount++;
    }
  });
  
  return { processedCount, enhancedCount };
}

function main() {
  console.log('🚀 Starting quantity enhancement deployment...\n');
  
  // Process desktop directory
  console.log('📱 Processing desktop pages...');
  const desktopResults = processDirectory('./desktop');
  
  console.log('\n📱 Processing mobile pages...');
  const mobileResults = processDirectory('./mobile');
  
  const totalProcessed = desktopResults.processedCount + mobileResults.processedCount;
  const totalEnhanced = desktopResults.enhancedCount + mobileResults.enhancedCount;
  
  console.log('\n🎉 Deployment complete!');
  console.log(`📊 Processed: ${totalProcessed} HTML files`);
  console.log(`✨ Enhanced: ${totalEnhanced} pages with quantity selectors`);
  
  if (totalEnhanced > 0) {
    console.log('\n💡 Test by visiting enhanced pages and clicking quantity dropdown buttons!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { processDirectory, getScriptForFile };