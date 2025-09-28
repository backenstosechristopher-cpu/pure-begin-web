// Comprehensive script to fix all asset paths in HTML files
const fs = require('fs');
const path = require('path');

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
    
    console.log(`Fixing all asset paths in ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix all relative asset paths systematically
    content = content
        // Fix /_next/image paths (ensure they point to guthaben.de)
        .replace(/\/_next\/image/g, 'https://guthaben.de/_next/image')
        
        // Fix relative assets/ paths (CSS, JS, images, etc.)
        .replace(/href="assets\//g, 'href="https://guthaben.de/assets/')
        .replace(/src="assets\//g, 'src="https://guthaben.de/assets/')
        
        // Fix preconnect and other special cases
        .replace(/href="assets"(\s|>|\/|$)/g, 'href="https://guthaben.de/"$1')
        .replace(/href="assets" crossorigin/g, 'href="https://guthaben.de" crossorigin')
        
        // Fix any remaining relative paths that start with /
        .replace(/src="\/(?!\/)/g, 'src="https://guthaben.de/')
        .replace(/href="\/(?!\/)/g, 'href="https://guthaben.de/')
        
        // Fix any http:// references to https://
        .replace(/http:\/\/guthaben\.de/g, 'https://guthaben.de')
        
        // Fix specific file references
        .replace(/href="guthaben\.de_\.html"/g, 'href="/desktop/guthaben.de_.html"')
        
        // Fix preload asset references
        .replace(/href="assets([^"]*\.css)"/g, 'href="https://guthaben.de/assets$1"')
        
        // Fix script asset references
        .replace(/src="assets([^"]*\.js)"/g, 'src="https://guthaben.de/assets$1"');
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed all asset paths in ${filePath}`);
});

console.log('All asset paths have been comprehensively fixed!');