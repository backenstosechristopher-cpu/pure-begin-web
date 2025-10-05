// Universal Quantity Enhancement - Desktop Version
(function() {
  'use strict';
  
  // Fix Next.js chunk loading paths
  if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
    // Intercept script loading to redirect to correct paths
    const originalAppendChild = Node.prototype.appendChild;
    const originalInsertBefore = Node.prototype.insertBefore;
    
    function fixScriptPath(element) {
      if (element && element.tagName === 'SCRIPT' && element.src) {
        const src = element.src;
        const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
        
        // Fix paths that reference old "Google Play gift code..." folder
        if (src.includes('Google%20Play%20gift%20code')) {
          const filename = src.split('/').pop();
          
          // Check if it's a Next.js chunk file
          if (filename.match(/^(\d+|[a-f0-9-]+|webpack|framework|main|polyfills|_app|_buildManifest|_ssgManifest)/)) {
            element.src = baseUrl + '_next/static/chunks/' + filename;
          }
        }
      }
      return element;
    }
    
    Node.prototype.appendChild = function(element) {
      return originalAppendChild.call(this, fixScriptPath(element));
    };
    
    Node.prototype.insertBefore = function(element, referenceNode) {
      return originalInsertBefore.call(this, fixScriptPath(element), referenceNode);
    };
    
    // Fix CSS paths
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'link') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'href' && value && value.includes('Google%20Play%20gift%20code') && value.endsWith('.css')) {
            const filename = value.split('/').pop();
            value = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + '_next/static/css/' + filename;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      return element;
    };
  }
  
  console.log('Universal quantity enhancement loaded for desktop payment page');
})();
