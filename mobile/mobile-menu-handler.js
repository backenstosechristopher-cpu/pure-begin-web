(function() {
  'use strict';
  
  console.log('[MOBILE MENU] Handler loaded');
  
  function init() {
    const menuButton = document.getElementById('menu-button');
    
    if (!menuButton) {
      console.log('[MOBILE MENU] Menu button not found, will retry...');
      return;
    }
    
    console.log('[MOBILE MENU] Menu button found:', menuButton);
    
    // Find the menu drawer/panel (common MUI Drawer patterns)
    const menuDrawer = document.querySelector(
      '[role="presentation"], [class*="MuiDrawer"], [class*="drawer"], [class*="menu-panel"], nav[class*="mobile"]'
    );
    
    console.log('[MOBILE MENU] Menu drawer found:', menuDrawer);
    
    // Find backdrop
    const backdrop = document.querySelector('.MuiBackdrop-root, [class*="Backdrop"], [class*="backdrop"]');
    
    console.log('[MOBILE MENU] Backdrop found:', backdrop);
    
    let isOpen = false;
    
    // Toggle menu function
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      isOpen = !isOpen;
      console.log('[MOBILE MENU] Toggling menu, isOpen:', isOpen);
      
      if (menuDrawer) {
        if (isOpen) {
          menuDrawer.style.transform = 'translateX(0)';
          menuDrawer.style.visibility = 'visible';
          menuDrawer.setAttribute('aria-hidden', 'false');
        } else {
          menuDrawer.style.transform = 'translateX(-100%)';
          menuDrawer.style.visibility = 'hidden';
          menuDrawer.setAttribute('aria-hidden', 'true');
        }
      }
      
      if (backdrop) {
        if (isOpen) {
          backdrop.style.opacity = '1';
          backdrop.style.visibility = 'visible';
          backdrop.style.pointerEvents = 'auto';
        } else {
          backdrop.style.opacity = '0';
          backdrop.style.visibility = 'hidden';
          backdrop.style.pointerEvents = 'none';
        }
      }
      
      // Update button aria
      menuButton.setAttribute('aria-expanded', String(isOpen));
    }
    
    // Attach event listeners
    menuButton.addEventListener('click', toggleMenu);
    menuButton.addEventListener('touchstart', toggleMenu, { passive: false });
    
    // Close on backdrop click
    if (backdrop) {
      backdrop.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
          toggleMenu();
        }
      });
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    });
    
    console.log('[MOBILE MENU] Menu handler attached successfully');
  }
  
  // Try to initialize multiple times as React renders
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Retry after delays for dynamic content
  setTimeout(init, 500);
  setTimeout(init, 1000);
  setTimeout(init, 2000);
  
  // Watch for mutations
  if (window.MutationObserver) {
    const observer = new MutationObserver(function() {
      const menuButton = document.getElementById('menu-button');
      if (menuButton && !menuButton.dataset._menuHandlerAttached) {
        menuButton.dataset._menuHandlerAttached = 'true';
        init();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
