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
    if (!fs.existsSync(filePath)) {
        console.log(`⚠ File not found: ${filePath}`);
        return;
    }
    
    console.log(`Fixing paths in ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix various asset paths to point to guthaben.de
    content = content
        // Fix /_next/image paths that aren't already absolute
        .replace(/(?<!https:\/\/guthaben\.de)\/_next\/image/g, 'https://guthaben.de/_next/image')
        // Fix assets/ paths that aren't already absolute
        .replace(/href="(?!https:\/\/guthaben\.de)assets\//g, 'href="https://guthaben.de/assets/')
        .replace(/src="(?!https:\/\/guthaben\.de)assets\//g, 'src="https://guthaben.de/assets/')
        // Fix canonical URLs
        .replace(/href="assets"(?!\/)(\s|>)/g, 'href="https://guthaben.de/"$1')
        .replace(/href="assets_"(\s|>)/g, 'href="https://guthaben.de/"$1')
        // Fix preconnect URLs
        .replace(/href="assets" crossorigin/g, 'href="https://guthaben.de" crossorigin')
        // Fix any remaining relative paths that might break (only if not already absolute)
        .replace(/src="(?!https?:\/\/)\/(?!\/)/g, 'src="https://guthaben.de/')
        .replace(/href="(?!https?:\/\/)\/(?!\/)/g, 'href="https://guthaben.de/')
        // Fix any http:// guthaben.de to https://
        .replace(/http:\/\/guthaben\.de/g, 'https://guthaben.de')
        // Fix guthaben.de_.html links to point to the correct file
        .replace(/href="guthaben\.de_\.html"/g, 'href="/desktop/guthaben.de_.html"');
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed paths in ${filePath}`);
});

console.log('All asset paths have been fixed!');