#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE PRODUCT SCAN\n');
console.log('==========================================\n');

// Extract product name from HTML title
function extractProductFromTitle(content) {
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return null;
  
  const title = titleMatch[1];
  // Remove common suffixes
  const cleanTitle = title
    .replace(/\s*\|\s*Guthaben\.de/i, '')
    .replace(/\s*-\s*Guthaben\.de/i, '')
    .replace(/\s*Guthaben\s*Karte.*$/i, '')
    .replace(/\s*ab\s*\d+\s*€.*$/i, '')
    .trim();
  
  return cleanTitle;
}

// Get product category from meta tags or content
function getProductCategory(filename, content) {
  // Check meta tag first
  const categoryMatch = content.match(/<meta\s+property="bc:category"\s+content="([^"]+)"/i);
  if (categoryMatch) {
    const category = categoryMatch[1];
    const categoryMap = {
      'game': 'Gaming',
      'mobile': 'Mobilfunk',
      'entertainment': 'Entertainment',
      'streaming': 'Streaming',
      'shopping': 'Shopping',
      'payment': 'Zahlung'
    };
    return categoryMap[category.toLowerCase()] || 'Sonstiges';
  }
  
  // Fallback to filename-based detection
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('aufladen') || lowerFilename.includes('mobile')) return 'Mobilfunk';
  if (lowerFilename.includes('psn') || lowerFilename.includes('xbox') || 
      lowerFilename.includes('nintendo') || lowerFilename.includes('steam') ||
      lowerFilename.includes('fortnite') || lowerFilename.includes('roblox')) return 'Gaming';
  if (lowerFilename.includes('netflix') || lowerFilename.includes('disney') || 
      lowerFilename.includes('spotify')) return 'Streaming';
  if (lowerFilename.includes('amazon') || lowerFilename.includes('zalando') || 
      lowerFilename.includes('ikea')) return 'Shopping';
  if (lowerFilename.includes('paysafe') || lowerFilename.includes('paypal')) return 'Zahlung';
  
  return 'Sonstiges';
}

// Get all HTML files from a directory
function getAllHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.html') && file.startsWith('guthaben.de_'))
    .filter(file => !file.includes('_eur') && !file.includes('_euro') && !file.includes('_usd')) // Skip denomination pages
    .filter(file => !file.includes('_monate')) // Skip subscription period pages
    .filter(file => !file.includes('cookie') && !file.includes('datenschutz') && !file.includes('impressum')); // Skip legal pages
}

// Scan all products from directories
function scanAllProducts() {
  const directories = ['public/desktop', 'public/mobile'];
  const allProducts = new Map(); // filename -> product info
  
  directories.forEach(dir => {
    console.log(`\n📂 Scanning ${dir}...`);
    const files = getAllHtmlFiles(dir);
    console.log(`   Found ${files.length} product HTML files\n`);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const productName = extractProductFromTitle(content);
        
        if (productName) {
          // Use base filename (without desktop/mobile distinction) as key
          const baseFilename = file;
          
          if (!allProducts.has(baseFilename)) {
            const category = getProductCategory(file, content);
            allProducts.set(baseFilename, {
              name: productName,
              filename: baseFilename,
              category: category,
              foundIn: [dir]
            });
          } else {
            // Add directory to foundIn array
            allProducts.get(baseFilename).foundIn.push(dir);
          }
        }
      } catch (error) {
        console.error(`   ❌ Error reading ${file}:`, error.message);
      }
    });
  });
  
  return Array.from(allProducts.values());
}

// Get existing products from search files
function getExistingSearchProducts() {
  const searchFiles = [
    'public/desktop/assets/guthaben-search.js',
    'public/mobile/assets/guthaben-search.js',
    'public/guthaben-search.js',
    'public/search.js'
  ];
  
  const existingProducts = new Set();
  
  searchFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    try {
      const content = fs.readFileSync(file, 'utf-8');
      // Extract product names from the products array
      const nameMatches = content.matchAll(/name:\s*['"]([^'"]+)['"]/g);
      for (const match of nameMatches) {
        existingProducts.add(match[1]);
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  });
  
  return existingProducts;
}

