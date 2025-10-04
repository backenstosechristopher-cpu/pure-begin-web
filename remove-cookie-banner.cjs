const fs = require('fs');

const filePath = 'mobile/guthaben.de_google-play-guthaben.html';

console.log(`Reading ${filePath}...`);
let content = fs.readFileSync(filePath, 'utf8');

// Remove the cookie banner section
// The banner starts with <div id="cookiebanner" and ends with its closing </div>
const cookieBannerPattern = /<div id="cookiebanner"[^>]*>(?:(?!<div id="cookiebanner").)*?<\/div>\s*<\/div>/gs;

const originalLength = content.length;
content = content.replace(cookieBannerPattern, '');
const newLength = content.length;

if (originalLength !== newLength) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cookie banner removed from ${filePath}`);
    console.log(`  Removed ${originalLength - newLength} characters`);
} else {
    console.log(`○ No cookie banner found in ${filePath}`);
}
