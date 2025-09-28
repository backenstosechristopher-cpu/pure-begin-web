const fs = require('fs');

const files = [
    'public/desktop/guthaben.de.html',
    'public/desktop/guthaben.de_.html', 
    'public/mobile/guthaben.de.html',
    'public/mobile/guthaben.de_.html'
];

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠ File not found: ${filePath}`);
        return;
    }
    
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern 1: Fix /_next/image references
    content = content.replace(/\/_next\/image/g, 'https://guthaben.de/_next/image');
    
    // Pattern 2: Fix assets/ references (href and src)
    content = content.replace(/href="assets\//g, 'href="https://guthaben.de/assets/');
    content = content.replace(/src="assets\//g, 'src="https://guthaben.de/assets/');
    
    // Pattern 3: Fix remaining relative / paths
    content = content.replace(/src="\/(?![\/])/g, 'src="https://guthaben.de/');
    content = content.replace(/href="\/(?![\/])/g, 'href="https://guthaben.de/');
    
    // Pattern 4: Fix canonical and special cases
    content = content.replace(/href="assets"(\s|>|\/|$)/g, 'href="https://guthaben.de/"$1');
    content = content.replace(/href="assets_"(\s|>|\/|$)/g, 'href="https://guthaben.de/"$1');
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed ${filePath}`);
});

console.log('Comprehensive asset path fixing completed!');