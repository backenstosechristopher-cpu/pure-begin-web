// Auto-inject search scripts on all pages
(function() {
  'use strict';
  
  // Check if scripts are already loaded
  if (window.guthabenSearchLoaded) return;
  window.guthabenSearchLoaded = true;
  
  const v = 'v=' + Date.now();
  // Load universal search script
  const searchScript = document.createElement('script');
  searchScript.src = 'assets/universal-search.js?' + v;
  searchScript.async = false;
  document.head.appendChild(searchScript);
  
  // Load logo redirect fix
  const logoScript = document.createElement('script');
  logoScript.src = 'assets/logo-redirect-fix.js?' + v;
  logoScript.async = false;
  document.head.appendChild(logoScript);
  
  console.log('[Guthaben Mobile] Search scripts injected', v);
})();
