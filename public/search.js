// Modern Search Functionality
(function() {
  'use strict';
  
  // Sample product data for search suggestions
  const products = [
    'PlayStation Network',
    'Xbox Live',
    'Google Play',
    'iTunes',
    'Amazon',
    'Netflix',
    'Spotify',
    'Steam',
    'PayPal',
    'Nintendo eShop',
    'Fortnite',
    'Roblox',
    'League of Legends',
    'Valorant',
    'Uber',
    'Zalando',
    'IKEA',
    'MediaMarkt',
    'Mobi'
  ];
  
  function initSearch() {
    const searchInput = document.getElementById('guthaben-search-input');
    const searchResults = document.getElementById('guthaben-search-results');
    const searchContainer = document.querySelector('.guthaben-search-container');
    
    if (!searchInput || !searchResults) return;
    
    // Search input handler
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
      }
      
      // Filter products
      const filtered = products.filter(product => 
        product.toLowerCase().includes(query)
      );
      
      // Display results
      if (filtered.length > 0) {
        searchResults.innerHTML = filtered.map(product => 
          `<div class="search-result-item" data-product="${product}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span>${product}</span>
          </div>`
        ).join('');
        searchResults.style.display = 'block';
        
        // Add click handlers to results
        document.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', function() {
            const productName = this.dataset.product;
            searchInput.value = productName;
            searchResults.style.display = 'none';
            console.log('Selected:', productName);
            // Here you could redirect to product page or trigger search
          });
        });
      } else {
        searchResults.innerHTML = '<div class="search-no-results">Keine Ergebnisse gefunden</div>';
        searchResults.style.display = 'block';
      }
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchContainer.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          console.log('Searching for:', query);
          searchResults.style.display = 'none';
          // Here you could redirect to search results page
        }
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
