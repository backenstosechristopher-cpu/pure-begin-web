// Comprehensive script to fix all asset paths in ALL HTML files
const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...getAllHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

function fixAssetPaths(content) {
    return content
        // Fix /_next/image paths (ensure they point to guthaben.de)
        .replace(/\/_next\/image/g, 'https://guthaben.de/_next/image')
        
        // Fix relative assets/ paths (CSS, JS, images, etc.)
        .replace(/href="assets\//g, 'href="https://guthaben.de/assets/')
        .replace(/src="assets\//g, 'src="https://guthaben.de/assets/')
        
        // Fix favicon and other assets
        .replace(/href="assets\/favicon/g, 'href="https://guthaben.de/assets/favicon')
        .replace(/href="assets\/guthaben\.css"/g, 'href="https://guthaben.de/assets/guthaben.css"')
        
        // Fix preconnect and other special cases
        .replace(/href="assets"(\s|>|\/|$)/g, 'href="https://guthaben.de/"$1')
        .replace(/href="assets" crossorigin/g, 'href="https://guthaben.de" crossorigin')
        
        // Fix any remaining relative paths that start with /
        .replace(/src="\/(?!\/)/g, 'src="https://guthaben.de/')
        .replace(/href="\/(?!\/)/g, 'href="https://guthaben.de/')
        
        // Fix any http:// references to https://
        .replace(/http:\/\/guthaben\.de/g, 'https://guthaben.de')
        
        // Fix canonical URLs that point to assets
        .replace(/href="assets\/([^"]*)"([^>]*rel="canonical")/g, 'href="https://guthaben.de/$1"$2')
        .replace(/rel="canonical" href="assets\/([^"]*)"/g, 'rel="canonical" href="https://guthaben.de/$1"')
        
        // Fix preload asset references
        .replace(/href="assets([^"]*\.css)"/g, 'href="https://guthaben.de/assets$1"')
        
        // Fix script asset references
        .replace(/src="assets([^"]*\.js)"/g, 'src="https://guthaben.de/assets$1"');
}

// Get all HTML files in public directory
const htmlFiles = getAllHtmlFiles('public');

console.log(`Found ${htmlFiles.length} HTML files to process...`);

let processedCount = 0;
let errorCount = 0;

htmlFiles.forEach(filePath => {
    try {
        console.log(`Processing ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        content = fixAssetPaths(content);
        
        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✓ Fixed asset paths in ${filePath}`);
            processedCount++;
        } else {
            console.log(`- No changes needed for ${filePath}`);
        }
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        errorCount++;
    }
});

console.log(`\nProcessing complete!`);
console.log(`- Files processed: ${processedCount}`);
console.log(`- Files with errors: ${errorCount}`);
console.log(`- Total files checked: ${htmlFiles.length}`);