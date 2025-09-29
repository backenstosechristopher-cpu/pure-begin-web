const fs = require('fs');

// Files to process
const files = [
  'desktop/guthaben.de_apple-gift-card.html',
  'desktop/guthaben.de_google-play-guthaben.html'
];

// Process each file
files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${filePath}...`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Count initial occurrences
    const initialCount = (content.match(/Weiterlesen/g) || []).length;
    
    // Remove all "Weiterlesen" text
    content = content.replace(/Weiterlesen/g, '');
    
    // Count remaining occurrences
    const finalCount = (content.match(/Weiterlesen/g) || []).length;
    
    // Write back to file
    fs.writeFileSync(filePath, content);
    
    console.log(`  Removed ${initialCount - finalCount} instances of "Weiterlesen"`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Done removing Weiterlesen buttons!');