// Inject Search Functionality into Pages
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchInjection);
  } else {
    initSearchInjection();
  }
  
  function initSearchInjection() {
    // Find the main container or body
    const mainContainer = document.querySelector('.mui-style-zf0iqh') || document.querySelector('main') || document.body;
    
    if (!mainContainer) return;
    
    // Create search section HTML
    const searchHTML = `
      <div class="guthaben-search-section">
        <div class="guthaben-search-container">
          <div class="guthaben-search-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              id="guthaben-search-input" 
              placeholder="Suche nach Produkten... (z.B. PlayStation, Netflix, Amazon)"
              autocomplete="off"
            />
          </div>
          <div id="guthaben-search-results"></div>
        </div>
      </div>
    `;
    
    // Find the header/sticky element
    const header = document.querySelector('.mui-style-zggve2');
    
    if (header && header.nextSibling) {
      // Insert search after header
      const searchDiv = document.createElement('div');
      searchDiv.innerHTML = searchHTML;
      header.parentNode.insertBefore(searchDiv.firstElementChild, header.nextSibling);
    } else {
      // Fallback: insert at beginning of main container
      const firstChild = mainContainer.firstChild;
      const searchDiv = document.createElement('div');
      searchDiv.innerHTML = searchHTML;
      mainContainer.insertBefore(searchDiv.firstElementChild, firstChild);
    }
    
    // Load search CSS
    if (!document.getElementById('guthaben-search-styles')) {
      const link = document.createElement('link');
      link.id = 'guthaben-search-styles';
      link.rel = 'stylesheet';
      link.href = '../search.css';
      document.head.appendChild(link);
    }
    
    // Load search functionality
    if (!document.getElementById('guthaben-search-script')) {
      const script = document.createElement('script');
      script.id = 'guthaben-search-script';
      script.src = '../search.js';
      document.head.appendChild(script);
    }
  }
})();
