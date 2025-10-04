// Auto-inject search scripts on all pages
(function() {
  'use strict';
  
  // Check if scripts are already loaded
  if (window.guthabenSearchLoaded) return;
  window.guthabenSearchLoaded = true;
  
  // Load universal search script
  const searchScript = document.createElement('script');
  searchScript.src = 'assets/universal-search.js';
  searchScript.async = false;
  document.head.appendChild(searchScript);
  
  // Load logo redirect fix
  const logoScript = document.createElement('script');
  logoScript.src = 'assets/logo-redirect-fix.js';
  logoScript.async = false;
  document.head.appendChild(logoScript);
  
  console.log('[Guthaben] Search scripts injected');
})();
