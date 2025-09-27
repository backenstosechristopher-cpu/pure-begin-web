const fs = require('fs');
const path = require('path');

// Mobile operator patterns and their scripts
const operatorMappings = {
  'vodafone': 'vodafone-quantity-enhancement.js',
  'telekom': 'telekom-quantity-enhancement.js', 
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
  'e-plus': 'universal-quantity-enhancement.js',
  'blauworld': 'universal-quantity-enhancement.js'
};

function getScriptForOperator(filename) {
  for (const [operator, script] of Object.entries(operatorMappings)) {
    if (filename.includes(operator)) {
      return script;
    }
  }
  return 'universal-quantity-enhancement.js';
}

function enhanceFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has quantity selectors
    if (!content.includes('product_card_quantity_select') && !content.includes('MuiSelect-root')) {
      return { success: false, reason: 'No quantity selectors' };
    }
    
    const filename = path.basename(filePath);
    const scriptName = getScriptForOperator(filename);
    const scriptTag = `<script src="${scriptName}"></script>`;
    
    // Check if already enhanced
    if (content.includes(scriptTag)) {
      return { success: false, reason: 'Already enhanced' };
    }
    
    // Find insertion point and inject script
    let injected = false;
    
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${scriptTag}</body>`);
      injected = true;
    } else if (content.includes('</html>')) {
      content = content.replace('</html>', `${scriptTag}</html>`);
      injected = true;
    } else {
      // Insert before last script tag or at end
      const lastScriptIndex = content.lastIndexOf('</script>');
      if (lastScriptIndex !== -1) {
        const insertIndex = content.indexOf('>', lastScriptIndex) + 1;
        content = content.slice(0, insertIndex) + scriptTag + content.slice(insertIndex);
        injected = true;
      }
    }
    
    if (injected) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, script: scriptName };
    }
    
    return { success: false, reason: 'No insertion point found' };
    
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const results = {
    processed: 0,
    enhanced: 0,
    skipped: 0,
    errors: 0,
    details: []
  };
  
  files.forEach(file => {
    if (file.endsWith('.html') && file.includes('aufladen')) {
      const filePath = path.join(dirPath, file);
      const result = enhanceFile(filePath);
      results.processed++;
      
      if (result.success) {
        results.enhanced++;
        results.details.push(`✅ ${file} → ${result.script}`);
        console.log(`✅ Enhanced: ${file} with ${result.script}`);
      } else {
        if (result.reason === 'Already enhanced') {
          results.skipped++;
          console.log(`⏩ Already enhanced: ${file}`);
        } else if (result.reason === 'No quantity selectors') {
          results.skipped++;
          console.log(`⏭️  No selectors: ${file}`);
        } else {
          results.errors++;
          console.log(`❌ Error in ${file}: ${result.reason}`);
        }
      }
    }
  });
  
  return results;
}

console.log('🚀 Enhancing mobile operator pages with quantity selectors...\n');

console.log('📱 Processing desktop mobile operator pages...');
const desktopResults = processDirectory('./desktop');

console.log('\n📱 Processing mobile operator pages...');
const mobileResults = processDirectory('./mobile');

const totalResults = {
  processed: desktopResults.processed + mobileResults.processed,
  enhanced: desktopResults.enhanced + mobileResults.enhanced,
  skipped: desktopResults.skipped + mobileResults.skipped,
  errors: desktopResults.errors + mobileResults.errors
};

console.log('\n🎉 Mobile operator enhancement complete!');
console.log(`📊 Total processed: ${totalResults.processed} pages`);
console.log(`✨ Enhanced: ${totalResults.enhanced} pages`);
console.log(`⏩ Already enhanced: ${totalResults.skipped} pages`);
console.log(`❌ Errors: ${totalResults.errors} pages`);

if (totalResults.enhanced > 0) {
  console.log('\n💡 Enhanced pages:');
  [...desktopResults.details, ...mobileResults.details].forEach(detail => {
    console.log(`   ${detail}`);
  });
  console.log('\n🧪 Test by visiting enhanced pages and clicking quantity dropdowns!');
}

module.exports = { enhanceFile, getScriptForOperator };