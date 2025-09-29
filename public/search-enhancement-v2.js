// Modern Search Enhancement v2.0 - Complete Redesign
console.log('[SEARCH v2] Modern search enhancement loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced product database with better categorization
    const productDatabase = {
        // Mobile Networks
        'telekom': { 
            brand: 'Deutsche Telekom', 
            category: 'Mobile Top-up', 
            prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'],
            color: '#E20074',
            icon: '📱'
        },
        'vodafone': { 
            brand: 'Vodafone', 
            category: 'Mobile Top-up', 
            prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'],
            color: '#E60000',
            icon: '📱'
        },
        'o2': { 
            brand: 'O2', 
            category: 'Mobile Top-up', 
            prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'],
            color: '#0066CC',
            icon: '📱'
        },
        'lebara': { 
            brand: 'Lebara', 
            category: 'Mobile Top-up', 
            prices: ['5€', '10€', '15€', '20€', '30€', '40€', '50€'],
            color: '#00B4D8',
            icon: '📱'
        },
        'lycamobile': { 
            brand: 'Lycamobile', 
            category: 'Mobile Top-up', 
            prices: ['5€', '10€', '20€', '30€', '40€', '50€'],
            color: '#00A651',
            icon: '📱'
        },
        'congstar': { 
            brand: 'congstar', 
            category: 'Mobile Top-up', 
            prices: ['15€', '30€', '50€'],
            color: '#000000',
            icon: '📱'
        },
        'aldi-talk': { 
            brand: 'ALDI TALK', 
            category: 'Mobile Top-up', 
            prices: ['15€', '20€', '30€'],
            color: '#1F6DB6',
            icon: '📱'
        },

        // Gaming Platforms
        'steam': { 
            brand: 'Steam', 
            category: 'Gaming Cards', 
            prices: ['5€', '10€', '20€', '25€', '35€', '50€', '100€'],
            color: '#1B2838',
            icon: '🎮'
        },
        'xbox': { 
            brand: 'Xbox', 
            category: 'Gaming Cards', 
            prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€', '75€', '80€', '100€'],
            color: '#107C10',
            icon: '🎮'
        },
        'playstation': { 
            brand: 'PlayStation', 
            category: 'Gaming Cards', 
            prices: ['5€', '10€', '20€', '25€', '30€', '40€', '50€', '60€', '75€', '80€', '100€'],
            color: '#003087',
            icon: '🎮'
        },
        'nintendo': { 
            brand: 'Nintendo', 
            category: 'Gaming Cards', 
            prices: ['15€', '25€', '50€', '75€', '100€'],
            color: '#E60012',
            icon: '🎮'
        },
        'roblox': { 
            brand: 'Roblox', 
            category: 'Gaming Cards', 
            prices: ['10€', '20€', '30€', '40€', '50€', '70€', '80€', '100€'],
            color: '#00B2FF',
            icon: '🎮'
        },

        // Shopping & Gift Cards
        'amazon': { 
            brand: 'Amazon', 
            category: 'Shopping Gift Cards', 
            prices: ['10€', '15€', '25€', '40€', '50€', '75€', '100€', '150€', '200€', '250€'],
            color: '#FF9900',
            icon: '🛒'
        },
        'apple': { 
            brand: 'Apple', 
            category: 'Tech Gift Cards', 
            prices: ['15€', '25€', '50€', '100€'],
            color: '#007AFF',
            icon: '🍎'
        },
        'google-play': { 
            brand: 'Google Play', 
            category: 'Digital Content', 
            prices: ['15€', '25€', '50€', '100€'],
            color: '#4285F4',
            icon: '📱'
        },
        'zalando': { 
            brand: 'Zalando', 
            category: 'Fashion Gift Cards', 
            prices: ['10€', '15€', '20€', '25€', '30€', '35€', '40€', '50€', '75€', '100€'],
            color: '#FF6900',
            icon: '👕'
        },
        'h-m': { 
            brand: 'H&M', 
            category: 'Fashion Gift Cards', 
            prices: ['15€', '25€', '50€', '75€', '100€', '125€', '150€'],
            color: '#E50010',
            icon: '👕'
        },
        'nike': { 
            brand: 'Nike', 
            category: 'Sports Gift Cards', 
            prices: ['15€', '20€', '25€', '40€', '50€', '75€', '100€'],
            color: '#111111',
            icon: '👟'
        },
        'ikea': { 
            brand: 'IKEA', 
            category: 'Home & Living', 
            prices: ['10€', '25€', '50€', '100€', '150€'],
            color: '#0058A3',
            icon: '🏠'
        },

        // Entertainment & Streaming
        'netflix': { 
            brand: 'Netflix', 
            category: 'Streaming Services', 
            prices: ['25€', '50€', '75€', '100€', '125€', '150€'],
            color: '#E50914',
            icon: '📺'
        },
        'spotify': { 
            brand: 'Spotify', 
            category: 'Music Streaming', 
            prices: ['10€', '30€', '60€', '120€'],
            color: '#1DB954',
            icon: '🎵'
        },
        'disney-plus': { 
            brand: 'Disney+', 
            category: 'Streaming Services', 
            prices: ['27€', '54€', '90€'],
            color: '#113CCF',
            icon: '📺'
        },

        // Payment Cards
        'paysafecard': { 
            brand: 'paysafecard', 
            category: 'Payment Cards', 
            prices: ['10€', '25€', '50€', '100€'],
            color: '#0070BA',
            icon: '💳'
        },
        'cashlib': { 
            brand: 'Cashlib', 
            category: 'Payment Cards', 
            prices: ['5€', '10€', '20€', '50€', '100€', '150€'],
            color: '#1E40AF',
            icon: '💳'
        }
    };

    // Generate searchable products
    function generateProducts() {
        const products = [];
        Object.entries(productDatabase).forEach(([slug, data]) => {
            data.prices.forEach(price => {
                products.push({
                    id: `${slug}-${price.replace('€', '')}`,
                    slug: slug,
                    brand: data.brand,
                    category: data.category,
                    price: price,
                    color: data.color,
                    icon: data.icon,
                    title: `${data.brand} ${price}`,
                    searchTerms: `${data.brand.toLowerCase()} ${data.category.toLowerCase()} ${price} ${slug}`
                });
            });
        });
        return products;
    }

    // Search function with enhanced matching
    function searchProducts(query, products) {
        if (!query.trim()) return [];
        
        const searchTerm = query.toLowerCase().trim();
        const results = products.filter(product => 
            product.searchTerms.includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        // Sort by relevance (exact brand matches first)
        return results.sort((a, b) => {
            const aExact = a.brand.toLowerCase().startsWith(searchTerm);
            const bExact = b.brand.toLowerCase().startsWith(searchTerm);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return 0;
        }).slice(0, 8);
    }

    // Enhanced search input detection
    function getSearchInput() {
        return document.getElementById('search-field-input') ||
               document.querySelector('input[placeholder*="Suche" i]') ||
               document.querySelector('input[role="combobox"]') ||
               document.querySelector('input.MuiAutocomplete-input');
    }

    function getSearchWrapper(input) {
        if (!input) return null;
        return input.closest('.MuiInputBase-root') ||
               input.closest('.MuiAutocomplete-root') ||
               input.closest('[class*="search"]') ||
               input.parentElement;
    }

    // Modern search overlay styles
    function createSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'modern-search-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            z-index: 50000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // Modern search results container
    function createSearchResults() {
        const container = document.createElement('div');
        container.id = 'modern-search-results';
        container.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 50001;
            max-height: 500px;
            overflow: hidden;
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(20px);
        `;
        document.body.appendChild(container);
        return container;
    }

    // Enhanced search input styling
    function enhanceSearchInput(input) {
        if (!input) return;
        
        input.style.cssText += `
            background: rgba(255, 255, 255, 0.95) !important;
            border: 2px solid rgba(79, 70, 229, 0.1) !important;
            border-radius: 16px !important;
            padding: 16px 24px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        `;

        // Enhanced focus styles
        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgba(79, 70, 229, 0.5) !important';
            input.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important';
            input.style.transform = 'translateY(-2px) !important';
        });

        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.querySelector('#modern-search-results:hover')) {
                    input.style.borderColor = 'rgba(79, 70, 229, 0.1) !important';
                    input.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1) !important';
                    input.style.transform = 'translateY(0) !important';
                }
            }, 150);
        });

        // Style the wrapper
        const wrapper = getSearchWrapper(input);
        if (wrapper) {
            wrapper.style.cssText += `
                background: transparent !important;
                border-radius: 16px !important;
                overflow: visible !important;
                padding: 0 !important;
            `;
        }
    }

    // Create popular products section
    function createPopularSection() {
        const popular = [
            { slug: 'amazon', brand: 'Amazon', category: 'Shopping', price: '25€', color: '#FF9900', icon: '🛒' },
            { slug: 'google-play', brand: 'Google Play', category: 'Digital', price: '25€', color: '#4285F4', icon: '📱' },
            { slug: 'steam', brand: 'Steam', category: 'Gaming', price: '20€', color: '#1B2838', icon: '🎮' },
            { slug: 'netflix', brand: 'Netflix', category: 'Streaming', price: '25€', color: '#E50914', icon: '📺' },
            { slug: 'spotify', brand: 'Spotify', category: 'Music', price: '30€', color: '#1DB954', icon: '🎵' },
            { slug: 'paysafecard', brand: 'paysafecard', category: 'Payment', price: '25€', color: '#0070BA', icon: '💳' }
        ];

        return `
            <div style="padding: 24px; border-bottom: 1px solid rgba(229, 231, 235, 0.5);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="font-size: 20px;">⭐</div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1f2937; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        Beliebte Produkte
                    </h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
                    ${popular.map(item => `
                        <div class="search-item" data-slug="${item.slug}" style="
                            display: flex; 
                            align-items: center; 
                            gap: 16px; 
                            padding: 16px; 
                            border-radius: 12px; 
                            background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%);
                            border: 1px solid rgba(229, 231, 235, 0.3);
                            cursor: pointer; 
                            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="
                                width: 48px; 
                                height: 48px; 
                                background: linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%);
                                border-radius: 12px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;
                                font-size: 24px;
                                border: 2px solid ${item.color}20;
                            ">
                                ${item.icon}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 16px; color: #111827; margin-bottom: 4px;">
                                    ${item.brand}
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 14px; color: #6b7280;">${item.category}</span>
                                    <span style="
                                        background: linear-gradient(135deg, ${item.color} 0%, ${item.color}80 100%);
                                        color: white;
                                        padding: 2px 8px;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        font-weight: 600;
                                    ">${item.price}</span>
                                </div>
                            </div>
                            <div style="color: #9ca3af; font-size: 20px; transform: translateX(0); transition: transform 0.2s;">
                                →
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Create search results section
    function createResultsSection(results) {
        if (results.length === 0) return '';

        return `
            <div style="padding: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <div style="font-size: 20px;">🔍</div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1f2937;">
                        Suchergebnisse (${results.length})
                    </h3>
                </div>
                <div style="display: grid; gap: 8px;">
                    ${results.map(product => `
                        <div class="search-item" data-slug="${product.slug}" style="
                            display: flex; 
                            align-items: center; 
                            gap: 16px; 
                            padding: 16px; 
                            border-radius: 12px; 
                            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%);
                            border: 1px solid rgba(229, 231, 235, 0.3);
                            cursor: pointer; 
                            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        ">
                            <div style="
                                width: 40px; 
                                height: 40px; 
                                background: linear-gradient(135deg, ${product.color}15 0%, ${product.color}25 100%);
                                border-radius: 10px; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;
                                font-size: 20px;
                                border: 2px solid ${product.color}20;
                            ">
                                ${product.icon}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 16px; color: #111827; margin-bottom: 4px;">
                                    ${product.brand}
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 14px; color: #6b7280;">${product.category}</span>
                                    <span style="
                                        background: linear-gradient(135deg, ${product.color} 0%, ${product.color}80 100%);
                                        color: white;
                                        padding: 2px 8px;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        font-weight: 600;
                                    ">${product.price}</span>
                                </div>
                            </div>
                            <div style="color: #9ca3af; font-size: 18px; transform: translateX(0); transition: transform 0.2s;">
                                →
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Position search results
    function positionSearchResults(input, container) {
        if (!input || !container) return;
        
        const wrapper = getSearchWrapper(input) || input;
        const rect = wrapper.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate optimal position
        let left = rect.left;
        let top = rect.bottom + 12;
        let width = Math.max(rect.width, 600);
        
        // Adjust for mobile
        if (windowWidth < 768) {
            left = 16;
            width = windowWidth - 32;
        } else {
            // Center if too wide
            if (left + width > windowWidth - 20) {
                left = Math.max(20, (windowWidth - width) / 2);
            }
        }
        
        // Adjust if too close to bottom
        if (top + 400 > windowHeight) {
            top = Math.max(20, rect.top - 400 - 12);
        }
        
        container.style.left = left + 'px';
        container.style.top = top + 'px';
        container.style.width = width + 'px';
    }

    // Show search results with animation
    function showSearchResults(content, input, overlay, container) {
        container.innerHTML = content;
        positionSearchResults(input, container);
        
        // Add hover effects
        container.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-2px)';
                item.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                item.style.background = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)';
                const arrow = item.querySelector('div:last-child');
                if (arrow) arrow.style.transform = 'translateX(4px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = 'none';
                item.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)';
                const arrow = item.querySelector('div:last-child');
                if (arrow) arrow.style.transform = 'translateX(0)';
            });
            
            item.addEventListener('click', () => {
                const slug = item.dataset.slug;
                if (slug) {
                    hideSearchResults(overlay, container);
                    window.location.href = `guthaben.de_${slug}.html`;
                }
            });
        });
        
        // Show with animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            container.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Hide search results
    function hideSearchResults(overlay, container) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        container.style.opacity = '0';
        container.style.visibility = 'hidden';
        container.style.transform = 'translateY(-20px) scale(0.95)';
    }

    // Initialize search functionality
    function initializeSearch() {
        const products = generateProducts();
        const overlay = createSearchOverlay();
        const resultsContainer = createSearchResults();
        let searchTimeout;

        // Handle search input
        document.addEventListener('input', (e) => {
            const input = getSearchInput();
            if (!input || e.target !== input) return;
            
            const query = input.value.trim();
            clearTimeout(searchTimeout);
            
            if (query.length >= 1) {
                searchTimeout = setTimeout(() => {
                    const results = searchProducts(query, products);
                    const content = results.length > 0 ? createResultsSection(results) : createPopularSection();
                    showSearchResults(content, input, overlay, resultsContainer);
                }, 200);
            } else {
                const content = createPopularSection();
                showSearchResults(content, input, overlay, resultsContainer);
            }
        });

        // Handle focus
        document.addEventListener('focusin', (e) => {
            const input = getSearchInput();
            if (!input || e.target !== input) return;
            
            const query = input.value.trim();
            const results = query.length >= 1 ? searchProducts(query, products) : [];
            const content = results.length > 0 ? createResultsSection(results) : createPopularSection();
            showSearchResults(content, input, overlay, resultsContainer);
        });

        // Handle clicks outside
        overlay.addEventListener('click', () => {
            hideSearchResults(overlay, resultsContainer);
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSearchResults(overlay, resultsContainer);
                const input = getSearchInput();
                if (input) input.blur();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const input = getSearchInput();
            if (input && resultsContainer.style.visibility === 'visible') {
                positionSearchResults(input, resultsContainer);
            }
        });

        // Apply enhanced styling to search input
        const observer = new MutationObserver(() => {
            const input = getSearchInput();
            if (input && !input.dataset.enhanced) {
                enhanceSearchInput(input);
                input.dataset.enhanced = 'true';
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial enhancement
        const input = getSearchInput();
        if (input) {
            enhanceSearchInput(input);
            input.dataset.enhanced = 'true';
        }
    }

    // Start the search enhancement
    initializeSearch();
    
    console.log('[SEARCH v2] Modern search ready');
});