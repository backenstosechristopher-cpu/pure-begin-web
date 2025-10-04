// Universal Search for Desktop - Works on any page
(function() {
  'use strict';
  
  // Inject CSS styles
  function injectStyles() {
    if (document.getElementById('guthaben-search-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'guthaben-search-styles';
    style.textContent = `
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
  
  // Product data with URLs
  const products = [
    { name: 'PlayStation Network', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_psn-card.html' },
    { name: 'Xbox Live', category: 'Gaming', price: '€15 - €100', icon: '🎮', url: 'guthaben.de_xbox-live.html' },
    { name: 'Google Play', category: 'Apps & Games', price: '€5 - €100', icon: '📱', url: 'guthaben.de_google-play-guthaben.html' },
    { name: 'iTunes', category: 'Musik & Apps', price: '€10 - €100', icon: '🎵', url: 'guthaben.de_apple-gift-card.html' },
    { name: 'Amazon', category: 'Shopping', price: '€10 - €200', icon: '🛒', url: 'guthaben.de_amazon-gutschein.html' },
    { name: 'Netflix', category: 'Streaming', price: '€15 - €50', icon: '📺', url: 'guthaben.de_netflix-geschenkkarte.html' },
    { name: 'Spotify', category: 'Musik', price: '€10 - €60', icon: '🎵', url: 'guthaben.de_spotify.html' },
    { name: 'Steam', category: 'Gaming', price: '€5 - €100', icon: '🎮', url: 'guthaben.de_steam-gift-card.html' },
    { name: 'PayPal', category: 'Zahlung', price: '€10 - €500', icon: '💳', url: 'guthaben.de_paypal-guthabenkarte.html' },
    { name: 'Nintendo eShop', category: 'Gaming', price: '€15 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop.html' },
    { name: 'Fortnite V-Bucks', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite.html' },
    { name: 'Roblox', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_roblox.html' },
    { name: 'League of Legends', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points.html' },
    { name: 'Valorant', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_valorant-riot-points.html' },
    { name: 'Uber', category: 'Transport', price: '€15 - €100', icon: '🚗', url: 'guthaben.de_uber.html' },
    { name: 'Zalando', category: 'Shopping', price: '€25 - €200', icon: '👗', url: 'guthaben.de_zalando.html' },
    { name: 'IKEA', category: 'Shopping', price: '€25 - €500', icon: '🛋️', url: 'guthaben.de_ikea.html' },
    { name: 'MediaMarkt', category: 'Elektronik', price: '€25 - €500', icon: '🔌', url: 'guthaben.de_mediamarkt.html' },
    { name: 'Mobi', category: 'Mobilfunk', price: '€15', icon: '📞', url: 'guthaben.de_mobi-aufladen.html' },
    { name: 'Vodafone', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'guthaben.de_vodafone-aufladen.html' },
    { name: 'Telekom', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'guthaben.de_telekom-aufladen.html' },
    { name: 'O2', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'guthaben.de_o2-aufladen.html' },
    { name: 'Disney+', category: 'Streaming', price: '€25 - €90', icon: '📺', url: 'guthaben.de_disney-plus.html' },
    { name: 'Apple Music', category: 'Musik', price: '€10 - €100', icon: '🎵', url: 'guthaben.de_apple-gift-card.html' },
    { name: 'YouTube Premium', category: 'Streaming', price: '€12 - €120', icon: '📺', url: 'guthaben.de_youtube-premium.html' },
    { name: 'Minecraft', category: 'Gaming', price: '€27', icon: '🎮', url: 'guthaben.de_minecraft.html' },
    { name: 'EA Sports', category: 'Gaming', price: '€10 - €100', icon: '⚽', url: 'guthaben.de_ea-game-card.html' },
    { name: 'Blizzard Battle.net', category: 'Gaming', price: '€20 - €100', icon: '🎮', url: 'guthaben.de_battlenet-guthabenkarte.html' },
    { name: 'Paysafecard', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard.html' },
    { name: 'Skype', category: 'Kommunikation', price: '€10 - €50', icon: '📞', url: 'guthaben.de_skype.html' }
  ];
  
  function injectHTML() {
    const existingInput = document.getElementById('search-field-input');
    if (!existingInput) return;
    
    if (!document.getElementById('guthaben-search-results')) {
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'guthaben-search-results';
      resultsContainer.className = 'guthaben-search-results-existing';
      document.body.appendChild(resultsContainer);
    }
  }
  
  function initSearch() {
    const searchInput = document.getElementById('search-field-input') ||
                       document.querySelector('.MuiAutocomplete-input') ||
                       document.querySelector('[role="combobox"]');
    if (!searchInput) return;
    if (!searchInput.id) searchInput.id = 'search-field-input';
    
    let searchResults = document.getElementById('guthaben-search-results') || (injectHTML(), document.getElementById('guthaben-search-results'));
    if (!searchResults) return;
    if (searchInput.dataset.gthBound === '1') return;
    searchInput.dataset.gthBound = '1';
    
    function createResultHTML(product) {
      return `
        <div class="search-result-item" data-url="${product.url || ''}">
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
    
    const positionDropdown = () => {
      const rect = searchInput.getBoundingClientRect();
      Object.assign(searchResults.style, {
        width: rect.width + 'px',
        left: Math.round(rect.left) + 'px',
        top: Math.round(rect.bottom + 8) + 'px'
      });
    };
    
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
    
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
    
    searchInput.addEventListener('focus', function() {
      positionDropdown();
      if (searchInput.value.trim() !== '') {
        searchResults.style.display = 'block';
      }
    });
    
    const handleInput = (raw) => {
      const query = String(raw || '').toLowerCase().trim();
      positionDropdown();
      if (query.length > 80 || query.length === 0) {
        searchResults.style.display = 'none';
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
    };

    ['input','keyup','change','paste','compositionend'].forEach(evt => {
      searchInput.addEventListener(evt, () => handleInput(searchInput.value));
    });
    searchInput.addEventListener('keydown', () => setTimeout(() => handleInput(searchInput.value), 0));
    
    ['resize','scroll'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (searchResults.style.display === 'block') positionDropdown();
      }, { passive: true });
    });
    
    document.addEventListener('click', function(e) {
      const container = searchInput.closest('.MuiInputBase-root');
      if (container && !container.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
  
  function init() {
    injectStyles();
    let attempts = 0;
    const timer = setInterval(() => {
      injectHTML();
      const input = document.getElementById('search-field-input') || 
                    document.querySelector('.MuiAutocomplete-input') ||
                    document.querySelector('[role="combobox"]') ||
                    document.querySelector('input[placeholder*="Suche"]');
      if (input) {
        if (!input.id) input.id = 'search-field-input';
        clearInterval(timer);
        initSearch();
        try {
          const mo = new MutationObserver(() => {
            const el = document.getElementById('search-field-input') || 
                       document.querySelector('.MuiAutocomplete-input') ||
                       document.querySelector('[role="combobox"]');
            if (el) {
              if (!el.id) el.id = 'search-field-input';
              if (el.dataset.gthBound !== '1') {
                initSearch();
              }
            }
          });
          mo.observe(document.body, { childList: true, subtree: true });
        } catch (e) {}
      } else if (++attempts >= 100) {
        clearInterval(timer);
      }
    }, 150);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();