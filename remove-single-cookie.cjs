const fs = require('fs');

const filePath = 'public/mobile/guthaben.de_google-play-guthaben.html';

// Patterns to identify cookie modals/banners
const COOKIE_PATTERNS = [
    // Cookiebot specific
    { pattern: /<div[^>]*id="CybotCookiebotDialog"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, name: 'Cookiebot Dialog' },
    { pattern: /<script[^>]*id="Cookiebot"[^>]*>[\s\S]*?<\/script>/gi, name: 'Cookiebot Script' },
    { pattern: /<script[^>]*src="[^"]*consent\.cookiebot\.com[^"]*"[^>]*>[\s\S]*?<\/script>/gi, name: 'Cookiebot CDN Script' },
    
    // Generic cookie consent patterns
    { pattern: /<div[^>]*class="[^"]*cookie[_-]?(consent|banner|notice|popup|modal)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Consent Div (class)' },
    { pattern: /<div[^>]*id="[^"]*cookie[_-]?(consent|banner|notice|popup|modal)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Consent Div (id)' },
    { pattern: /<section[^>]*class="[^"]*cookie[^"]*"[^>]*>[\s\S]*?<\/section>/gi, name: 'Cookie Section' },
    
    // Look for divs with specific cookie-related text
    { pattern: /<div[^>]*>[\s\S]*?This website uses cookies[\s\S]*?<\/div>/gi, name: 'Cookie Text Container' },
    { pattern: /<div[^>]*>[\s\S]*?Diese Website verwendet Cookies[\s\S]*?<\/div>/gi, name: 'Cookie Text Container (DE)' },
    
    // Cookie preference buttons/forms
    { pattern: /<button[^>]*(?:cookie|consent)[^>]*>[\s\S]*?<\/button>/gi, name: 'Cookie Buttons' },
    { pattern: /<form[^>]*(?:cookie|consent)[^>]*>[\s\S]*?<\/form>/gi, name: 'Cookie Forms' },
];

try {
    console.log(`Reading ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = false;
    let removedCount = 0;

    COOKIE_PATTERNS.forEach(({ pattern, name }) => {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            console.log(`Found ${matches.length} match(es) for: ${name}`);
            matches.forEach(match => {
                const preview = match.substring(0, 100).replace(/\n/g, ' ').trim();
                console.log(`  Removing: ${preview}...`);
            });
            content = content.replace(pattern, '');
            changesMade = true;
            removedCount += matches.length;
        }
    });

    if (changesMade) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`\n✓ Successfully removed ${removedCount} cookie section(s) from ${filePath}`);
    } else {
        console.log(`\n○ No cookie modals found in ${filePath}`);
    }
} catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
}
