#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFYING SEARCH URLS\n');
console.log('==========================================\n');

// Read search file and extract URLs
function extractUrlsFromSearchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const urlMatches = content.matchAll(/url:\s*['"]([^'"]+)['"]/g);
  
  const urls = [];
  for (const match of urlMatches) {
    urls.push(match[1]);
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

// Check if file exists in desktop or mobile directory
function checkFileExists(url) {
  // Clean up URL - remove 'desktop/' or 'mobile/' prefix if present
  const cleanUrl = url.replace(/^(desktop\/|mobile\/)/, '');
  
  const locations = [
    path.join('desktop', cleanUrl),
    path.join('mobile', cleanUrl),
    path.join('public/desktop', cleanUrl),
    path.join('public/mobile', cleanUrl)
  ];
  
  for (const loc of locations) {
    if (fs.existsSync(loc)) {
      return { exists: true, location: loc };
    }
  }
  
  return { exists: false, location: null };
}

// Main execution
function main() {
  const searchFiles = [
    'desktop/assets/guthaben-search.js',
    'mobile/assets/guthaben-search.js',
    'public/desktop/assets/guthaben-search.js',
    'public/desktop/assets/universal-search.js',
    'public/mobile/assets/guthaben-search.js',
    'public/mobile/assets/universal-search.js',
    'public/guthaben-search.js',
    'public/search.js'
  ];
  
  const allBrokenUrls = new Map(); // URL -> list of files that reference it
  
  searchFiles.forEach(searchFile => {
    if (!fs.existsSync(searchFile)) {
      console.log(`⏭️  Skipping ${searchFile} (not found)\n`);
      return;
    }
    
    console.log(`📄 Checking ${searchFile}...`);
    const urls = extractUrlsFromSearchFile(searchFile);
    console.log(`   Found ${urls.length} unique URLs`);
    
    let brokenCount = 0;
    urls.forEach(url => {
      const result = checkFileExists(url);
      if (!result.exists) {
        brokenCount++;
        if (!allBrokenUrls.has(url)) {
          allBrokenUrls.set(url, []);
        }
        allBrokenUrls.get(url).push(searchFile);
      }
    });
    
    if (brokenCount > 0) {
      console.log(`   ❌ ${brokenCount} broken URLs found`);
    } else {
      console.log(`   ✅ All URLs valid`);
    }
    console.log('');
  });
  
  // Print summary
  console.log('\n🎯 BROKEN URLS SUMMARY\n');
  console.log('==========================================\n');
  
  if (allBrokenUrls.size === 0) {
    console.log('✅ All URLs are valid!');
  } else {
    console.log(`❌ Found ${allBrokenUrls.size} broken URLs:\n`);
    
    const sortedUrls = Array.from(allBrokenUrls.keys()).sort();
    sortedUrls.forEach((url, index) => {
      const files = allBrokenUrls.get(url);
      console.log(`${index + 1}. ${url}`);
      console.log(`   Referenced in: ${files.join(', ')}`);
      console.log('');
    });
  }
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalBrokenUrls: allBrokenUrls.size,
    brokenUrls: Array.from(allBrokenUrls.entries()).map(([url, files]) => ({
      url,
      referencedIn: files
    }))
  };
  
  fs.writeFileSync('broken-urls-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to: broken-urls-report.json');
}

// Run
if (require.main === module) {
  main();
}

module.exports = { extractUrlsFromSearchFile, checkFileExists };
