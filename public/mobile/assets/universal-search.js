// Universal Search for Mobile - Works on any page
(function() {
  'use strict';
  
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
    { name: 'Vodafone', category: 'Mobilfunk', price: '€15 - €50', icon: '📱', url: 'guthaben.de_vodafone-aufladen.html' },
    { name: 'Disney+', category: 'Streaming', price: '€25 - €90', icon: '📺', url: 'guthaben.de_disney-plus.html' }
  ];
  
  let searchOverlay = null;
  let searchInput = null;
  let searchResults = null;
  
  function createSearchOverlay() {
    searchOverlay = document.createElement('div');
    searchOverlay.id = 'mobile-search-overlay';
    searchOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      z-index: 9999;
      display: none;
      flex-direction: column;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #fff;
      position: sticky;
      top: 0;
      z-index: 10000;
    `;
    
    const backBtn = document.createElement('button');
    backBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#032e33" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    `;
    backBtn.style.cssText = `
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    `;
    backBtn.onclick = closeSearch;
    
    const inputWrapper = document.createElement('div');
    inputWrapper.style.cssText = `
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 10px 16px;
    `;
    
    const searchIcon = document.createElement('div');
    searchIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#738A8C" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
    `;
    searchIcon.style.cssText = 'margin-right: 8px; display: flex;';
    
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Suche nach Produkten...';
    searchInput.style.cssText = `
      flex: 1;
      border: none;
      background: transparent;
      font-size: 16px;
      font-family: 'sofia-pro', sans-serif;
      color: #032e33;
      outline: none;
    `;
    searchInput.addEventListener('input', handleSearch);
    
    inputWrapper.appendChild(searchIcon);
    inputWrapper.appendChild(searchInput);
    header.appendChild(backBtn);
    header.appendChild(inputWrapper);
    
    searchResults = document.createElement('div');
    searchResults.id = 'mobile-search-results';
    searchResults.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    `;
    
    searchOverlay.appendChild(header);
    searchOverlay.appendChild(searchResults);
    document.body.appendChild(searchOverlay);
  }
  
  function openSearch() {
    if (!searchOverlay) {
      createSearchOverlay();
    }
    searchOverlay.style.display = 'flex';
    setTimeout(() => searchInput.focus(), 100);
  }
  
  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.style.display = 'none';
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  }
  
  function createResultHTML(product) {
    return `
      <div class="mobile-search-result" data-url="${product.url || ''}" style="
        display: flex;
        align-items: center;
        padding: 14px;
        cursor: pointer;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background 0.2s;
      ">
        <div style="
          font-size: 28px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          border-radius: 8px;
          margin-right: 12px;
          flex-shrink: 0;
        ">${product.icon}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 15px; font-weight: 600; color: #032e33; margin-bottom: 4px;">
            ${product.name}
          </div>
          <div style="display: flex; gap: 12px; font-size: 13px; color: #666;">
            <span style="font-weight: 500;">${product.category}</span>
            <span style="color: #ffa81e; font-weight: 600;">${product.price}</span>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="flex-shrink: 0;">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    `;
  }
  
  function attachResultHandlers() {
    document.querySelectorAll('.mobile-search-result').forEach(item => {
      item.addEventListener('mousedown', function() {
        this.style.background = '#fff8f0';
      });
      item.addEventListener('mouseup', function() {
        this.style.background = 'transparent';
      });
      item.addEventListener('click', function() {
        const productUrl = this.dataset.url;
        if (productUrl) {
          window.location.href = productUrl;
        }
      });
    });
  }
  
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
      searchResults.innerHTML = '';
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
      searchResults.innerHTML = `
        <div style="font-size: 13px; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 12px;">
          Suchergebnisse
        </div>
        ${filtered.map(p => createResultHTML(p)).join('')}
      `;
      attachResultHandlers();
    } else {
      searchResults.innerHTML = `
        <div style="padding: 60px 20px; text-align: center; color: #666;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 16px; color: #ccc;">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <div style="font-size: 16px; font-weight: 600; color: #032e33; margin-bottom: 8px;">
            Keine Ergebnisse für "${query}"
          </div>
          <div style="font-size: 14px; color: #999;">
            Versuchen Sie es mit anderen Suchbegriffen
          </div>
        </div>
      `;
    }
  }
  
  function bindSearchIcon() {
    // Try multiple ways to find search icon/input
    const searchSVG = Array.from(document.querySelectorAll('svg')).find(svg => {
      const path = svg.querySelector('path[d*="15.0918"]');
      const circle = svg.querySelector('circle[cx="10.5"][cy="10.5"]');
      return path && circle;
    });
    
    // Also try to find search input directly
    const searchInput = document.getElementById('search-field-input') ||
                       document.querySelector('.MuiAutocomplete-input') ||
                       document.querySelector('[role="combobox"]') ||
                       document.querySelector('input[placeholder*="Suche"]');
    
    if (searchSVG) {
      let clickTarget = searchSVG.parentElement;
      if (clickTarget && !clickTarget.dataset.searchBound) {
        clickTarget.dataset.searchBound = '1';
        clickTarget.style.cursor = 'pointer';
        clickTarget.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openSearch();
        });
      }
    }
    
    if (searchInput && !searchInput.dataset.searchBound) {
      searchInput.dataset.searchBound = '1';
      searchInput.addEventListener('focus', (e) => {
        e.preventDefault();
        openSearch();
      });
    }
    
    if (!searchSVG && !searchInput) {
      setTimeout(bindSearchIcon, 500);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSearchIcon);
  } else {
    bindSearchIcon();
  }
})();