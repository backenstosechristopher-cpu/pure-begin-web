// Enhanced search functionality for existing guthaben.de search input with ID 'search-field-input'
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

    // Find the existing search input
    const searchInput = document.getElementById('search-field-input');
    if (!searchInput) {
        console.warn('Search input not found');
        return;
    }

    const allProducts = generateProducts();
    let resultsContainer = null;
    let overlay = null;
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
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483647;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            margin-top: 4px;
        `;

        // Find the parent container of the search input
        const searchContainer = searchInput.closest('.MuiInputBase-root') || searchInput.parentElement;
        if (searchContainer) {
            // Make sure parent has relative positioning
            const parentContainer = searchContainer.parentElement;
            if (parentContainer) {
                parentContainer.style.position = 'relative';
                parentContainer.appendChild(resultsContainer);
            }
        }
    }

    // Create overlay
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2147483646;
            display: none;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
    }

    // Show overlay
    function showOverlay() {
        if (!overlay) createOverlay();
        overlay.style.display = 'block';
    }

    // Hide overlay
    function hideOverlay() {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Show results
    function showResults(results) {
        if (!resultsContainer) createResultsContainer();
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: #666; font-size: 14px;">
                    Keine Produkte gefunden
                </div>
            `;
        } else {
            const html = results.map(product => `
                <div class="search-result-item" 
                     style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s;"
                     data-slug="${product.slug}"
                     onmouseover="this.style.backgroundColor='#f5f5f5'"
                     onmouseout="this.style.backgroundColor='transparent'">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 14px; color: #032e33; margin-bottom: 4px;">
                                ${product.brand}
                            </div>
                            <div style="font-size: 12px; color: #666;">
                                ${product.category}
                            </div>
                        </div>
                        <div style="text-align: right; margin-left: 12px;">
                            <div style="font-weight: 600; color: #ffa81e; font-size: 14px;">
                                ${product.price}
                            </div>
                            <div style="font-size: 11px; color: #4caf50; margin-top: 2px;">
                                Verfügbar
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            resultsContainer.innerHTML = html;

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

    // Handle search input
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        clearTimeout(searchTimeout);
        
        showOverlay();
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                const results = searchProducts(query, allProducts);
                showResults(results);
            }, 300);
        } else {
            hideResults();
        }
    });

    // Handle focus
    searchInput.addEventListener('focus', function() {
        showOverlay();
        const query = this.value;
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

    // Handle blur
    searchInput.addEventListener('blur', function(e) {
        // Small delay to allow clicking on results
        setTimeout(() => {
            if (!searchInput.matches(':focus') && (!resultsContainer || !resultsContainer.matches(':hover'))) {
                hideResults();
                hideOverlay();
            }
        }, 150);
    });

    // Handle clicks outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && (!resultsContainer || !resultsContainer.contains(e.target))) {
            hideResults();
            hideOverlay();
        }
    });

    // Handle keyboard navigation
    let highlightedIndex = -1;
    searchInput.addEventListener('keydown', function(e) {
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
                searchInput.blur();
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