#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting search scripts into all product pages...\n');

function injectSearchScript(filePath, injectorPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if script is already injected
    if (content.includes(injectorPath)) {
      return { status: 'skipped', reason: 'already exists' };
    }
    
    // Find </body></html> and inject before it
    if (content.includes('</body></html>')) {
      const scriptTag = `<script src="${injectorPath}"></script>\n</body></html>`;
      content = content.replace('</body></html>', scriptTag);
      fs.writeFileSync(filePath, content, 'utf-8');
      return { status: 'success' };
    } else if (content.includes('</body>')) {
      // Fallback: inject before </body>
      const scriptTag = `<script src="${injectorPath}"></script>\n</body>`;
      content = content.replace('</body>', scriptTag);
      fs.writeFileSync(filePath, content, 'utf-8');
      return { status: 'success' };
    }
    
    return { status: 'skipped', reason: 'no </body> tag found' };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

function processDirectory(dirPath, injectorPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}\n`);
    return { total: 0, success: 0, skipped: 0, errors: 0 };
  }

  const files = fs.readdirSync(dirPath);
  const htmlFiles = files.filter(f => 
    f.startsWith('guthaben.de_') && 
    f.endsWith('.html') &&
    !f.includes('_faq.') &&
    !f.includes('_abonnement.')
  );

  let stats = { total: htmlFiles.length, success: 0, skipped: 0, errors: 0 };

  htmlFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    const result = injectSearchScript(filePath, injectorPath);
    
    if (result.status === 'success') {
      stats.success++;
    } else if (result.status === 'skipped') {
      stats.skipped++;
    } else if (result.status === 'error') {
      stats.errors++;
      console.log(`❌ Error in ${file}: ${result.error}`);
    }
  });

  return stats;
}

// Process desktop directory
console.log('📱 Processing desktop pages...');
const desktopStats = processDirectory('public/desktop', '../search-injector-desktop.js');
console.log(`   ✅ Success: ${desktopStats.success}`);
console.log(`   ⏭️  Skipped: ${desktopStats.skipped}`);
console.log(`   ❌ Errors: ${desktopStats.errors}`);
console.log(`   📊 Total: ${desktopStats.total}\n`);

// Process mobile directory
console.log('📱 Processing mobile pages...');
const mobileStats = processDirectory('public/mobile', '../search-injector-mobile.js');
console.log(`   ✅ Success: ${mobileStats.success}`);
console.log(`   ⏭️  Skipped: ${mobileStats.skipped}`);
console.log(`   ❌ Errors: ${mobileStats.errors}`);
console.log(`   📊 Total: ${mobileStats.total}\n`);

const totalSuccess = desktopStats.success + mobileStats.success;
const totalFiles = desktopStats.total + mobileStats.total;

console.log('✨ Done! Search functionality enabled on all pages.\n');
console.log(`📈 Summary: ${totalSuccess}/${totalFiles} pages updated\n`);
console.log('🔍 Now refresh any product page to see the updated search with all products!\n');
