const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Directories to scan
const SCAN_DIRS = ['public', 'mobile', 'desktop'];

// Patterns to identify cookie modals/banners
const COOKIE_PATTERNS = [
    // Specific cookiebanner ID patterns (robust)
    { pattern: /<div[^>]*id="cookiebanner"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Banner (id="cookiebanner")' },

    // Wrapper and sections used in reported pages
    { pattern: /<div[^>]*id="cookie_wrapper"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Wrapper' },
    { pattern: /<div[^>]*id="cookie_body"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Body' },
    { pattern: /<div[^>]*id="cookie_buttons_new"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Buttons Container' },
    { pattern: /<div[^>]*class="[^\"]*cookie_main_title[^\"]*"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Main Title' },

    // Cookiebot specific
    { pattern: /<div[^>]*id="CybotCookiebotDialog"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, name: 'Cookiebot Dialog' },
    { pattern: /<script[^>]*id="Cookiebot"[^>]*>[\s\S]*?<\/script>/gi, name: 'Cookiebot Script' },
    { pattern: /<script[^>]*src="[^"]*consent\.cookiebot\.com[^"]*"[^>]*>[\s\S]*?<\/script>/gi, name: 'Cookiebot CDN Script' },

    // Generic cookie consent patterns
    { pattern: /<div[^>]*class="[^"]*cookie[_-]?(consent|banner|notice|popup|modal)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Consent Div (class)' },
    { pattern: /<div[^>]*id="[^"]*cookie[_-]?(consent|banner|notice|popup|modal)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, name: 'Cookie Consent Div (id)' },
    { pattern: /<section[^>]*class="[^"]*cookie[^"]*"[^>]*>[\s\S]*?<\/section>/gi, name: 'Cookie Section' },

    // Text fallbacks
    { pattern: /<div[^>]*>[\s\S]*?This website uses cookies[\s\S]*?<\/div>/gi, name: 'Cookie Text Container (EN)' },
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

// Remove cookie modals from content (DOM parser based)
function removeCookieModals(content) {
    const removedSections = [];
    let changed = false;

    const docType = (content.match(/^<!DOCTYPE[^>]*>/i) || [])[0] || '';
    const body = content.replace(/^<!DOCTYPE[^>]*>/i, '');

    const $ = cheerio.load(body, { decodeEntities: false });

    const selectors = [
        '#cookiebanner',
        '#cookie_wrapper',
        '#cookie_body',
        '#cookie_buttons_new',
        '#CybotCookiebotDialog',
        '[id^="cookie_"]',
        '.cookie_main_title',
        '.cookie_body_text',
        '.cookie_title',
        '.cookie_text',
        '.cookie_hr_line',
        '.cookie_input',
        'script#Cookiebot',
        'script[src*="consent.cookiebot.com"]'
    ];

    selectors.forEach((sel) => {
        const nodes = $(sel).toArray();
        if (nodes.length) {
            nodes.forEach((el) => {
                const htmlStr = ($.html(el) || '');
                const preview = htmlStr.replace(/\s+/g, ' ').slice(0, 120);
                removedSections.push({ type: `Selector ${sel}`, preview: preview + (htmlStr.length > 120 ? '...' : '') });
            });
            $(sel).remove();
            changed = true;
        }
    });

    // Remove containers that visibly contain the cookie notice text
    const phrases = ['This website uses cookies', 'Diese Website verwendet Cookies'];
    phrases.forEach((txt) => {
        $('*').filter((i, el) => $(el).text().toLowerCase().includes(txt.toLowerCase())).each((i, el) => {
            // Prefer removing a nearby ancestor that clearly relates to cookies
            let node = el;
            let candidate = null;
            for (let depth = 0; depth < 4 && node && node.parent; depth++) {
                const id = ($(node).attr('id') || '').toLowerCase();
                const cls = ($(node).attr('class') || '').toLowerCase();
                if (id.includes('cookie') || cls.includes('cookie')) candidate = node;
                node = node.parent;
            }
            const target = candidate || el;
            const htmlStr = ($.html(target) || '');
            const preview = htmlStr.replace(/\s+/g, ' ').slice(0, 120);
            removedSections.push({ type: `Text "${txt}"`, preview: preview + (htmlStr.length > 120 ? '...' : '') });
            $(target).remove();
            changed = true;
        });
    });

    // Final cleanup for any leftover containers by id
    ['cookiebanner','cookie_wrapper','cookie_body','cookie_buttons_new'].forEach((id) => {
        $(`#${id}`).remove();
    });

    const output = docType ? docType + $.html() : $.html();
    return { content: output, removed: removedSections, changed };
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
