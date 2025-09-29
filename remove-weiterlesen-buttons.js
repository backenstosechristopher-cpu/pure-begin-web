console.log('🗑️  REMOVING WEITERLESEN BUTTONS FROM SPECIFIC PAGES');
console.log('================================================\n');

const fs = require('fs');
const path = require('path');

// Target files where Weiterlesen buttons need to be removed
const targetFiles = [
  'mobile/guthaben.de_apple-gift-card.html',
  'desktop/guthaben.de_apple-gift-card.html',
  'mobile/guthaben.de_google-play-guthaben.html', 
  'desktop/guthaben.de_google-play-guthaben.html'
];

let totalProcessed = 0;
let totalRemoved = 0;

function removeWeiterlesenButtons(html) {
  let originalHtml = html;
  let removedCount = 0;
  
  // Multiple patterns to catch different Weiterlesen button implementations
  const weiterlesenPatterns = [
    // Pattern 1: Button with "Weiterlesen" text
    /<button[^>]*>[^<]*Weiterlesen[^<]*<\/button>/gi,
    // Pattern 2: Link with "Weiterlesen" text  
    /<a[^>]*>[^<]*Weiterlesen[^<]*<\/a>/gi,
    // Pattern 3: Span/div with "Weiterlesen" text that might be clickable
    /<(span|div)[^>]*class="[^"]*button[^"]*"[^>]*>[^<]*Weiterlesen[^<]*<\/\1>/gi,
    // Pattern 4: Any element with "Weiterlesen" that has onclick or cursor pointer
    /<[^>]*(?:onclick|style="[^"]*cursor:\s*pointer)[^>]*>[^<]*Weiterlesen[^<]*<\/[^>]+>/gi,
    // Pattern 5: MUI Button components with "Weiterlesen"
    /<[^>]*class="[^"]*MuiButton[^"]*"[^>]*>[^<]*Weiterlesen[^<]*<\/[^>]+>/gi
  ];
  
  weiterlesenPatterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      removedCount += matches.length;
      html = html.replace(pattern, '');
      console.log(`   Removed ${matches.length} Weiterlesen elements with pattern`);
    }
  });
  
  // Additional cleanup: Remove empty containers that might have been left
  html = html.replace(/<(div|span)[^>]*>\s*<\/\1>/gi, '');
  
  return { html, removedCount };
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return 0;
    }
    
    const originalHtml = fs.readFileSync(filePath, 'utf8');
    const { html: modifiedHtml, removedCount } = removeWeiterlesenButtons(originalHtml);
    
    if (removedCount > 0) {
      fs.writeFileSync(filePath, modifiedHtml);
      console.log(`✅ ${filePath}: Removed ${removedCount} Weiterlesen buttons`);
      totalRemoved += removedCount;
    } else {
      console.log(`ℹ️  ${filePath}: No Weiterlesen buttons found`);
    }
    
    totalProcessed++;
    return removedCount;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Process all target files
console.log('🎯 Processing specific files...\n');

targetFiles.forEach(filePath => {
  processFile(filePath);
});

// Final report
console.log('\n' + '='.repeat(50));
console.log('📊 WEITERLESEN REMOVAL SUMMARY');
console.log('='.repeat(50));
console.log(`   📁 Files processed: ${totalProcessed}`);
console.log(`   🗑️  Total buttons removed: ${totalRemoved}`);
console.log('='.repeat(50));

if (totalRemoved > 0) {
  console.log('\n🎉 SUCCESS! Weiterlesen buttons have been removed!');
  console.log('   • Apple Gift Card pages: Cleaned');
  console.log('   • Google Play pages: Cleaned');
  console.log('   • Both mobile and desktop versions processed');
} else {
  console.log('\n✨ No Weiterlesen buttons found in the specified files.');
}

console.log('\n🏁 Weiterlesen button removal complete!');