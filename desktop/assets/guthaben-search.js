// Guthaben.de Search Integration - All-in-One
(function() {
  'use strict';
  
  // Inject CSS styles
  function injectStyles() {
    if (document.getElementById('guthaben-search-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'guthaben-search-styles';
    style.textContent = `
      .guthaben-search-section {
        padding: 32px 20px;
        background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
        margin-bottom: 24px;
      }
      
      .guthaben-search-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        z-index: 999;
      }
      
      .guthaben-search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background: #fff;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 12px 20px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      
      .guthaben-search-wrapper:focus-within {
        border-color: #ffa81e;
        box-shadow: 0 4px 16px rgba(255, 168, 30, 0.2);
      }
      
      .search-icon {
        color: #666;
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      #guthaben-search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        font-family: 'sofia-pro', sans-serif;
        color: #032e33;
        background: transparent;
      }
      
      #guthaben-search-input::placeholder {
        color: #999;
      }
      
      #guthaben-search-results,
      .guthaben-search-results-existing {
        position: fixed;
        top: 0;
        left: 0;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        max-height: 500px;
        overflow-y: auto;
        display: none;
        z-index: 2147483647;
      }
      
      .search-category-header {
        padding: 12px 20px;
        font-size: 13px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: #f8f8f8;
        border-top: 1px solid #e0e0e0;
      }
      
      .search-category-header:first-child {
        border-top: none;
        border-radius: 12px 12px 0 0;
      }
      
      .search-result-item {
        display: flex;
        align-items: center;
        padding: 14px 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid #f0f0f0;
        gap: 12px;
      }
      
      .search-result-item:hover {
        background: #fff8f0;
        padding-left: 24px;
      }
      
      .result-icon {
        font-size: 28px;
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f8f8;
        border-radius: 8px;
      }
      
      .result-content {
        flex: 1;
        min-width: 0;
      }
      
      .result-name {
        font-size: 15px;
        font-weight: 600;
        color: #032e33;
        margin-bottom: 4px;
      }
      
      .result-meta {
        display: flex;
        gap: 12px;
        font-size: 13px;
        color: #666;
      }
      
      .result-price {
        color: #ffa81e;
        font-weight: 600;
      }
      
      .result-arrow {
        color: #ccc;
        flex-shrink: 0;
        transition: transform 0.2s ease, color 0.2s ease;
      }
      
      .search-result-item:hover .result-arrow {
        transform: translateX(4px);
        color: #ffa81e;
      }
      
      .search-no-results {
        padding: 40px 20px;
        text-align: center;
        color: #666;
      }
      
      .search-no-results svg {
        margin: 0 auto 16px;
        color: #ccc;
      }
      
      .search-no-results div {
        font-size: 16px;
        font-weight: 600;
        color: #032e33;
        margin-bottom: 8px;
      }
      
      .search-no-results small {
        font-size: 14px;
        color: #999;
      }
      
      @media (max-width: 768px) {
        .guthaben-search-section {
          padding: 24px 16px;
        }
        
        .guthaben-search-wrapper {
          padding: 10px 16px;
        }
        
        #guthaben-search-input {
          font-size: 15px;
        }
        
        #guthaben-search-results {
          max-height: 400px;
        }
        
        .result-icon {
          font-size: 24px;
          width: 36px;
          height: 36px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Product data
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
  
  // Inject HTML - Just add results container
  function injectHTML() {
    // Find the existing search input (desktop and mobile)
    const existingInput =
      document.getElementById('search-field-input') ||
      document.querySelector('input[placeholder*="Suche nach Produkten" i]') ||
      document.querySelector('.MuiAutocomplete-input');
    if (!existingInput) return;
    
    // Find the parent container
    const inputContainer = existingInput.closest('.MuiInputBase-root') || existingInput.parentElement;
    if (!inputContainer) return;
    
    // Create and add results container if not present
    if (!document.getElementById('guthaben-search-results')) {
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'guthaben-search-results';
      resultsContainer.className = 'guthaben-search-results-existing';
      document.body.appendChild(resultsContainer);
    }
  }
  
  // Initialize search functionality
  function initSearch() {
    // Use the existing search input
    const searchInput = document.getElementById('search-field-input') ||
      document.querySelector('input[placeholder*="Suche nach Produkten" i]') ||
      document.querySelector('.MuiAutocomplete-input') ||
      document.getElementById('guthaben-search-input');
    let searchResults = document.getElementById('guthaben-search-results') || (injectHTML(), document.getElementById('guthaben-search-results'));
    if (!searchInput || !searchResults) { console.log('[Search] init aborted: input/results missing'); return; }
    if (searchInput.dataset.gthBound === '1') { console.log('[Search] already bound'); return; }
    searchInput.dataset.gthBound = '1';
    console.log('[Search] initialized, input found:', !!searchInput, 'results:', !!searchResults);
    
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
    // Prepopulate suggestions on load for visibility and position dropdown
    const positionDropdown = () => {
      const rect = searchInput.getBoundingClientRect();
      Object.assign(searchResults.style, {
        width: rect.width + 'px',
        left: Math.round(rect.left) + 'px',
        top: Math.round(rect.bottom + 8) + 'px'
      });
    };
    showPopularProducts();
    positionDropdown();
    function showPopularProducts() {
      const popular = products.slice(0, 8);
      searchResults.innerHTML = `
        <div class="search-category-header">Beliebte Produkte</div>
        ${popular.map(product => createResultHTML(product)).join('')}
      `;
      searchResults.style.display = 'block';
      positionDropdown();
      attachResultHandlers();
    }
    
    function attachResultHandlers() {
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
          const productName = this.dataset.product;
          searchInput.value = productName;
          searchResults.style.display = 'none';
        });
      });
    }
    
    searchInput.addEventListener('focus', function() {
      positionDropdown();
      if (searchInput.value.trim() === '') {
        console.log('[Search] focus -> show popular');
        showPopularProducts();
      } else {
        searchResults.style.display = 'block';
      }
    });
    
    searchInput.addEventListener('input', function(e) {
      const query = String(e.target.value || '').toLowerCase().trim();
      positionDropdown();
      if (query.length > 80) { return; }
      if (query.length === 0) {
        showPopularProducts();
        return;
      }
      const filtered = products
        .map(product => {
          const name = product.name.toLowerCase();
          const category = product.category.toLowerCase();
          let score = 0;
          if (name === query) score += 100;
          else if (name.startsWith(query)) score += 50;
          else if (name.includes(query)) score += 25;
          else if (category.includes(query)) score += 10;
          return { product, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
      console.log('[Search] input:', query, 'results:', filtered.length);
      if (filtered.length > 0) {
        searchResults.innerHTML = filtered.map(p => createResultHTML(p)).join('');
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
    
    ['resize','scroll'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (searchResults.style.display === 'block') positionDropdown();
      }, { passive: true });
    });
    document.addEventListener('click', function(e) {
      const container = searchInput.closest('.MuiInputBase-root') || document.querySelector('.guthaben-search-container');
      if (container && !container.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
  
  // Initialize everything
  function init() {
    injectStyles();
    let attempts = 0;
    const timer = setInterval(() => {
      injectHTML();
      const input = document.getElementById('search-field-input') ||
        document.querySelector('input[placeholder*="Suche nach Produkten" i]') ||
        document.querySelector('.MuiAutocomplete-input') ||
        document.getElementById('guthaben-search-input');
      if (input) {
        clearInterval(timer);
        initSearch();
      } else if (++attempts >= 20) {
        clearInterval(timer);
        console.warn('[Search] input not found after retries');
      }
    }, 250);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
