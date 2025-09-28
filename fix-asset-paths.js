// Script to fix asset paths in HTML files to point to guthaben.de
const fs = require('fs');
const path = require('path');

const files = [
    'public/desktop/guthaben.de.html',
    'public/desktop/guthaben.de_.html',
    'public/mobile/guthaben.de.html',
    'public/mobile/guthaben.de_.html'
];

files.forEach(filePath => {
    console.log(`Fixing paths in ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix various asset paths to point to guthaben.de
    content = content
        // Fix /_next/image paths
        .replace(/\/_next\/image/g, 'https://guthaben.de/_next/image')
        // Fix assets/ paths  
        .replace(/href="assets\//g, 'href="https://guthaben.de/assets/')
        .replace(/src="assets\//g, 'src="https://guthaben.de/assets/')
        // Fix canonical URLs
        .replace(/href="assets"/g, 'href="https://guthaben.de/"')
        .replace(/href="assets_"/g, 'href="https://guthaben.de/"')
        // Fix preconnect URLs
        .replace(/href="assets" crossorigin/g, 'href="https://guthaben.de" crossorigin')
        // Fix any remaining relative paths that might break
        .replace(/src="\//g, 'src="https://guthaben.de/')
        .replace(/href="\//g, 'href="https://guthaben.de/')
        // Fix specific image domains that might be referenced
        .replace(/static\.rapido\.com/g, 'static.rapido.com')
        // Fix any http:// guthaben.de to https://
        .replace(/http:\/\/guthaben\.de/g, 'https://guthaben.de')
        // Fix guthaben.de_.html links to point to the correct file
        .replace(/href="guthaben\.de_\.html"/g, 'href="/desktop/guthaben.de_.html"');
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed paths in ${filePath}`);
});

console.log('All asset paths have been fixed!');