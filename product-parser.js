const fs = require('fs');
const path = require('path');

class ProductParser {
  constructor() {
    this.products = [];
    this.categories = new Set();
    this.brands = new Set();
  }

  // Extract metadata from HTML content
  extractMetadata(html, filename) {
    const metadata = {};
    
    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].replace(/&amp;/g, '&');
    }
    
    // Extract description
    const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
    if (descMatch) {
      metadata.description = descMatch[1].replace(/&amp;/g, '&');
    }
    
    // Extract brand
    const brandMatch = html.match(/<meta property="bc:brand" content="(.*?)"/i);
    if (brandMatch) {
      metadata.brand = brandMatch[1];
      this.brands.add(brandMatch[1]);
    }
    
    // Extract category
    const categoryMatch = html.match(/<meta property="bc:category" content="(.*?)"/i);
    if (categoryMatch) {
      metadata.category = categoryMatch[1];
      this.categories.add(categoryMatch[1]);
    }
    
    // Extract product code/ID
    const codeMatch = html.match(/<meta property="bc:pop:code" content="(.*?)"/i);
    if (codeMatch) {
      metadata.productCode = codeMatch[1];
    }
    
    // Extract slug
    const slugMatch = html.match(/<meta property="bc:pop:slug" content="(.*?)"/i);
    if (slugMatch) {
      metadata.slug = slugMatch[1];
    }
    
    // Extract pricing from filename patterns
    const priceMatch = filename.match(/(\d+)-eur/);
    if (priceMatch) {
      metadata.price = `${priceMatch[1]} EUR`;
    }
    
    // Extract brand from filename if not in meta
    if (!metadata.brand) {
      const filenameWithoutExt = filename.replace('.html', '');
      const parts = filenameWithoutExt.split('_');
      if (parts.length > 1) {
        const productName = parts[1].split('-')[0];
        metadata.brand = this.formatBrandName(productName);
      }
    }
    
    return metadata;
  }
  
  formatBrandName(name) {
    const brandMap = {
      'amazon': 'Amazon',
      'telekom': 'Telekom',
      'vodafone': 'Vodafone',
      'google': 'Google',
      'apple': 'Apple',
      'microsoft': 'Microsoft',
      'netflix': 'Netflix',
      'spotify': 'Spotify',
      'steam': 'Steam',
      'playstation': 'PlayStation',
      'xbox': 'Xbox',
      'nintendo': 'Nintendo',
      'fortnite': 'Fortnite',
      'league': 'League of Legends',
      'battlenet': 'Battle.net',
      'hearthstone': 'Hearthstone',
      'lycamobile': 'Lycamobile',
      'lebara': 'Lebara',
      'congstar': 'congstar',
      'o2': 'O2',
      'aldi': 'ALDI TALK'
    };
    
    return brandMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  categorizeProduct(filename, metadata) {
    const categoryMap = {
      'aufladen': 'Mobile Top-up',
      'gutschein': 'Gift Cards',
      'guthaben': 'Credit Cards',
      'prepaid': 'Prepaid Cards',
      'geschenkcode': 'Gift Codes',
      'geschenkkarte': 'Gift Cards',
      'giftcard': 'Gift Cards'
    };
    
    for (const [key, category] of Object.entries(categoryMap)) {
      if (filename.includes(key)) {
        return category;
      }
    }
    
    // Use metadata category if available
    if (metadata.category) {
      const metaCategoryMap = {
        'call_credit': 'Mobile Top-up',
        'shopping_giftcards': 'Gift Cards',
        'gaming': 'Gaming Cards',
        'entertainment': 'Entertainment Cards'
      };
      return metaCategoryMap[metadata.category] || metadata.category;
    }
    
    return 'Other';
  }
  
  async parseFile(filePath, device) {
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const filename = path.basename(filePath);
      
      // Skip non-product pages
      if (filename.includes('faq') || filename.includes('impressum') || 
          filename.includes('datenschutz') || filename.includes('cookie')) {
        return null;
      }
      
      const metadata = this.extractMetadata(html, filename);
      const category = this.categorizeProduct(filename, metadata);
      
      const product = {
        id: `${device}-${filename.replace('.html', '')}`,
        filename: filename,
        device: device,
        title: metadata.title || this.generateTitleFromFilename(filename),
        description: metadata.description || '',
        brand: metadata.brand || 'Unknown',
        category: category,
        price: metadata.price || null,
        productCode: metadata.productCode || null,
        slug: metadata.slug || null,
        url: `${device}/${filename}`
      };
      
      return product;
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error.message);
      return null;
    }
  }
  
  generateTitleFromFilename(filename) {
    return filename
      .replace('guthaben.de_', '')
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  async parseAllProducts() {
    const devices = ['desktop', 'mobile'];
    
    for (const device of devices) {
      const deviceDir = path.join('.', device);
      if (!fs.existsSync(deviceDir)) continue;
      
      const files = fs.readdirSync(deviceDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      console.log(`Parsing ${htmlFiles.length} HTML files from ${device}...`);
      
      for (const file of htmlFiles) {
        const filePath = path.join(deviceDir, file);
        const product = await this.parseFile(filePath, device);
        
        if (product) {
          this.products.push(product);
        }
      }
    }
    
    console.log(`\nParsing complete! Found ${this.products.length} products.`);
  }
  
  generateReport() {
    // Group products by category
    const byCategory = {};
    const byBrand = {};
    const priceRanges = {};
    
    this.products.forEach(product => {
      // By category
      if (!byCategory[product.category]) {
        byCategory[product.category] = [];
      }
      byCategory[product.category].push(product);
      
      // By brand
      if (!byBrand[product.brand]) {
        byBrand[product.brand] = [];
      }
      byBrand[product.brand].push(product);
      
      // Price analysis
      if (product.price) {
        const priceValue = parseInt(product.price.replace(' EUR', ''));
        const range = priceValue <= 10 ? '≤10 EUR' : 
                     priceValue <= 25 ? '11-25 EUR' : 
                     priceValue <= 50 ? '26-50 EUR' : 
                     priceValue <= 100 ? '51-100 EUR' : '>100 EUR';
        
        if (!priceRanges[range]) priceRanges[range] = 0;
        priceRanges[range]++;
      }
    });
    
    const report = {
      summary: {
        totalProducts: this.products.length,
        totalBrands: this.brands.size,
        totalCategories: this.categories.size,
        devicesSupported: ['desktop', 'mobile']
      },
      categories: Object.keys(byCategory).map(cat => ({
        name: cat,
        count: byCategory[cat].length,
        products: byCategory[cat].slice(0, 5).map(p => ({
          title: p.title,
          brand: p.brand,
          price: p.price
        }))
      })).sort((a, b) => b.count - a.count),
      brands: Object.keys(byBrand).map(brand => ({
        name: brand,
        count: byBrand[brand].length,
        categories: [...new Set(byBrand[brand].map(p => p.category))]
      })).sort((a, b) => b.count - a.count),
      priceDistribution: priceRanges,
      sampleProducts: this.products.slice(0, 20)
    };
    
    return report;
  }
  
  exportToJSON(filename = 'products.json') {
    const data = {
      products: this.products,
      report: this.generateReport(),
      metadata: {
        parsedAt: new Date().toISOString(),
        totalFiles: this.products.length,
        brands: Array.from(this.brands).sort(),
      categories: Array.from(this.categories).sort()
      }
    };
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\nData exported to ${filename}`);
    return data;
  }
  
  printSummary() {
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('              GUTHABEN.DE PRODUCT ANALYSIS');
    console.log('='.repeat(60));
    
    console.log(`\n📊 OVERVIEW:`);
    console.log(`   Total Products: ${report.summary.totalProducts}`);
    console.log(`   Total Brands: ${report.summary.totalBrands}`);
    console.log(`   Total Categories: ${report.summary.totalCategories}`);
    console.log(`   Devices: ${report.summary.devicesSupported.join(', ')}`);
    
    console.log(`\n🏷️  TOP CATEGORIES:`);
    report.categories.slice(0, 10).forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.name} (${cat.count} products)`);
    });
    
    console.log(`\n🏢 TOP BRANDS:`);
    report.brands.slice(0, 15).forEach((brand, i) => {
      console.log(`   ${i + 1}. ${brand.name} (${brand.count} products)`);
    });
    
    console.log(`\n💰 PRICE DISTRIBUTION:`);
    Object.entries(report.priceDistribution).forEach(([range, count]) => {
      console.log(`   ${range}: ${count} products`);
    });
    
    console.log(`\n📱 SAMPLE PRODUCTS:`);
    report.sampleProducts.slice(0, 10).forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.brand} - ${product.title.substring(0, 50)}...`);
      console.log(`      Category: ${product.category} | Price: ${product.price || 'N/A'}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run the parser
async function main() {
  console.log('🔍 Starting comprehensive product analysis...\n');
  
  const parser = new ProductParser();
  await parser.parseAllProducts();
  
  // Generate and display report
  parser.printSummary();
  
  // Export data
  const data = parser.exportToJSON('guthaben-products.json');
  
  console.log(`\n✅ Analysis complete! Check 'guthaben-products.json' for full data.`);
  
  return data;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ProductParser };