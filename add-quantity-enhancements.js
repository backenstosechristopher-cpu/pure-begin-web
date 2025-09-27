const fs = require('fs');
const path = require('path');

// Get all HTML files that have quantity selectors but don't have enhancement scripts
function findFilesNeedingEnhancement(directory) {
  const files = fs.readdirSync(directory);
  const needEnhancement = [];
  
  files.forEach(file => {
    if (file.endsWith('.html') && file.includes('guthaben.de_')) {
      const filePath = path.join(directory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if file has quantity selectors
      const hasQuantitySelector = content.includes('product_card_quantity_select') || 
                                  content.includes('role="combobox"');
      
      // Check if file already has enhancement script
      const hasEnhancement = content.includes('universal-quantity-enhancement.js') ||
                             content.includes('telekom-quantity-enhancement.js') ||
                             content.includes('vodafone-quantity-enhancement.js') ||
                             content.includes('amazon-quantity-enhancement.js') ||
                             content.includes('lebara-quantity-enhancement.js') ||
                             content.includes('custom-blau-quantity.js');
      
      if (hasQuantitySelector && !hasEnhancement) {
        needEnhancement.push(file);
      }
    }
  });
  
  return needEnhancement;
}

// Add enhancement script to a file
function addEnhancementScript(directory, filename) {
  const filePath = path.join(directory, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the best insertion point (before </body> or before last </script>)
  if (content.includes('</body>')) {
    content = content.replace('</body>', '<script src="universal-quantity-enhancement.js"></script></body>');
  } else if (content.includes('</html>')) {
    content = content.replace('</html>', '<script src="universal-quantity-enhancement.js"></script></html>');
  } else {
    // Fallback - add at the end
    content += '<script src="universal-quantity-enhancement.js"></script>';
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Enhanced: ${directory}/${filename}`);
}

// Main execution
const desktopFiles = findFilesNeedingEnhancement('desktop');
const mobileFiles = findFilesNeedingEnhancement('mobile');

console.log(`Found ${desktopFiles.length} desktop files needing enhancement:`);
desktopFiles.forEach(file => console.log(`  - ${file}`));

console.log(`\nFound ${mobileFiles.length} mobile files needing enhancement:`);
mobileFiles.forEach(file => console.log(`  - ${file}`));

console.log('\nAdding enhancement scripts...');

// Add enhancements
desktopFiles.forEach(file => addEnhancementScript('desktop', file));
mobileFiles.forEach(file => addEnhancementScript('mobile', file));

// Also ensure desktop versions of recently enhanced mobile pages have the script
const recentlyEnhancedMobile = [
  'guthaben.de_lycamobile-aufladen.html',
  'guthaben.de_ay-yildiz-aufladen.html', 
  'guthaben.de_klarmobil-aufladen.html',
  'guthaben.de_bildmobil-aufladen.html',
  'guthaben.de_einfach-prepaid-aufladen.html'
];

recentlyEnhancedMobile.forEach(filename => {
  const desktopPath = `desktop/${filename}`;
  if (require('fs').existsSync(desktopPath)) {
    const content = require('fs').readFileSync(desktopPath, 'utf8');
    const hasQuantitySelector = content.includes('product_card_quantity_select') || 
                                content.includes('role="combobox"');
    const hasEnhancement = content.includes('universal-quantity-enhancement.js');
    
    if (hasQuantitySelector && !hasEnhancement) {
      addEnhancementScript('desktop', filename);
    }
  }
});

console.log(`\nCompleted! Enhanced ${desktopFiles.length + mobileFiles.length} files total.`);