// Main execution
function main() {
  console.log('Starting comprehensive product scan...\n');
  
  // Scan all products
  const allProducts = scanAllProducts();
  console.log(`\n✅ Total unique products found: ${allProducts.length}\n`);
  
  // Get existing search products
  const existingProducts = getExistingSearchProducts();
  console.log(`📋 Products in search files: ${existingProducts.size}\n`);
  
  // Categorize products
  const categorized = {};
  allProducts.forEach(product => {
    if (!categorized[product.category]) {
      categorized[product.category] = [];
    }
    categorized[product.category].push(product);
  });
  
  // Missing products analysis
  const missingProducts = allProducts.filter(p => !existingProducts.has(p.name));
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalProductsFound: allProducts.length,
      productsInSearch: existingProducts.size,
      missingFromSearch: missingProducts.length,
      categoriesFound: Object.keys(categorized).length
    },
    byCategory: categorized,
    missingProducts: missingProducts,
    allProducts: allProducts.sort((a, b) => a.name.localeCompare(b.name))
  };
  
  // Save reports
  fs.writeFileSync('product-scan-report.json', JSON.stringify(report, null, 2));
  
  // Generate simple raw list
  const rawList = allProducts
    .map(p => p.name)
    .sort()
    .join('\n');
  fs.writeFileSync('products-raw-list.txt', rawList);
  
  // Generate human-readable report
  let textReport = '═══════════════════════════════════════════════════════\n';
  textReport += '           COMPREHENSIVE PRODUCT SCAN REPORT\n';
  textReport += '═══════════════════════════════════════════════════════\n\n';
  
  textReport += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  textReport += '📊 SUMMARY\n';
  textReport += '─────────────────────────────────────────────────────\n';
  textReport += `Total Products Found:     ${report.summary.totalProductsFound}\n`;
  textReport += `Products in Search:       ${report.summary.productsInSearch}\n`;
  textReport += `Missing from Search:      ${report.summary.missingFromSearch}\n`;
  textReport += `Categories Found:         ${report.summary.categoriesFound}\n\n`;
  
  textReport += '📦 PRODUCTS BY CATEGORY\n';
  textReport += '─────────────────────────────────────────────────────\n';
  Object.entries(categorized)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, products]) => {
      textReport += `\n${category} (${products.length} products):\n`;
      products.forEach(p => {
        const inSearch = existingProducts.has(p.name) ? '✓' : '✗';
        textReport += `  ${inSearch} ${p.name}\n`;
        textReport += `     File: ${p.filename}\n`;
      });
    });
  
  if (missingProducts.length > 0) {
    textReport += '\n\n⚠️  MISSING FROM SEARCH\n';
    textReport += '─────────────────────────────────────────────────────\n';
    textReport += `The following ${missingProducts.length} products are NOT in search files:\n\n`;
    
    missingProducts.forEach((p, i) => {
      textReport += `${i + 1}. ${p.name}\n`;
      textReport += `   Category: ${p.category}\n`;
      textReport += `   File: ${p.filename}\n\n`;
    });
  }
  
  textReport += '\n═══════════════════════════════════════════════════════\n';
  textReport += '                    END OF REPORT\n';
  textReport += '═══════════════════════════════════════════════════════\n';
  
  fs.writeFileSync('product-scan-report.txt', textReport);
  
  // Console output
  console.log('\n📊 SCAN RESULTS:\n');
  console.log(`✅ Total Products Found: ${report.summary.totalProductsFound}`);
  console.log(`📋 Products in Search: ${report.summary.productsInSearch}`);
  console.log(`⚠️  Missing from Search: ${report.summary.missingFromSearch}`);
  console.log(`📂 Categories: ${report.summary.categoriesFound}`);
  
  console.log('\n\n📁 Reports saved:');
  console.log('   • product-scan-report.json (detailed data)');
  console.log('   • product-scan-report.txt (human-readable)');
  console.log('   • products-raw-list.txt (simple list of all products)');
  
  if (missingProducts.length > 0) {
    console.log('\n\n⚠️  ACTION REQUIRED:');
    console.log(`   ${missingProducts.length} products are missing from search files.`);
    console.log('   Check product-scan-report.txt for details.');
  }
  
  console.log('\n\n✅ Scan complete!\n');
}

// Run the scan
if (require.main === module) {
  main();
}

module.exports = { scanAllProducts, getExistingSearchProducts };
