const { ProductParser } = require('./product-parser.js');

async function runAnalysis() {
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

runAnalysis().catch(console.error);