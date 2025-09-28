// Run the comprehensive asset path fix
const { exec } = require('child_process');

console.log('Running comprehensive asset path fix...');

exec('node fix-all-asset-paths.js', (error, stdout, stderr) => {
    if (error) {
        console.error('Error running fix:', error);
        return;
    }
    
    if (stderr) {
        console.error('stderr:', stderr);
    }
    
    console.log(stdout);
    console.log('Asset path fix completed!');
});