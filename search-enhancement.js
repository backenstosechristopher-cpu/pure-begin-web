// Enhanced search functionality for existing guthaben.de search input with ID 'search-field-input'
console.debug('[search-enhancement] loaded');
document.addEventListener('DOMContentLoaded', function() {
    // Product database from guthaben.de
    const productDatabase = {
        // Mobile Top-ups
        'telekom': { brand: 'Deutsche Telekom', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'vodafone': { brand: 'Vodafone', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'o2': { brand: 'O2', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'lebara': { brand: 'Lebara', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '30€', '40€', '50€'] },
        'lycamobile': { brand: 'Lycamobile', category: 'Mobile Top-up', prices: ['5€', '10€', '20€', '30€', '40€', '50€'] },
        'congstar': { brand: 'congstar', category: 'Mobile Top-up', prices: ['15€', '30€', '50€'] },
        'aldi-talk': { brand: 'ALDI TALK', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
        
        // Gift Cards
        'amazon': { brand: 'Amazon', category: 'Shopping Gift Cards', prices: ['10€', '15€', '25€', '40€', '50€', '75€', '100€', '150€', '200€', '250€'] },
        'apple': { brand: 'Apple', category: 'Tech Gift Cards', prices: ['15€', '25€', '50€', '100€'] },
        'google-play': { brand: 'Google Play', category: 'Digital Content', prices: ['15€', '25€', '50€', '100€'] },
        'h-m': { brand: 'H&M', category: 'Fashion Gift Cards', prices: ['15€', '25€', '50€', '75€', '100€', '125€', '150€'] },
        'zalando': { brand: 'Zalando', category: 'Fashion Gift Cards', prices: ['10€', '15€', '20€', '25€', '30€', '35€', '40€', '50€', '75€', '100€', '125€', '150€'] },
        'nike': { brand: 'Nike', category: 'Fashion Gift Cards', prices: ['15€', '20€', '25€', '40€', '50€', '75€', '100€', '125€', '150€'] },
        'ikea': { brand: 'IKEA', category: 'Home & Living Gift Cards', prices: ['10€', '25€', '50€', '100€', '150€'] },
        
        // Gaming
        'steam': { brand: 'Steam', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '35€', '50€', '100€'] },
        'xbox': { brand: 'Xbox', category: 'Gaming Cards', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€', '75€', '80€', '100€'] },
        'playstation': { brand: 'PlayStation', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '30€', '40€', '50€', '60€', '75€', '80€', '100€', '120€', '150€', '200€', '250€'] },
        'nintendo': { brand: 'Nintendo', category: 'Gaming Cards', prices: ['15€', '25€', '50€', '75€', '100€'] },
        'roblox': { brand: 'Roblox', category: 'Gaming Cards', prices: ['10€', '20€', '30€', '40€', '50€', '70€', '80€', '100€', '125€', '150€', '175€', '200€'] },
        
        // Entertainment
        'netflix': { brand: 'Netflix', category: 'Streaming Gift Cards', prices: ['25€', '50€', '75€', '100€', '125€', '150€'] },
        'spotify': { brand: 'Spotify', category: 'Music Streaming', prices: ['10€', '30€', '60€', '120€'] },
        
        // Payment Cards
        'paysafecard': { brand: 'paysafecard', category: 'Prepaid Payment Cards', prices: ['10€', '25€', '50€', '100€'] }
    };

    // Generate product list
    function generateProducts() {
        const products = [];
        Object.entries(productDatabase).forEach(([key, data]) => {
            data.prices.forEach(price => {
                products.push({
                    id: `${key}-${price.replace('€', 'eur').replace('.', '-')}`,
                    brand: data.brand,
                    category: data.category,
                    price: price,
                    title: `${data.brand} ${price} Guthaben`,
                    slug: key
                });
            });
        });
        return products;
    }

    // Search products
    function searchProducts(query, products) {
        if (!query.trim()) return [];
        
        const searchTerm = query.toLowerCase().trim();
        
        return products.filter(product => 
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.title.toLowerCase().includes(searchTerm) ||
            product.price.includes(searchTerm) ||
            (product.slug && product.slug.includes(searchTerm))
        ).slice(0, 10); // Limit to 10 results
    }

    // Find the existing search input (may be injected later by the app)
    let searchInput = document.getElementById('search-field-input') || null;

    // Robust getters for input and wrapper (desktop/mobile)
    function getInputEl() {
        return (
            document.getElementById('search-field-input') ||
            document.querySelector('input[placeholder*="Suche" i]') ||
            document.querySelector('input[role="combobox"][aria-autocomplete="list"]') ||
            document.querySelector('input.MuiAutocomplete-input') ||
            null
        );
    }
    function getWrapperEl(inputEl) {
        const el = inputEl || getInputEl();
        if (!el) return null;
        return el.closest('[class*="MuiInputBase-root"], [class*="MuiAutocomplete-root"], .search, header, form') || el.parentElement;
    }

    const allProducts = generateProducts();
    let resultsContainer = null;
    let overlay = null; // scrim capturing outside clicks
    let spotlight = null; // visual black fill with hole around input
    let isOpen = false;

    // Create results container
    function createResultsContainer() {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results-dropdown';
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e1e7eb;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            z-index: 10002;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            margin-top: 8px;
        `;

        // Find the parent container of the search input
        const searchContainer = getWrapperEl();
        if (searchContainer) {
            // Make sure parent has relative positioning
            const parentContainer = searchContainer.parentElement;
            if (parentContainer) {
                parentContainer.style.position = 'relative';
                parentContainer.appendChild(resultsContainer);
            }
        }
    }

    // Create overlay (scrim)
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'search-overlay-scrim';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: transparent;
            z-index: 9999;
            display: none;
            pointer-events: auto;
        `;
        overlay.addEventListener('click', function() {
            hideResults();
            hideOverlay();
            const inputEl = document.getElementById('search-field-input');
            if (inputEl) inputEl.blur();
        });
        document.body.appendChild(overlay);
    }

    // Create spotlight (visual black fill with hole around input)
    function createSpotlight() {
        spotlight = document.createElement('div');
        spotlight.id = 'search-spotlight-hole';
        spotlight.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 0; height: 0;
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);
            border-radius: 12px;
            z-index: 10000; /* above scrim, below dropdown */
            pointer-events: none; /* allow interactions with input */
            display: none;
        `;
        document.body.appendChild(spotlight);
    }

    let repositionSpotlightHandler = null;
    function positionSpotlight() {
        const inputEl = document.getElementById('search-field-input');
        const wrapper = inputEl ? (inputEl.closest('.MuiInputBase-root') || inputEl.parentElement) : null;
        if (!wrapper || !spotlight) return;
        const rect = wrapper.getBoundingClientRect();
        spotlight.style.top = `${Math.max(rect.top, 0)}px`;
        spotlight.style.left = `${Math.max(rect.left, 0)}px`;
        spotlight.style.width = `${rect.width}px`;
        spotlight.style.height = `${rect.height}px`;
        spotlight.style.display = 'block';
    }

    // Show overlay (scrim + spotlight)
    function showOverlay() {
        if (!overlay) createOverlay();
        if (!spotlight) createSpotlight();
        overlay.style.display = 'block';
        positionSpotlight();
        // keep spotlight aligned on scroll/resize while active
        if (!repositionSpotlightHandler) {
            repositionSpotlightHandler = () => positionSpotlight();
            window.addEventListener('resize', repositionSpotlightHandler, true);
            window.addEventListener('scroll', repositionSpotlightHandler, true);
        }
        try { console.debug('[search] overlay shown'); } catch (_) {}
    }

    // Hide overlay
    function hideOverlay() {
        if (overlay) overlay.style.display = 'none';
        if (spotlight) spotlight.style.display = 'none';
        if (repositionSpotlightHandler) {
            window.removeEventListener('resize', repositionSpotlightHandler, true);
            window.removeEventListener('scroll', repositionSpotlightHandler, true);
            repositionSpotlightHandler = null;
        }
        try { console.debug('[search] overlay hidden'); } catch (_) {}
    }

    // Show results
    function showResults(results) {
        if (!resultsContainer) createResultsContainer();
        showOverlay();
        
        // Create header section
        const headerHtml = `
            <div style="padding: 16px 16px 8px 16px; border-bottom: 1px solid #f0f0f0;">
                <div style="font-weight: 600; font-size: 14px; color: #666; margin-bottom: 12px;">
                    Am beliebtesten
                </div>
            </div>
        `;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = headerHtml + `
                <div style="padding: 16px; text-align: center; color: #666; font-size: 14px;">
                    Keine Produkte gefunden
                </div>
            `;
        } else {
            const popularItems = [
                { brand: 'PaysafeCard', category: 'Popular products', color: '#0066cc', icon: '💳' },
                { brand: 'Google Play', category: 'Gamecards', color: '#4285f4', icon: '🎮' },
                { brand: 'Apple', category: 'Entertainment cards', color: '#000000', icon: '🍎' },
                { brand: 'Amazon', category: 'Shopping cards', color: '#ff9900', icon: '📦' },
                { brand: 'Steam', category: 'Gaming cards', color: '#171a21', icon: '🎯' }
            ];

            const itemsHtml = popularItems.slice(0, 5).map(item => `
                <div class="search-result-item" 
                     style="padding: 12px 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: space-between;"
                     data-slug="${item.brand.toLowerCase().replace(/\s+/g, '-')}"
                     onmouseover="this.style.backgroundColor='#f8f9fa'"
                     onmouseout="this.style.backgroundColor='transparent'">
                    <div style="display: flex; align-items: center; flex: 1;">
                        <div style="width: 40px; height: 40px; background: ${item.color}; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 18px;">
                            ${item.icon}
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 16px; color: #1a1a1a; margin-bottom: 2px;">
                                ${item.brand}
                            </div>
                            <div style="font-size: 14px; color: #666;">
                                ${item.category}
                            </div>
                        </div>
                    </div>
                    <div style="color: #ccc; font-size: 18px;">
                        ›
                    </div>
                </div>
            `).join('');
            
            resultsContainer.innerHTML = headerHtml + itemsHtml;

            // Add click handlers
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const slug = this.dataset.slug;
                    if (slug) {
                        // Navigate to product page
                        window.location.href = `/desktop/guthaben.de_${slug}.html`;
                    }
                });
            });
        }

        resultsContainer.style.display = 'block';
        isOpen = true;
    }

    // Hide results
    function hideResults() {
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        isOpen = false;
    }

    // Handle search input (delegated)
    let searchTimeout;
    document.addEventListener('input', function(e) {
        const target = e.target;
        if (!(target && target.id === 'search-field-input')) return;
        searchInput = target;
        const query = target.value;

        clearTimeout(searchTimeout);
        showOverlay();

        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                const results = searchProducts(query, allProducts);
                showResults(results);
            }, 300);
        } else {
            // Show popular items when query is short
            showResults([]);
        }
    });

    // Handle focus (delegated)
    document.addEventListener('focusin', function(e) {
        const target = e.target;
        if (!(target && target.id === 'search-field-input')) return;
        searchInput = target;
        showOverlay();
        
        // Show popular items immediately on focus
        showResults([]);
        
        const query = target.value || '';
        if (query.length >= 2) {
            const results = searchProducts(query, allProducts);
            showResults(results);
        } else {
            isOpen = true;
        }
    });

    // Handle click
    searchInput.addEventListener('click', function() {
        showOverlay();
        isOpen = true;
    });

    // Also show overlay when clicking anywhere on the wrapper (icon, field, etc.)
    document.addEventListener('click', function(e) {
        const inputEl = document.getElementById('search-field-input');
        const wrapper = inputEl ? (inputEl.closest('.MuiInputBase-root') || inputEl.parentElement) : null;
        if (wrapper && wrapper.contains(e.target)) {
            showOverlay();
            isOpen = true;
        }
    });

    // Global focus within search wrapper
    document.addEventListener('focusin', function(e) {
        const inputEl = getInputEl();
        const wrapper = getWrapperEl(inputEl);
        if (e.target === inputEl || (wrapper && wrapper.contains(e.target))) {
            showOverlay();
        }
    });

    document.addEventListener('focusout', function() {
        setTimeout(() => {
            const active = document.activeElement;
            const inputEl = getInputEl();
            const wrapper = getWrapperEl(inputEl);
            const stillInside = (active === inputEl) || (wrapper && wrapper.contains(active)) || (resultsContainer && resultsContainer.contains(active));
            if (!stillInside) {
                hideResults();
                hideOverlay();
            }
        }, 100);
    });

    // Removed direct blur handler; using global focusout above for robustness


    // Handle clicks outside
    document.addEventListener('click', function(e) {
        const inputEl = getInputEl();
        const wrapper = getWrapperEl(inputEl);
        const inside = (inputEl && inputEl.contains(e.target)) || (wrapper && wrapper.contains(e.target)) || (resultsContainer && resultsContainer.contains(e.target));
        if (!inside) {
            hideResults();
            hideOverlay();
        }
    });

    // Show overlay early on pointer down inside wrapper (before focus)
    document.addEventListener('mousedown', function(e) {
        const wrapper = getWrapperEl();
        if (wrapper && wrapper.contains(e.target)) {
            showOverlay();
            isOpen = true;
        }
    });

    // Handle keyboard navigation
    let highlightedIndex = -1;
    document.addEventListener('keydown', function(e) {
        const active = document.activeElement;
        const isSearch = !!active && (
            active.id === 'search-field-input' ||
            (active.matches && active.matches('input[placeholder*="Suche" i], input[role="combobox"][aria-autocomplete="list"], input.MuiAutocomplete-input'))
        );
        if (!isSearch) return;
        if (!isOpen) return;

        const items = resultsContainer ? resultsContainer.querySelectorAll('.search-result-item') : [];
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                highlightedIndex = highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0;
                updateHighlight(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                highlightedIndex = highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1;
                updateHighlight(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && items[highlightedIndex]) {
                    items[highlightedIndex].click();
                }
                break;
            case 'Escape':
                hideResults();
                hideOverlay();
                if (active && typeof active.blur === 'function') active.blur();
                break;
        }
    });

    function updateHighlight(items) {
        items.forEach((item, index) => {
            if (index === highlightedIndex) {
                item.style.backgroundColor = '#e3f2fd';
            } else {
                item.style.backgroundColor = 'transparent';
            }
        });
    }
});