const fs = require('fs');

// All files that need "Weiterlesen" removed
const files = [
  'desktop/guthaben.de_apple-gift-card-oesterreich.html',
  'desktop/guthaben.de_google-play-card-oesterreich.html',
  'desktop/guthaben.de_paysafecard-at.html',
  'desktop/guthaben.de_paysafecard.html',
  'desktop/guthaben.de_psn-card-oesterreich.html',
  'public/desktop/guthaben.de_apple-gift-card-oesterreich.html',
  'public/desktop/guthaben.de_apple-gift-card.html',
  'public/desktop/guthaben.de_google-play-card-oesterreich.html',
  'public/desktop/guthaben.de_google-play-guthaben.html',
  'public/desktop/guthaben.de_paysafecard-at.html',
  'public/desktop/guthaben.de_paysafecard.html',
  'public/desktop/guthaben.de_psn-card-oesterreich.html'
];

let totalRemoved = 0;
let filesProcessed = 0;

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const beforeCount = (content.match(/Weiterlesen/g) || []).length;
      
      // Remove all instances of "Weiterlesen"
      content = content.replace(/Weiterlesen/g, '');
      
      const afterCount = (content.match(/Weiterlesen/g) || []).length;
      const removed = beforeCount - afterCount;
      
      fs.writeFileSync(filePath, content, 'utf8');
      
      if (removed > 0) {
        console.log(`✅ ${filePath}: Removed ${removed} instances`);
        totalRemoved += removed;
        filesProcessed++;
      } else {
        console.log(`⏭️  ${filePath}: No instances found`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log(`\n🎉 Done! Processed ${filesProcessed} files, removed ${totalRemoved} total instances of "Weiterlesen"`);
