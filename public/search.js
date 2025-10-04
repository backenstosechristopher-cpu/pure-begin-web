// Modern Search Functionality with Enhanced Results
(function() {
  'use strict';
  
  // Comprehensive product data for search with categories and pricing
  const products = [
    { name: 'PlayStation Network', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'desktop/guthaben.de_psn-card.html' },
    { name: 'Xbox Live', category: 'Gaming', price: '€15 - €100', icon: '🎮', url: 'desktop/guthaben.de_xbox-game-pass-oesterreich.html' },
    { name: 'Google Play', category: 'Apps & Games', price: '€5 - €100', icon: '📱', url: 'desktop/guthaben.de_google-play-guthaben.html' },
    { name: 'iTunes', category: 'Musik & Apps', price: '€10 - €100', icon: '🎵', url: 'desktop/guthaben.de_apple-gift-card.html' },
    { name: 'Amazon', category: 'Shopping', price: '€10 - €200', icon: '🛒', url: 'desktop/guthaben.de_amazon-gutschein.html' },
    { name: 'Netflix', category: 'Streaming', price: '€15 - €50', icon: '📺', url: 'desktop/guthaben.de_netflix-geschenkkarte.html' },
    { name: 'Spotify', category: 'Musik', price: '€10 - €60', icon: '🎵', url: 'desktop/guthaben.de_spotify-premium-code-oesterreich.html' },
    { name: 'Steam', category: 'Gaming', price: '€5 - €100', icon: '🎮', url: 'desktop/guthaben.de_steam-oesterreich.html' },
    { name: 'Nintendo eShop', category: 'Gaming', price: '€15 - €100', icon: '🎮', url: 'desktop/guthaben.de_nintendo-eshop-card.html' },
    { name: 'Fortnite V-Bucks', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'desktop/guthaben.de_fortnite.html' },
    { name: 'Roblox', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'desktop/guthaben.de_roblox-gift-card.html' },
    { name: 'League of Legends', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'desktop/guthaben.de_league-of-legends-riot-points.html' },
    { name: 'Valorant', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'desktop/guthaben.de_valorant.html' },
    { name: 'Uber', category: 'Transport', price: '€15 - €100', icon: '🚗', url: 'desktop/guthaben.de_uber.html' },
    { name: 'Zalando', category: 'Shopping', price: '€25 - €200', icon: '👗', url: 'desktop/guthaben.de_zalando-gutschein-oesterreich.html' },
    { name: 'IKEA', category: 'Shopping', price: '€25 - €500', icon: '🛋️', url: 'desktop/guthaben.de_ikea.html' },
    { name: 'MediaMarkt', category: 'Elektronik', price: '€25 - €500', icon: '🔌', url: 'desktop/guthaben.de_mediamarkt.html' },
    { name: 'Mobi', category: 'Mobilfunk', price: '€15', icon: '📞', url: 'desktop/guthaben.de_mobi-aufladen.html' },
    { name: 'Vodafone', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'desktop/guthaben.de_vodafone-aufladen.html' },
    { name: 'Telekom', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'desktop/guthaben.de_telekom.html' },
    { name: 'O2', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'desktop/guthaben.de_o2-aufladen.html' },
    { name: 'Disney+', category: 'Streaming', price: '€25 - €90', icon: '📺', url: 'desktop/guthaben.de_disney-plus.html' },
    { name: 'Apple Music', category: 'Musik', price: '€10 - €100', icon: '🎵', url: 'desktop/guthaben.de_apple-gift-card.html' },
    { name: 'EA Sports', category: 'Gaming', price: '€10 - €100', icon: '⚽', url: 'desktop/guthaben.de_ea-game-card.html' },
    { name: 'Blizzard Battle.net', category: 'Gaming', price: '€20 - €100', icon: '🎮', url: 'desktop/guthaben.de_battlenet-guthabenkarte.html' },
    { name: 'Paysafecard', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'desktop/guthaben.de_paysafecard.html' }
  ];
  
  function initSearch() {
    const searchInput = document.getElementById('guthaben-search-input');
    const searchResults = document.getElementById('guthaben-search-results');
    const searchContainer = document.querySelector('.guthaben-search-container');
    
    if (!searchInput || !searchResults) return;
    
    // Show popular products on focus (empty input)
    searchInput.addEventListener('focus', function() {
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
        <div class="search-result-item" data-product="${product.name}" data-url="${product.url || ''}">
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
          const productUrl = this.dataset.url;
          if (productUrl) {
            window.location.href = productUrl;
          }
        });
      });
    }
    
    // Search input handler with scoring algorithm
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
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
