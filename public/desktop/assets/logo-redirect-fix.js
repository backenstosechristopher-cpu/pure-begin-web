// Fix logo redirect to point to guthaben.de_.html instead of /
(function() {
  'use strict';
  
  function fixLogoLinks() {
    // Find all links that contain the logo image
    const logoLinks = Array.from(document.querySelectorAll('a[href="/"]')).filter(link => {
      const img = link.querySelector('img[src*="logo-recharge"]');
      return img !== null;
    });
    
    logoLinks.forEach(link => {
      link.href = 'guthaben.de_.html';
      console.log('[Logo Fix] Updated logo link to guthaben.de_.html');
    });
    
    // Also fix any direct image links
    const logoImages = document.querySelectorAll('img[src*="logo-recharge"]');
    logoImages.forEach(img => {
      const parentLink = img.closest('a');
      if (parentLink && parentLink.getAttribute('href') === '/') {
        parentLink.href = 'guthaben.de_.html';
        console.log('[Logo Fix] Updated parent link to guthaben.de_.html');
      }
    });
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLogoLinks);
  } else {
    fixLogoLinks();
  }
  
  // Also watch for dynamic changes
  const observer = new MutationObserver(fixLogoLinks);
  observer.observe(document.body, { childList: true, subtree: true });
})();