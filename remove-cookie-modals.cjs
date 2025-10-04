const fs = require('fs');
const path = require('path');

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

// Remove cookie modals from content
function removeCookieModals(content) {
    let html = content;
    const removedSections = [];
    let changed = false;

    // Helper: find end index of a balanced tag starting at `start` (e.g., <div ...>)
    function findBalancedEnd(str, start, tagName) {
        const openToken = `<${tagName}`;
        const closeToken = `</${tagName}>`;
        let i = start;
        let depth = 0;
        while (i < str.length) {
            const nextOpen = str.indexOf(openToken, i);
            const nextClose = str.indexOf(closeToken, i);
            if (nextOpen !== -1 && (nextOpen < nextClose || nextClose === -1)) {
                depth++;
                i = nextOpen + openToken.length;
                continue;
            }
            if (nextClose === -1) {
                return str.length; // fallback if malformed
            }
            depth--;
            i = nextClose + closeToken.length;
            if (depth <= 0) return i;
        }
        return str.length;
    }

    // Helper: remove the tag that contains a given attribute (by regex), repeatedly
    function removeTagContainingAttr(h, attrRegex, label) {
        const re = new RegExp(attrRegex, 'i');
        while (true) {
            const m = re.exec(h);
            if (!m) break;
            const attrIndex = m.index;
            const start = h.lastIndexOf('<', attrIndex);
            if (start === -1) break;
            const tagMatch = /^<\s*([a-zA-Z0-9]+)/.exec(h.slice(start));
            const tagName = (tagMatch ? tagMatch[1] : 'div').toLowerCase();
            const end = findBalancedEnd(h, start, tagName);
            const snippet = h.substring(start, Math.min(end, start + 120)).replace(/\n/g, ' ').trim();
            removedSections.push({ type: label, preview: snippet + (end - start > 120 ? '...' : '') });
            h = h.slice(0, start) + h.slice(end);
            changed = true;
        }
        return h;
    }

    // 1) Remove by specific IDs and ID prefixes (robust, tag-balanced)
    html = removeTagContainingAttr(html, String.raw`\bid=["']cookiebanner["']`, 'Cookie Banner (#cookiebanner)');
    html = removeTagContainingAttr(html, String.raw`\bid=["']cookie_wrapper["']`, 'Cookie Wrapper (#cookie_wrapper)');
    html = removeTagContainingAttr(html, String.raw`\bid=["']cookie_body["']`, 'Cookie Body (#cookie_body)');
    html = removeTagContainingAttr(html, String.raw`\bid=["']cookie_buttons_new["']`, 'Cookie Buttons Container (#cookie_buttons_new)');
    html = removeTagContainingAttr(html, String.raw`\bid=["']CybotCookiebotDialog["']`, 'Cookiebot Dialog (#CybotCookiebotDialog)');
    // Any id that starts with cookie_ (e.g., cookie_1, cookie_2, ...)
    html = removeTagContainingAttr(html, String.raw`\bid=["']cookie_[^"']*["']`, 'Cookie Section (#cookie_*)');

    // 2) Remove containers that include known cookie texts
    html = removeTagContainingAttr(html, String.raw`This website uses cookies`, 'Cookie Text Container (EN)');
    html = removeTagContainingAttr(html, String.raw`Diese Website verwendet Cookies`, 'Cookie Text Container (DE)');

    // 3) Fallback: apply regex patterns (broad sweep, non-balanced)
    COOKIE_PATTERNS.forEach(({ pattern, name }) => {
        const matches = html.match(pattern);
        if (matches && matches.length > 0) {
            matches.forEach(match => {
                const preview = match.substring(0, 100).replace(/\n/g, ' ').trim();
                removedSections.push({ type: name, preview: preview + (match.length > 100 ? '...' : '') });
            });
            html = html.replace(pattern, '');
            changed = true;
        }
    });

    return { content: html, removed: removedSections, changed };
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
