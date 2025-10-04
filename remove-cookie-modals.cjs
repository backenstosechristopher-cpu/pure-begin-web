const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = ['public/desktop', 'public/mobile'];

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

// Get all HTML files recursively
function getAllHtmlFiles(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(getAllHtmlFiles(filePath));
            } else if (file.endsWith('.html')) {
                results.push(filePath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
    return results;
}

// Remove cookie modals from content
function removeCookieModals(content) {
    let modifiedContent = content;
    let removedSections = [];
    let changesMade = false;

    COOKIE_PATTERNS.forEach(({ pattern, name }) => {
        const matches = modifiedContent.match(pattern);
        if (matches && matches.length > 0) {
            matches.forEach(match => {
                // Store a preview of what's being removed (first 100 chars)
                const preview = match.substring(0, 100).replace(/\n/g, ' ').trim();
                removedSections.push({
                    type: name,
                    preview: preview + (match.length > 100 ? '...' : '')
                });
            });
            modifiedContent = modifiedContent.replace(pattern, '');
            changesMade = true;
        }
    });

    return { content: modifiedContent, removed: removedSections, changed: changesMade };
}

// Main execution
console.log('🔍 Scanning for cookie modals...\n');

const allFiles = [];
SCAN_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
        allFiles.push(...getAllHtmlFiles(dir));
    } else {
        console.log(`⚠ Directory not found: ${dir}`);
    }
});

console.log(`Found ${allFiles.length} HTML files to scan\n`);

const report = {
    scanned: 0,
    modified: 0,
    unchanged: 0,
    errors: 0,
    files: []
};

allFiles.forEach(filePath => {
    try {
        report.scanned++;
        const content = fs.readFileSync(filePath, 'utf8');
        const result = removeCookieModals(content);

        if (result.changed) {
            fs.writeFileSync(filePath, result.content, 'utf8');
            report.modified++;
            console.log(`✓ ${filePath}`);
            console.log(`  Removed ${result.removed.length} cookie section(s):`);
            result.removed.forEach(section => {
                console.log(`    - ${section.type}: ${section.preview}`);
            });
            console.log('');

            report.files.push({
                path: filePath,
                status: 'modified',
                removed: result.removed
            });
        } else {
            report.unchanged++;
            console.log(`○ ${filePath} - No cookie modals found`);
            report.files.push({
                path: filePath,
                status: 'unchanged'
            });
        }
    } catch (error) {
        report.errors++;
        console.error(`✗ Error processing ${filePath}:`, error.message);
        report.files.push({
            path: filePath,
            status: 'error',
            error: error.message
        });
    }
});

// Save report
fs.writeFileSync('cookie-removal-report.json', JSON.stringify(report, null, 2));

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Total files scanned: ${report.scanned}`);
console.log(`Files modified: ${report.modified}`);
console.log(`Files unchanged: ${report.unchanged}`);
console.log(`Errors: ${report.errors}`);
console.log('\nDetailed report saved to: cookie-removal-report.json');
console.log('='.repeat(60));
