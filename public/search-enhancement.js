(function() {
  if (window.__SEARCH_ENHANCED__) return;
  window.__SEARCH_ENHANCED__ = true;

  function enhanceSearch() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="Suche"], input[placeholder*="Search"]');
    if (!searchInput) return;

    const container = searchInput.closest('div, form') || searchInput.parentElement;
    if (!container) return;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'search-wrapper-enhanced';
    wrapper.innerHTML = `
      <div class="search-container-enhanced">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input type="search" placeholder="Suche..." class="search-input-enhanced" />
        <button type="button" class="search-clear" aria-label="Clear search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .search-wrapper-enhanced {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .search-container-enhanced {
        position: relative;
        display: flex;
        align-items: center;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px 16px;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      
      .search-container-enhanced:hover {
        border-color: #d1d5db;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      }
      
      .search-container-enhanced:focus-within {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      .search-icon {
        color: #9ca3af;
        flex-shrink: 0;
        margin-right: 12px;
        transition: color 0.2s ease;
      }
      
      .search-container-enhanced:focus-within .search-icon {
        color: #3b82f6;
      }
      
      .search-input-enhanced {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        color: #1f2937;
        background: transparent;
        padding: 0;
      }
      
      .search-input-enhanced::placeholder {
        color: #9ca3af;
      }
      
      .search-clear {
        display: none;
        align-items: center;
        justify-content: center;
        background: #f3f4f6;
        border: none;
        border-radius: 6px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: 8px;
        flex-shrink: 0;
        color: #6b7280;
      }
      
      .search-clear:hover {
        background: #e5e7eb;
        color: #374151;
      }
      
      .search-clear.visible {
        display: flex;
      }
      
      @media (max-width: 640px) {
        .search-container-enhanced {
          padding: 10px 14px;
        }
        
        .search-input-enhanced {
          font-size: 14px;
        }
      }
    `;

    if (!document.querySelector('style[data-search-enhanced]')) {
      style.setAttribute('data-search-enhanced', 'true');
      document.head.appendChild(style);
    }

    // Replace old input with new enhanced version
    const newInput = wrapper.querySelector('.search-input-enhanced');
    const clearBtn = wrapper.querySelector('.search-clear');
    
    newInput.value = searchInput.value;
    newInput.placeholder = searchInput.placeholder || 'Suche...';
    
    // Copy attributes
    ['name', 'id', 'autocomplete', 'required'].forEach(attr => {
      if (searchInput.hasAttribute(attr)) {
        newInput.setAttribute(attr, searchInput.getAttribute(attr));
      }
    });

    // Handle input events
    newInput.addEventListener('input', function(e) {
      if (e.target.value) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
    });

    // Handle clear button
    clearBtn.addEventListener('click', function() {
      newInput.value = '';
      clearBtn.classList.remove('visible');
      newInput.focus();
    });

    // Replace in DOM
    container.replaceChild(wrapper, searchInput);
    
    if (newInput.value) {
      clearBtn.classList.add('visible');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceSearch);
  } else {
    enhanceSearch();
  }
})();
