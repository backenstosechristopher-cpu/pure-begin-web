const fs = require('fs');
const path = require('path');

function fixAllHtmlFiles() {
    const processDir = (dir) => {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                processDir(fullPath);
            } else if (item.endsWith('.html')) {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    const originalContent = content;
                    
                    // Apply all fixes
                    content = content
                        // Fix basic asset references
                        .replace(/href="assets\//g, 'href="https://guthaben.de/assets/')
                        .replace(/src="assets\//g, 'src="https://guthaben.de/assets/')
                        
                        // Fix favicon specifically  
                        .replace(/href="assets\/favicon/g, 'href="https://guthaben.de/assets/favicon')
                        
                        // Fix CSS files specifically
                        .replace(/href="assets\/guthaben\.css"/g, 'href="https://guthaben.de/assets/guthaben.css"')
                        
                        // Fix _next/image references
                        .replace(/\/_next\/image/g, 'https://guthaben.de/_next/image')
                        
                        // Fix canonical URLs pointing to assets
                        .replace(/href="assets"([^>]*rel="canonical")/g, 'href="https://guthaben.de/"$1')
                        .replace(/rel="canonical" href="assets"/g, 'rel="canonical" href="https://guthaben.de/"')
                        .replace(/href="assets\/([^"]*)"([^>]*rel="canonical")/g, 'href="https://guthaben.de/$1"$2')
                        
                        // Fix preconnect references
                        .replace(/href="assets" crossorigin/g, 'href="https://guthaben.de" crossorigin')
                        
                        // Fix remaining relative paths
                        .replace(/src="\/(?!\/)/g, 'src="https://guthaben.de/')
                        .replace(/href="\/(?!\/)/g, 'href="https://guthaben.de/')
                        
                        // Fix any remaining assets references without quotes
                        .replace(/href="assets"([^/])/g, 'href="https://guthaben.de/"$1')
                        
                        // Fix script sources
                        .replace(/src="assets\/([^"]*\.js)"/g, 'src="https://guthaben.de/assets/$1"')
                        
                        // Ensure http becomes https
                        .replace(/http:\/\/guthaben\.de/g, 'https://guthaben.de');
                    
                    if (content !== originalContent) {
                        fs.writeFileSync(fullPath, content);
                        console.log(`✓ Fixed ${fullPath}`);
                    }
                } catch (error) {
                    console.error(`✗ Error processing ${fullPath}:`, error.message);
                }
            }
        });
    };
    
    console.log('Starting universal HTML asset fix...');
    processDir('public');
    console.log('Universal asset fix completed!');
}

fixAllHtmlFiles();