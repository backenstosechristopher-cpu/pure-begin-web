// Modern Search Functionality with Enhanced Results
(function() {
  'use strict';
  
  // Comprehensive product data for search with categories and pricing
  const products = [
    { name: 'PlayStation Network', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Live', category: 'Gaming', price: '€15 - €100', icon: '🎮' },
    { name: 'Google Play', category: 'Apps & Games', price: '€5 - €100', icon: '📱' },
    { name: 'iTunes', category: 'Musik & Apps', price: '€10 - €100', icon: '🎵' },
    { name: 'Amazon', category: 'Shopping', price: '€10 - €200', icon: '🛒' },
    { name: 'Netflix', category: 'Streaming', price: '€15 - €50', icon: '📺' },
    { name: 'Spotify', category: 'Musik', price: '€10 - €60', icon: '🎵' },
    { name: 'Steam', category: 'Gaming', price: '€5 - €100', icon: '🎮' },
    { name: 'PayPal', category: 'Zahlung', price: '€10 - €500', icon: '💳' },
    { name: 'Nintendo eShop', category: 'Gaming', price: '€15 - €100', icon: '🎮' },
    { name: 'Fortnite V-Bucks', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Roblox', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'League of Legends', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Valorant', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Uber', category: 'Transport', price: '€15 - €100', icon: '🚗' },
    { name: 'Zalando', category: 'Shopping', price: '€25 - €200', icon: '👗' },
    { name: 'IKEA', category: 'Shopping', price: '€25 - €500', icon: '🛋️' },
    { name: 'MediaMarkt', category: 'Elektronik', price: '€25 - €500', icon: '🔌' },
    { name: 'Mobi', category: 'Mobilfunk', price: '€15', icon: '📞' },
    { name: 'Vodafone', category: 'Mobilfunk', price: '€15 - €50', icon: '📱' },
    { name: 'Telekom', category: 'Mobilfunk', price: '€15 - €50', icon: '📱' },
    { name: 'O2', category: 'Mobilfunk', price: '€15 - €50', icon: '📱' },
    { name: 'Disney+', category: 'Streaming', price: '€25 - €90', icon: '📺' },
    { name: 'Apple Music', category: 'Musik', price: '€10 - €100', icon: '🎵' },
    { name: 'YouTube Premium', category: 'Streaming', price: '€12 - €120', icon: '📺' },
    { name: 'Minecraft', category: 'Gaming', price: '€27', icon: '🎮' },
    { name: 'EA Sports', category: 'Gaming', price: '€10 - €100', icon: '⚽' },
    { name: 'Blizzard Battle.net', category: 'Gaming', price: '€20 - €100', icon: '🎮' },
    { name: 'Paysafecard', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Skype', category: 'Kommunikation', price: '€10 - €50', icon: '📞' }
  ];
  
  function initSearch() {
    const searchInput = document.getElementById('guthaben-search-input');
    const searchResults = document.getElementById('guthaben-search-results');
    const searchContainer = document.querySelector('.guthaben-search-container');
    
    console.log('Search initialized:', { searchInput, searchResults, searchContainer });
    
    if (!searchInput || !searchResults) {
      console.error('Search elements not found!');
      return;
    }
    
    console.log('Search functionality ready');
    
    // Show popular products on focus (empty input)
    searchInput.addEventListener('focus', function() {
      console.log('Search input focused');
      if (searchInput.value.trim() === '') {
        showPopularProducts();
      }
    });
    
    function showPopularProducts() {
      const popular = products.slice(0, 8);
      searchResults.innerHTML = `
        <div class="search-category-header">Beliebte Produkte</div>
        ${popular.map(product => createResultHTML(product)).join('')}
      `;
      searchResults.style.display = 'block';
      attachResultHandlers();
    }
    
    function createResultHTML(product) {
      return `
        <div class="search-result-item" data-product="${product.name}">
          <div class="result-icon">${product.icon}</div>
          <div class="result-content">
            <div class="result-name">${product.name}</div>
            <div class="result-meta">
              <span class="result-category">${product.category}</span>
              <span class="result-price">${product.price}</span>
            </div>
          </div>
          <svg class="result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      `;
    }
    
    function attachResultHandlers() {
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
          const productName = this.dataset.product;
          searchInput.value = productName;
          searchResults.style.display = 'none';
          console.log('Selected product:', productName);
          // Navigate or trigger product selection
        });
      });
    }
    
    // Search input handler with scoring algorithm
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      console.log('Search query:', query);
      
      if (query.length === 0) {
        showPopularProducts();
        return;
      }
      
      // Smart search with scoring
      const filtered = products
        .map(product => {
          const name = product.name.toLowerCase();
          const category = product.category.toLowerCase();
          let score = 0;
          
          // Exact match gets highest score
          if (name === query) score += 100;
          // Starts with query gets high score
          else if (name.startsWith(query)) score += 50;
          // Contains query gets medium score
          else if (name.includes(query)) score += 25;
          // Category match gets lower score
          else if (category.includes(query)) score += 10;
          
          return { product, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
      
      // Display results
      if (filtered.length > 0) {
        // Group by category if more than 6 results
        if (filtered.length > 6) {
          const grouped = {};
          filtered.forEach(product => {
            if (!grouped[product.category]) grouped[product.category] = [];
            grouped[product.category].push(product);
          });
          
          let html = '';
          Object.keys(grouped).slice(0, 4).forEach(category => {
            html += `<div class="search-category-header">${category}</div>`;
            html += grouped[category].slice(0, 3).map(p => createResultHTML(p)).join('');
          });
          searchResults.innerHTML = html;
        } else {
          searchResults.innerHTML = filtered.map(p => createResultHTML(p)).join('');
        }
        
        searchResults.style.display = 'block';
        attachResultHandlers();
      } else {
        searchResults.innerHTML = `
          <div class="search-no-results">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <div>Keine Ergebnisse für "${query}"</div>
            <small>Versuchen Sie es mit anderen Suchbegriffen</small>
          </div>
        `;
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
