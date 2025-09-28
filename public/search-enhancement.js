// Enhanced search functionality for existing guthaben.de search input with ID 'search-field-input'
console.debug('[search-enhancement] loaded');

// Function to apply modern search input styling
function applyInputStyling() {
    const inputEl = document.getElementById('search-field-input');
    if (inputEl) {
        inputEl.style.cssText += `
            padding: 18px 24px !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            min-height: 56px !important;
            border-radius: 16px !important;
            border: 2px solid #e5e7eb !important;
            background: #ffffff !important;
            color: #1f2937 !important;
            box-sizing: border-box !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        `;
        
        // Enhanced focus states
        inputEl.addEventListener('focus', function() {
            this.style.borderColor = '#3b82f6 !important';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1) !important';
        });
        
        inputEl.addEventListener('blur', function() {
            this.style.borderColor = '#e5e7eb !important';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1) !important';
        });
        
        // Style the wrapper
        const wrapper = inputEl.closest('.MuiInputBase-root');
        if (wrapper) {
            wrapper.style.cssText += `
                padding: 0 !important;
                border-radius: 16px !important;
                background: transparent !important;
                overflow: visible !important;
            `;
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Apply input styling on load
    applyInputStyling();

    // Disable any search-related overlays globally (scrim/backdrop/spotlight)
    try {
        const style = document.createElement('style');
        style.id = 'disable-search-overlays';
        style.textContent = `
            #search-overlay-scrim,
            #search-spotlight-hole { display: none !important; }
            .MuiBackdrop-root,
            .MuiModal-backdrop,
            .mui-style-1jtyhdp { background-color: transparent !important; }
        `;
        document.head.appendChild(style);

        // Remove any leftover overlay elements if present
        const existingScrim = document.getElementById('search-overlay-scrim');
        const existingSpotlight = document.getElementById('search-spotlight-hole');
        if (existingScrim) existingScrim.remove();
        if (existingSpotlight) existingSpotlight.remove();
    } catch (_) {}
    
    // Reapply styling when input appears (for dynamic content)
    const observer = new MutationObserver((mutations) => {
        applyInputStyling();
        neutralizeBackdrops();
        
        // Log any new dark elements being added
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    const element = node;
                    const cs = window.getComputedStyle(element);
                    if (cs.position === 'fixed' && (cs.backgroundColor.includes('rgba(0, 0, 0') || cs.backgroundColor === 'black')) {
                        console.log('[DEBUG] New dark overlay detected:', {
                            element,
                            className: element.className,
                            backgroundColor: cs.backgroundColor,
                            zIndex: cs.zIndex
                        });
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Product database from guthaben.de - Complete catalog
    const productDatabase = {
        // Mobile Top-ups Germany
        'telekom': { brand: 'Deutsche Telekom', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'vodafone': { brand: 'Vodafone', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'o2': { brand: 'O2', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€'] },
        'lebara': { brand: 'Lebara', category: 'Mobile Top-up', prices: ['5€', '10€', '15€', '20€', '30€', '40€', '50€'] },
        'lycamobile': { brand: 'Lycamobile', category: 'Mobile Top-up', prices: ['5€', '10€', '20€', '30€', '40€', '50€'] },
        'congstar': { brand: 'congstar', category: 'Mobile Top-up', prices: ['15€', '30€', '50€'] },
        'aldi-talk': { brand: 'ALDI TALK', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
        'ay-yildiz': { brand: 'Ay Yıldız', category: 'Mobile Top-up', prices: ['15€', '20€'] },
        'blau-de': { brand: 'Blau.de', category: 'Mobile Top-up', prices: ['15€', '25€'] },
        'blauworld': { brand: 'Blauworld', category: 'Mobile Top-up', prices: ['15€'] },
        'bildmobil': { brand: 'Bildmobil', category: 'Mobile Top-up', prices: ['10€', '20€'] },
        'e-plus': { brand: 'E-Plus', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
        'fonic': { brand: 'Fonic', category: 'Mobile Top-up', prices: ['20€', '30€'] },
        'fyve': { brand: 'Fyve', category: 'Mobile Top-up', prices: ['15€', '25€'] },
        'einfach-prepaid': { brand: 'Einfach Prepaid', category: 'Mobile Top-up', prices: ['15€', '20€', '30€'] },
        'klarmobil': { brand: 'Klarmobil', category: 'Mobile Top-up', prices: ['15€', '30€', '50€'] },
        'gt-mobile': { brand: 'GT Mobile', category: 'Mobile Top-up', prices: ['5€', '40€'] },
        'ortel-mobile': { brand: 'Ortel Mobile', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'otelo': { brand: 'Otelo', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'simyo': { brand: 'Simyo', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'toneo-first': { brand: 'Toneo First', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'rossmann-mobil': { brand: 'Rossmann Mobil', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'nettokom': { brand: 'NettoKOM', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'netzclub': { brand: 'Netzclub', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'mobi': { brand: 'Mobi', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        'turk-telekom': { brand: 'Türk Telekom', category: 'Mobile Top-up', prices: ['15€', '30€'] },
        
        // Austrian Mobile
        'bob-wertkarte': { brand: 'BOB Wertkarte', category: 'Mobile Top-up Austria', prices: ['15€', '30€'] },
        'drei': { brand: 'Drei', category: 'Mobile Top-up Austria', prices: ['15€', '30€'] },
        'b-free': { brand: 'B-Free', category: 'Mobile Top-up Austria', prices: ['15€', '30€'] },
        'lycamobile-oesterreich': { brand: 'Lycamobile Österreich', category: 'Mobile Top-up Austria', prices: ['10€', '15€', '20€'] },
        'lifecell': { brand: 'LifeCell', category: 'Mobile Top-up Ukraine', prices: ['5€', '15€', '30€'] },
        
        // Gift Cards Germany
        'amazon': { brand: 'Amazon', category: 'Shopping Gift Cards', prices: ['10€', '15€', '25€', '40€', '50€', '75€', '100€', '150€', '200€', '250€'] },
        'apple': { brand: 'Apple', category: 'Tech Gift Cards', prices: ['15€', '25€', '50€', '100€'] },
        'google-play': { brand: 'Google Play', category: 'Digital Content', prices: ['15€', '25€', '50€', '100€'] },
        'h-m': { brand: 'H&M', category: 'Fashion Gift Cards', prices: ['15€', '25€', '50€', '75€', '100€', '125€', '150€'] },
        'zalando': { brand: 'Zalando', category: 'Fashion Gift Cards', prices: ['10€', '15€', '20€', '25€', '30€', '35€', '40€', '50€', '75€', '100€', '125€', '150€'] },
        'nike': { brand: 'Nike', category: 'Fashion Gift Cards', prices: ['15€', '20€', '25€', '40€', '50€', '75€', '100€', '125€', '150€'] },
        'ikea': { brand: 'IKEA', category: 'Home & Living Gift Cards', prices: ['10€', '25€', '50€', '100€', '150€'] },
        'douglas': { brand: 'Douglas', category: 'Beauty Gift Cards', prices: ['20€', '30€', '50€'] },
        'mediamarkt': { brand: 'MediaMarkt', category: 'Electronics Gift Cards', prices: ['10€', '50€', '100€'] },
        'saturn': { brand: 'Saturn', category: 'Electronics Gift Cards', prices: ['10€', '50€', '100€'] },
        'cyberport': { brand: 'Cyberport', category: 'Tech Gift Cards', prices: ['25€', '50€', '100€'] },
        'jochen-schweizer': { brand: 'Jochen Schweizer', category: 'Experience Gift Cards', prices: ['50€', '100€'] },
        'eventim': { brand: 'Eventim', category: 'Event Gift Cards', prices: ['25€'] },
        'lieferando': { brand: 'Lieferando', category: 'Food Delivery', prices: ['20€', '25€', '30€', '40€', '50€', '100€'] },
        'ca-geschenkkarte': { brand: 'C&A', category: 'Fashion Gift Cards', prices: ['25€', '50€', '100€'] },
        'adidas': { brand: 'Adidas', category: 'Sports Gift Cards', prices: ['25€', '50€', '100€'] },
        'lush': { brand: 'Lush', category: 'Beauty Gift Cards', prices: ['25€', '50€', '100€'] },
        'cineplex': { brand: 'Cineplex', category: 'Cinema Gift Cards', prices: ['10€', '15€', '20€', '25€'] },
        'tk-maxx': { brand: 'TK Maxx', category: 'Fashion Gift Cards', prices: ['25€', '50€', '100€'] },
        'rossmann': { brand: 'Rossmann', category: 'Beauty & Health', prices: ['10€', '25€', '50€'] },
        'tchibo': { brand: 'Tchibo', category: 'Lifestyle Gift Cards', prices: ['25€', '50€', '100€'] },
        'otto-gutscheincode': { brand: 'Otto', category: 'Shopping Gift Cards', prices: ['25€', '50€', '100€'] },
        'ticketmaster': { brand: 'Ticketmaster', category: 'Event Gift Cards', prices: ['25€', '50€', '100€'] },
        'treatwell': { brand: 'Treatwell', category: 'Beauty & Wellness', prices: ['25€', '50€', '100€'] },
        'uber': { brand: 'Uber', category: 'Transport Gift Cards', prices: ['15€', '25€', '50€'] },
        
        // Austrian Gift Cards
        'amazon-gutscheine-oesterreich': { brand: 'Amazon Österreich', category: 'Shopping Gift Cards Austria', prices: ['15€', '25€', '50€'] },
        'apple-gift-card-oesterreich': { brand: 'Apple Österreich', category: 'Tech Gift Cards Austria', prices: ['15€', '25€', '50€'] },
        'google-play-card-oesterreich': { brand: 'Google Play Österreich', category: 'Digital Content Austria', prices: ['15€', '25€', '50€'] },
        'h-m-geschenkcode-osterreich': { brand: 'H&M Österreich', category: 'Fashion Gift Cards Austria', prices: ['15€', '25€', '50€'] },
        'zalando-gutschein-oesterreich': { brand: 'Zalando Österreich', category: 'Fashion Gift Cards Austria', prices: ['15€', '25€', '50€'] },
        'lieferando-osterreich': { brand: 'Lieferando Österreich', category: 'Food Delivery Austria', prices: ['20€', '25€', '50€'] },
        'airbnb-osterreich': { brand: 'Airbnb Österreich', category: 'Travel Austria', prices: ['50€', '100€', '150€', '200€', '250€'] },
        'kobo-osterreich': { brand: 'Kobo Österreich', category: 'E-Books Austria', prices: ['15€', '25€', '50€'] },
        'mango-osterreich': { brand: 'Mango Österreich', category: 'Fashion Gift Cards Austria', prices: ['25€', '50€', '100€'] },
        'nike-osterreich': { brand: 'Nike Österreich', category: 'Sports Gift Cards Austria', prices: ['25€', '50€', '100€'] },
        'treatwell-osterreich': { brand: 'Treatwell Österreich', category: 'Beauty & Wellness Austria', prices: ['25€', '50€', '100€'] },
        
        // Gaming Germany
        'steam': { brand: 'Steam', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '35€', '50€', '100€'] },
        'xbox': { brand: 'Xbox', category: 'Gaming Cards', prices: ['5€', '10€', '15€', '20€', '25€', '30€', '50€', '75€', '80€', '100€'] },
        'playstation': { brand: 'PlayStation', category: 'Gaming Cards', prices: ['5€', '10€', '20€', '25€', '30€', '40€', '50€', '60€', '75€', '80€', '100€', '120€', '150€', '200€', '250€'] },
        'nintendo': { brand: 'Nintendo', category: 'Gaming Cards', prices: ['15€', '25€', '50€', '75€', '100€'] },
        'roblox': { brand: 'Roblox', category: 'Gaming Cards', prices: ['10€', '20€', '30€', '40€', '50€', '70€', '80€', '100€', '125€', '150€', '175€', '200€'] },
        'battlenet-guthabenkarte': { brand: 'Battle.net', category: 'Gaming Cards', prices: ['20€', '50€'] },
        'ea-game-card': { brand: 'EA Origin', category: 'Gaming Cards', prices: ['15€'] },
        'league-of-legends-riot-points': { brand: 'League of Legends', category: 'Gaming Cards', prices: ['10€', '20€'] },
        'hearthstone-guthabenkarte': { brand: 'Hearthstone', category: 'Gaming Cards', prices: ['15€', '25€', '40€'] },
        'meta-quest': { brand: 'Meta Quest', category: 'VR Gaming', prices: ['15€', '100€'] },
        'fortnite': { brand: 'Fortnite', category: 'Gaming Cards', prices: ['13.99€', '27.99€'] },
        'candy-crush': { brand: 'Candy Crush', category: 'Mobile Gaming', prices: ['5€', '10€', '25€'] },
        'razer-gold': { brand: 'Razer Gold', category: 'Gaming Cards', prices: ['10€', '25€', '50€'] },
        'valorant': { brand: 'Valorant', category: 'Gaming Cards', prices: ['10€', '25€', '50€'] },
        'pubg': { brand: 'PUBG', category: 'Gaming Cards', prices: ['10€', '25€', '50€'] },
        
        // Nintendo Games
        'nintendo-switch-online': { brand: 'Nintendo Switch Online', category: 'Gaming Subscriptions', prices: ['20€', '35€'] },
        'animal-crossing': { brand: 'Animal Crossing', category: 'Nintendo Games', prices: ['60€'] },
        'pokemon-sword-shield': { brand: 'Pokémon Sword & Shield', category: 'Nintendo Games', prices: ['30€'] },
        'zelda-tears-kingdom': { brand: 'Zelda: Tears of the Kingdom', category: 'Nintendo Games', prices: ['70€'] },
        'zelda-breath-wild': { brand: 'Zelda: Breath of the Wild', category: 'Nintendo Games', prices: ['60€'] },
        'super-mario-odyssey': { brand: 'Super Mario Odyssey', category: 'Nintendo Games', prices: ['60€'] },
        'super-mario-kart': { brand: 'Mario Kart 8 Deluxe', category: 'Nintendo Games', prices: ['60€'] },
        'splatoon-3': { brand: 'Splatoon 3', category: 'Nintendo Games', prices: ['60€'] },
        'pokemon-scarlet': { brand: 'Pokémon Scarlet', category: 'Nintendo Games', prices: ['60€'] },
        'pokemon-violet': { brand: 'Pokémon Violet', category: 'Nintendo Games', prices: ['60€'] },
        
        // Austrian Gaming
        'battlenet-guthabenkarte-oesterreich': { brand: 'Battle.net Österreich', category: 'Gaming Cards Austria', prices: ['20€', '50€'] },
        'ea-origin-oesterreich': { brand: 'EA Origin Österreich', category: 'Gaming Cards Austria', prices: ['15€', '25€', '50€'] },
        'hearthstone-code-oesterreich': { brand: 'Hearthstone Österreich', category: 'Gaming Cards Austria', prices: ['15€', '25€', '40€'] },
        'apex-legends-oesterreich': { brand: 'Apex Legends Österreich', category: 'Gaming Cards Austria', prices: ['10€', '20€', '40€'] },
        'free-fire-osterreich': { brand: 'Free Fire Österreich', category: 'Mobile Gaming Austria', prices: ['5€', '10€', '25€'] },
        'steam-oesterreich': { brand: 'Steam Österreich', category: 'Gaming Cards Austria', prices: ['20€', '50€', '100€'] },
        'razer-gold-osterreich': { brand: 'Razer Gold Österreich', category: 'Gaming Cards Austria', prices: ['10€', '25€', '50€'] },
        'riot-points-oesterreich': { brand: 'Riot Points Österreich', category: 'Gaming Cards Austria', prices: ['10€', '25€', '50€'] },
        'nintendo-eshop-card-oesterreich': { brand: 'Nintendo eShop Österreich', category: 'Gaming Cards Austria', prices: ['15€', '25€', '50€'] },
        'playstation-plus-mitgliedschaft-oesterreich': { brand: 'PlayStation Plus Österreich', category: 'Gaming Subscriptions Austria', prices: ['25€', '60€', '120€'] },
        'psn-card-oesterreich': { brand: 'PSN Card Österreich', category: 'Gaming Cards Austria', prices: ['25€', '50€', '75€'] },
        'runescape-mitgliedschaft-oesterreich': { brand: 'RuneScape Österreich', category: 'Gaming Subscriptions Austria', prices: ['11€', '22€', '55€'] },
        
        // Entertainment Germany
        'netflix': { brand: 'Netflix', category: 'Streaming Gift Cards', prices: ['25€', '50€', '75€', '100€', '125€', '150€'] },
        'spotify': { brand: 'Spotify', category: 'Music Streaming', prices: ['10€', '30€', '60€', '120€'] },
        'disney-plus': { brand: 'Disney+', category: 'Streaming Gift Cards', prices: ['27€', '54€', '90€'] },
        'dazn': { brand: 'DAZN', category: 'Sports Streaming', prices: ['45€'] },
        'tvnow': { brand: 'RTL+', category: 'Streaming Gift Cards', prices: ['30€', '60€'] },
        'twitch-geschenkkarte': { brand: 'Twitch', category: 'Streaming Gift Cards', prices: ['25€', '50€', '100€'] },
        'tinder-plus': { brand: 'Tinder Plus', category: 'Dating Apps', prices: ['10€', '30€', '60€'] },
        'tinder-gold': { brand: 'Tinder Gold', category: 'Dating Apps', prices: ['15€', '45€', '90€'] },
        
        // Austrian Entertainment  
        'disney-plus-osterreich': { brand: 'Disney+ Österreich', category: 'Streaming Austria', prices: ['27€', '54€', '90€'] },
        'spotify-premium-code-oesterreich': { brand: 'Spotify Österreich', category: 'Music Streaming Austria', prices: ['10€', '30€', '60€'] },
        'deezer-at': { brand: 'Deezer Österreich', category: 'Music Streaming Austria', prices: ['10€', '30€', '60€'] },
        'netflix-gutschein-oesterreich': { brand: 'Netflix Österreich', category: 'Streaming Austria', prices: ['25€', '50€', '100€'] },
        'twitch-osterreich': { brand: 'Twitch Österreich', category: 'Streaming Austria', prices: ['25€', '50€', '100€'] },
        'tinder-plus-osterreich': { brand: 'Tinder Plus Österreich', category: 'Dating Apps Austria', prices: ['10€', '30€', '60€'] },
        'tinder-gold-osterreich': { brand: 'Tinder Gold Österreich', category: 'Dating Apps Austria', prices: ['15€', '45€', '90€'] },
        
        // Payment Cards Germany
        'paysafecard': { brand: 'paysafecard', category: 'Prepaid Payment Cards', prices: ['10€', '25€', '50€', '100€'] },
        'cashlib': { brand: 'CashLib', category: 'Online Payment', prices: ['5€', '10€', '20€', '50€', '100€', '150€'] },
        'flexepin': { brand: 'Flexepin', category: 'Online Payment', prices: ['10€', '20€', '30€', '50€', '100€', '150€'] },
        'jeton-cash': { brand: 'Jeton Cash', category: 'Online Payment', prices: ['5€', '10€', '25€', '50€', '100€', '150€'] },
        'bitsa': { brand: 'Bitsa', category: 'Prepaid Cards', prices: ['15€', '25€', '50€', '100€'] },
        'aplauz': { brand: 'Aplauz', category: 'Prepaid Cards', prices: ['10€', '25€', '50€', '100€'] },
        'a-bon': { brand: 'A-Bon', category: 'Prepaid Cards', prices: ['5€', '10€', '20€', '25€', '50€'] },
        
        // Austrian Payment Cards
        'cashlib-osterreich': { brand: 'CashLib Österreich', category: 'Online Payment Austria', prices: ['10€', '25€', '50€'] },
        'flexepin-osterreich': { brand: 'Flexepin Österreich', category: 'Online Payment Austria', prices: ['10€', '25€', '50€'] },
        'jeton-cash-oesterreich': { brand: 'Jeton Cash Österreich', category: 'Online Payment Austria', prices: ['10€', '25€', '50€'] },
        'bitsa-oesterreich': { brand: 'Bitsa Österreich', category: 'Prepaid Cards Austria', prices: ['15€', '25€', '50€'] },
        'astropay-oesterreich': { brand: 'AstroPay Österreich', category: 'Online Payment Austria', prices: ['10€', '25€', '50€'] },
        'a-bon-osterreich': { brand: 'A-Bon Österreich', category: 'Prepaid Cards Austria', prices: ['10€', '25€', '50€'] },
        'paysafecard-at': { brand: 'paysafecard Österreich', category: 'Prepaid Payment Cards Austria', prices: ['10€', '25€', '50€'] },
        'neosurf-at': { brand: 'Neosurf Österreich', category: 'Online Payment Austria', prices: ['10€', '25€', '50€'] },
        'transcash-oesterreich': { brand: 'Transcash Österreich', category: 'Prepaid Cards Austria', prices: ['25€', '50€', '100€'] },
        'mifinity': { brand: 'MiFinity', category: 'E-Wallets', prices: ['25€', '50€', '100€'] },
        'mint-prepaid-osterreich': { brand: 'Mint Prepaid Österreich', category: 'Prepaid Cards Austria', prices: ['15€', '25€', '50€'] },
        'rewarble': { brand: 'Rewarble', category: 'Crypto Cards', prices: ['25€', '50€', '100€'] },
        'pcs-oesterreich': { brand: 'PCS Österreich', category: 'Prepaid Cards Austria', prices: ['25€', '50€', '100€'] },
        
        // Communication & Other
        'libon': { brand: 'Libon', category: 'Communication', prices: ['5€', '10€', '20€'] },
        'eety-guthaben': { brand: 'Eety', category: 'Communication', prices: ['5€', '10€', '25€'] },
        'microsoft-geschenkkarte': { brand: 'Microsoft', category: 'Tech Gift Cards', prices: ['25€', '50€', '100€'] },
        'microsoft-geschenkkarte-oesterreich': { brand: 'Microsoft Österreich', category: 'Tech Gift Cards Austria', prices: ['25€', '50€', '100€'] },
        'tiktok-de': { brand: 'TikTok', category: 'Social Media', prices: ['5€', '10€', '25€'] },
        
        // Travel
        'airbnb': { brand: 'Airbnb', category: 'Travel', prices: ['50€', '100€', '150€', '200€', '250€'] }
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

    // Neutralize any external backdrops/overlays that might darken the page
    function neutralizeBackdrops() {
        try {
            console.log('[DEBUG] Checking for dark backdrops...');
            const candidates = document.querySelectorAll(
                '.MuiBackdrop-root, .MuiModal-backdrop, [class*="Backdrop" i], [class*="backdrop" i], [style*="rgba(0, 0, 0" i]'
            );
            console.log('[DEBUG] Found backdrop candidates:', candidates.length);
            candidates.forEach((el, index) => {
                const cs = window.getComputedStyle(el);
                const isFixed = cs.position === 'fixed';
                const hasDarkBg = cs.backgroundColor.includes('rgba(0, 0, 0') || cs.backgroundColor === 'black';
                console.log(`[DEBUG] Backdrop ${index}:`, {
                    element: el,
                    className: el.className,
                    position: cs.position,
                    backgroundColor: cs.backgroundColor,
                    isFixed,
                    hasDarkBg
                });
                if (isFixed && hasDarkBg) {
                    console.log('[DEBUG] Neutralizing dark backdrop:', el);
                    el.style.setProperty('background', 'transparent', 'important');
                    el.style.setProperty('background-color', 'transparent', 'important');
                }
            });
        } catch (e) {
            console.error('[DEBUG] Error in neutralizeBackdrops:', e);
        }
    }


    // Create modern results container
    function createResultsContainer() {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results-dropdown';
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 2147483647;
            max-height: 480px;
            overflow-y: auto;
            display: none;
            margin-top: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;

        // Custom scrollbar
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #search-results-dropdown::-webkit-scrollbar {
                width: 8px;
            }
            #search-results-dropdown::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 10px;
            }
            #search-results-dropdown::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
            }
            #search-results-dropdown::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        `;
        document.head.appendChild(scrollbarStyle);

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

    // Show overlay (scrim + spotlight) - DISABLED
    function showOverlay() {
        // Overlay functionality disabled per user request
        console.log('[DEBUG] showOverlay() called - but disabled');
        neutralizeBackdrops();
        try { console.debug('[search] overlay disabled'); } catch (_) {}
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
        // showOverlay(); // Disabled - no more black overlay

        // Helper: color per brand/slug
        const brandColors = {
            // Payment Cards
            'paysafecard': '#0066cc',
            'cashlib': '#1e40af',
            'flexepin': '#7c3aed',
            'jeton-cash': '#dc2626',
            'bitsa': '#059669',
            'aplauz': '#ea580c',
            'a-bon': '#0891b2',
            
            // Mobile Top-ups
            'telekom': '#E20074',
            'vodafone': '#E60000',
            'o2': '#001A72',
            'lebara': '#00b4d8',
            'lycamobile': '#00a651',
            'congstar': '#000000',
            'aldi-talk': '#1F6DB6',
            'ay-yildiz': '#FFD700',
            'blau-de': '#0066cc',
            'blauworld': '#003d82',
            'bildmobil': '#e60000',
            'e-plus': '#00a651',
            'fonic': '#0066cc',
            'fyve': '#ff6b35',
            'einfach-prepaid': '#006341',
            'klarmobil': '#e60000',
            'gt-mobile': '#1e40af',
            'bob-wertkarte': '#ff6b00',
            'drei': '#ff6b00',
            'b-free': '#0066cc',
            'lycamobile-oesterreich': '#00a651',
            'lifecell': '#0066cc',
            
            // Gift Cards & Shopping
            'amazon': '#FF9900',
            'apple': '#000000',
            'google-play': '#4285F4',
            'h-m': '#E50010',
            'zalando': '#FF6900',
            'nike': '#111111',
            'ikea': '#0058A3',
            'douglas': '#000000',
            'mediamarkt': '#e60000',
            'cyberport': '#0066cc',
            'jochen-schweizer': '#e60000',
            'eventim': '#e60000',
            'lieferando': '#ff8000',
            'ca-geschenkkarte': '#e60000',
            'adidas': '#000000',
            'lush': '#00a651',
            'cineplex': '#1e40af',
            'airbnb': '#ff5a5f',
            
            // Gaming
            'steam': '#171A21',
            'xbox': '#0E7A0D',
            'playstation': '#003087',
            'nintendo': '#E60012',
            'roblox': '#191919',
            'battlenet-guthabenkarte': '#148eff',
            'ea-game-card': '#ff6c11',
            'league-of-legends-riot-points': '#c89b3c',
            'hearthstone-guthabenkarte': '#f4d03f',
            'meta-quest': '#1c1e21',
            'fortnite': '#7b68ee',
            'candy-crush': '#ff69b4',
            
            // Entertainment
            'spotify': '#1DB954',
            'netflix': '#E50914',
            'disney-plus': '#113ccf',
            'dazn': '#ffff00',
            'deezer-at': '#ff6600',
            
            // Communication & Other
            'libon': '#7c3aed',
            'eety-guthaben': '#06b6d4'
        };
        
        const getBrandLogo = (slug) => {
            const logos = {
                // Payment Cards
                'paysafecard': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="6" width="20" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/><circle cx="7" cy="12" r="1" fill="white"/><circle cx="12" cy="12" r="1" fill="white"/><circle cx="17" cy="12" r="1" fill="white"/></svg>`,
                'cashlib': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="3" y="5" width="18" height="14" rx="3" stroke="white" stroke-width="2" fill="none"/><path d="M8 15l2-6h4l-2 6" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'flexepin': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="white" stroke-width="2"/></svg>`,
                'jeton-cash': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="white" stroke-width="2" fill="none"/><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'bitsa': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="6" width="20" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="white"/><path d="M6 10v4M18 10v4" stroke="white" stroke-width="2"/></svg>`,
                
                // Mobile Networks
                'telekom': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="3" width="20" height="18" rx="2" fill="white"/><rect x="4" y="5" width="16" height="2" fill="#E20074"/><circle cx="12" cy="12" r="4" stroke="#E20074" stroke-width="2" fill="none"/></svg>`,
                'vodafone': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" stroke-width="2" fill="none"/><path d="M8 9c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'o2': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'lebara': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'lycamobile': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="5" y="2" width="14" height="20" rx="2" stroke="white" stroke-width="2" fill="none"/><rect x="9" y="6" width="6" height="1" fill="white"/><rect x="9" y="8" width="6" height="1" fill="white"/></svg>`,
                'congstar': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26 12,2" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'aldi-talk': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="6" width="20" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M7 11h10M7 13h7" stroke="white" stroke-width="2"/></svg>`,
                
                // Tech & Digital
                'apple': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`,
                'google-play': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3.609 1.814L13.792 12L3.609 22.186a.996.996 0 01-.609-.92V2.734a.996.996 0 01.609-.92zm10.89 10.893l2.302 2.302 5.317-2.658c.377-.189.377-.664 0-.853L16.8 8.84l-2.302 2.302-.998.565zm3.199-3.602L15.396 12l2.302 2.302 5.317-2.658c.377-.189.377-.664 0-.853L17.698 9.105z"/></svg>`,
                
                // Shopping & Fashion
                'amazon': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 8.4 3.208 12.653 3.208 3.706 0 8.192-1.022 12.133-3.115.246-.131.352-.073.352.174 0 .131-.063.246-.189.33-4.133 2.576-9.36 3.74-12.496 3.74-4.564 0-9.192-1.49-12.653-3.74-.116-.073-.189-.189-.148-.575zm1.085-2.636c.073-.131.188-.116.334-.022 4.244 2.213 9.69 3.366 14.471 3.366 2.896 0 6.487-.58 9.313-1.616.246-.087.437-.022.437.218 0 .131-.073.232-.218.305-3.234 1.297-7.169 1.983-10.105 1.983-4.826 0-10.41-1.065-14.08-3.16-.16-.087-.218-.189-.152-.074zm1.91-3.023c.087-.131.203-.102.363-.007 3.004 1.543 7.32 2.636 11.636 2.636 2.461 0 5.395-.407 7.856-1.258.218-.073.377.029.377.218 0 .116-.058.203-.189.276-2.664.992-5.773 1.401-8.234 1.401-4.682 0-9.364-1.065-11.636-2.636-.131-.087-.218-.189-.173-.63z"/></svg>`,
                'h-m': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="3" y="6" width="18" height="12" rx="2" stroke="white" stroke-width="2" fill="none"/><path d="M7 10h4M7 14h10M15 10v4" stroke="white" stroke-width="2"/></svg>`,
                'zalando': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="white" stroke-width="2" fill="none"/><path d="M7.5 4.21l4.5 2.6 4.5-2.6M12 6.81V17.5" stroke="white" stroke-width="2"/></svg>`,
                'nike': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M2 18h20L12 6z" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'ikea': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" stroke-width="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'douglas': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="white" stroke-width="2"/></svg>`,
                'mediamarkt': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="3" width="20" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><circle cx="8" cy="10" r="2" stroke="white" stroke-width="2" fill="none"/><path d="M16 21l-4-4-4 4" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'lieferando': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 6h13l-1.5 7H9L7 3H4" stroke="white" stroke-width="2" fill="none"/><circle cx="9" cy="20" r="1" stroke="white" stroke-width="2" fill="none"/><circle cx="20" cy="20" r="1" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'airbnb': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" stroke-width="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="white" stroke-width="2" fill="none"/></svg>`,
                
                // Gaming
                'steam': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.632 20.307 6.504 24 11.979 24c6.624 0 11.999-5.375 11.999-12S18.603.001 11.979.001zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.457-.397.956-1.497 1.41-2.455 1.01zm8.555-9.45c0-1.663-1.352-3.015-3.015-3.015s-3.015 1.352-3.015 3.015 1.353 3.015 3.015 3.015 3.015-1.353 3.015-3.015z"/></svg>`,
                'xbox': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><path d="M8 12s4-8 4-8 4 8 4 8-4 8-4 8-4-8-4-8z" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'playstation': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8.5 8.64L15.36 12L8.5 15.36V8.64zM21.98 12L8.5 5.5v13L21.98 12z" stroke="white" stroke-width="1.5" fill="none"/><rect x="2" y="9" width="4" height="6" fill="white"/></svg>`,
                'nintendo': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="12" height="16" rx="6" stroke="white" stroke-width="2" fill="none"/><circle cx="10" cy="8" r="1.5" fill="white"/><circle cx="14" cy="16" r="1.5" fill="white"/><rect x="13" y="7" width="1" height="1" fill="white"/><rect x="15" y="7" width="1" height="1" fill="white"/><rect x="13" y="9" width="1" height="1" fill="white"/><rect x="15" y="9" width="1" height="1" fill="white"/></svg>`,
                'roblox': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 7l6-2 12 4-6 2L3 7z" stroke="white" stroke-width="2" fill="none"/><path d="M9 5v12l-6-2V3l6 2z" stroke="white" stroke-width="2" fill="none"/></svg>`,
                'battlenet-guthabenkarte': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="white" stroke-width="2" fill="none"/><polygon points="10,8 14,8 16,12 14,16 10,16 8,12 10,8" stroke="white" stroke-width="1.5" fill="none"/></svg>`,
                'ea-game-card': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><polygon points="8,9 16,9 14,15 10,15 8,9" fill="white"/></svg>`,
                'fortnite': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="white" stroke-width="2" fill="none"/><path d="M9 9l6 3-6 3V9z" fill="white"/></svg>`,
                'meta-quest': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/></svg>`,
                
                // Entertainment
                'spotify': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10" fill="white"/><path d="M8 10.5c2-1 6-1 8 0M8 12.5c2-1 6-1 8 0M8 14.5c2-1 6-1 8 0" stroke="#1DB954" stroke-width="1.5" stroke-linecap="round"/></svg>`,
                'netflix': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="3" height="16" fill="white"/><rect x="15" y="4" width="3" height="16" fill="white"/><polygon points="6,4 15,20 18,20 9,4" fill="white"/></svg>`,
                'disney-plus': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" stroke-width="2" fill="none"/><polygon points="10,8 10,16 14,12 10,8" fill="white"/></svg>`,
                'dazn': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="3" width="20" height="14" rx="2" stroke="white" stroke-width="2" fill="none"/><polygon points="8,8 16,8 12,13 16,13 8,16 12,11 8,11 8,8" fill="white"/></svg>`,
                
                // Communication
                'libon': `<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="white" stroke-width="2" fill="none"/></svg>`
            };
            return logos[slug] || null;
        };

        const getAvatarHtml = (product) => {
            const bg = getColorFor(product.slug);
            const iconUrl = getIconUrl(product.slug);
            
            if (iconUrl) {
                return `<div style="width: 48px; height: 48px; background: ${bg}; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                    <img src="${iconUrl}" alt="${product.brand}" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px;" onerror="this.style.display='none'; this.nextSibling.style.display='flex';">
                    <div style="width: 36px; height: 36px; display: none; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px;">${(product.brand || product.slug || '?').charAt(0).toUpperCase()}</div>
                </div>`;
            }
            
            const letter = (product.brand || product.slug || '?').charAt(0).toUpperCase();
            return `<div style="width: 48px; height: 48px; background: ${bg}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">${letter}</div>`;
        };

        // Resolve icon URLs from local assets for each brand/slug
        const ASSET_BASE = window.location.pathname.includes('/desktop/') ? './assets/' : 'desktop/assets/';
        function getIconUrl(slug) {
            const map = {
                // Payment Cards
                'paysafecard': 'w1080_q100_paysafecard.png',
                'cashlib': 'w1080_q100_Cashlib.png',
                'flexepin': 'w1080_q100_flexepin-cash-top-up.jpg',
                'jeton-cash': 'w1080_q100_Jeton-LL.png',
                'bitsa': 'w1080_q100_bitsa-ll.png',
                'aplauz': 'w1080_q75_Aplauz.png',
                'a-bon': 'w1080_q75_A-bon.png',
                
                // Mobile Networks
                'telekom': 'w1080_q100_Telekom-Logo-product-card-1.png',
                'vodafone': 'w1080_q100_Vodafone-MM.png',
                'o2': 'w1080_q100_O2.png',
                'lebara': 'w1080_q100_Lebara_ProductCard_CallCredit-1.png',
                'lycamobile': 'w1080_q100_LycaMobile.png',
                'congstar': 'w1080_q100_Congstar.png',
                'aldi-talk': 'w1080_q100_aldi-talk.png',
                'ay-yildiz': 'w1080_q100_Ay-Yildiz-LL.png',
                'blau-de': 'w1080_q100_Blau1.png',
                'blauworld': 'w1080_q100_Blauworld-LL.png',
                'bildmobil': 'w1080_q100_Bild-Mobile-LL.png',
                'e-plus': 'w1080_q100_NettoKom-LL.png',
                'fonic': 'w1080_q100_Fonic-LL.png',
                'fyve': 'w1080_q100_Fyve-LL.png',
                'einfach-prepaid': 'w1080_q100_Einfach-LL.png',
                'klarmobil': 'w1080_q100_Klarmobil-LL-.png',
                'gt-mobile': 'w1080_q100_GT-Mobile-LL.png',
                'lycamobile-oesterreich': 'w1080_q100_Lycamobile-Local-Labels.png',
                'lifecell': 'w1080_q100_LIfecell-GTH1.png',
                'bob-wertkarte': 'w1080_q75_3-banner.png',
                'drei': 'w1080_q75_3-banner.png',
                'b-free': 'w1080_q75_3-banner.png',
                'ortel-mobile': 'w1080_q100_Ortel-Mobile-LL.png',
                'otelo': 'w1080_q100_Otelo-LL.png',
                'simyo': 'w1080_q100_Simyo-LL.png',
                'toneo-first': 'w1080_q100_Toneo.png',
                'rossmann-mobil': 'w1080_q100_Rossmann-gutschien-LL-.png',
                'nettokom': 'w1080_q100_NettoKom-LL.png',
                'netzclub': 'w1080_q100_NettoKom-LL.png',
                'mobi': 'w1080_q100_Mobi-LL.png',
                'turk-telekom': 'w1080_q100_Turk-Telekom-LL.png',
                
                // Shopping & Fashion
                'amazon': 'w1080_q100_Amazon-DE.png',
                'apple': 'w1080_q100_Apple-NB-Local-Labels.png',
                'google-play': 'w1080_q100_Google-Play-LL-New.png',
                'h-m': 'w1080_q100_Zalando-LL.png',
                'zalando': 'w1080_q100_Zalando-LL.png',
                'nike': 'w1080_q100_Nike.png',
                'ikea': 'w1080_q100_IKEA.png',
                'douglas': 'w1080_q100_douglas-ll.png',
                'mediamarkt': 'w1080_q100_Saturn-LL.png',
                'saturn': 'w1080_q100_Saturn-LL.png',
                'cyberport': 'w1080_q100_Cyberport-Local-Labels.png',
                'jochen-schweizer': 'w1080_q100_Jochen-Schweizer.png',
                'eventim': 'w1080_q100_Eventim.png',
                'lieferando': 'w1080_q100_Lieferando-AT-DE.png',
                'ca-geschenkkarte': 'w1080_q100_Zalando-LL.png',
                'adidas': 'w1080_q100_Adidas.png',
                'lush': 'w1080_q100_douglas-ll.png',
                'cineplex': 'w1080_q100_Cineplex-LL.png',
                'airbnb': 'w1080_q100_Airbnb-LL.png',
                'tk-maxx': 'w1080_q100_Tk-Maxx.png',
                'rossmann': 'w1080_q100_Rossmann-gutschien-LL-.png',
                'tchibo': 'w1080_q100_Saturn-LL.png',
                'otto-gutscheincode': 'w1080_q100_Saturn-LL.png',
                'ticketmaster': 'w1080_q100_Eventim.png',
                'treatwell': 'w1080_q100_Treatwell-Local-labels.png',
                'uber': 'w1080_q100_Uber-Gift-Card-LL.png',
                
                // Austrian Shopping
                'amazon-gutscheine-oesterreich': 'w1080_q100_Amazon-DE.png',
                'apple-gift-card-oesterreich': 'w1080_q100_Apple-NB-Local-Labels.png',
                'google-play-card-oesterreich': 'w1080_q100_Google-Play-LL-New.png',
                'h-m-geschenkcode-osterreich': 'w1080_q100_Zalando-LL.png',
                'zalando-gutschein-oesterreich': 'w1080_q100_Zalando-LL.png',
                'lieferando-osterreich': 'w1080_q100_Lieferando-AT-DE.png',
                'airbnb-osterreich': 'w1080_q100_Airbnb-LL.png',
                'kobo-osterreich': 'w1080_q100_Apple-NB-Local-Labels.png',
                'mango-osterreich': 'w1080_q100_Zalando-LL.png',
                'nike-osterreich': 'w1080_q100_Nike.png',
                'treatwell-osterreich': 'w1080_q100_Treatwell-Local-labels.png',
                
                // Gaming
                'steam': 'w1080_q100_Steam-LL.png',
                'xbox': 'w1080_q100_xbox-shopping-bag.png',
                'playstation': 'w1080_q100_playstation-store-LL.png',
                'nintendo': 'w1080_q100_Nintendo-eShop-LL.png',
                'roblox': 'w1080_q100_Roblox-LL.png',
                'battlenet-guthabenkarte': 'w1080_q100_Blizzard-LL.png',
                'ea-game-card': 'w1080_q100_EA-Origin-.png',
                'league-of-legends-riot-points': 'w1080_q100_League-of-lEgends-LL.png',
                'hearthstone-guthabenkarte': 'w1080_q100_Blizzard-LL.png',
                'meta-quest': 'w1080_q100_Meta-Quest-DE-Local-Labels.png',
                'fortnite': 'w1080_q100_fortnite-12-12.png',
                'candy-crush': 'w1080_q100_Candy-Crush-LL.png',
                'razer-gold': 'w1080_q100_Razer-Gold-LL.png',
                'valorant': 'w1080_q100_Valorant-LL.png',
                'pubg': 'w1080_q100_PUBG.png',
                
                // Austrian Gaming
                'battlenet-guthabenkarte-oesterreich': 'w1080_q100_Blizzard-LL.png',
                'ea-origin-oesterreich': 'w1080_q100_EA-Origin-.png',
                'hearthstone-code-oesterreich': 'w1080_q100_Blizzard-LL.png',
                'apex-legends-oesterreich': 'w1080_q75_Apex-GTH.png',
                'free-fire-osterreich': 'w1080_q100_fortnite-12-12.png',
                'steam-oesterreich': 'w1080_q100_Steam-LL.png',
                'razer-gold-osterreich': 'w1080_q100_Razer-Gold-LL.png',
                'riot-points-oesterreich': 'w1080_q100_League-of-lEgends-LL.png',
                
                // Entertainment
                'spotify': 'w1080_q100_Spotify-MM.png',
                'netflix': 'w1080_q100_MM_Netflix_2021.png',
                'disney-plus': 'w1080_q100_DIS_Epay_RetailerKarten_digital_2024_DE.png',
                'dazn': 'w1080_q100_DAZN-logo.png',
                'tvnow': 'w1080_q100_RTL.png',
                'twitch-geschenkkarte': 'w1080_q100_Twitch-LL.png',
                'tinder-plus': 'w1080_q100_Tinder-Plus-1.png',
                'tinder-gold': 'w1080_q100_Tinder-Gold-LL.png',
                
                // Austrian Entertainment  
                'disney-plus-osterreich': 'w1080_q100_DIS_Epay_RetailerKarten_digital_2024_AT_plain.png',
                'spotify-premium-code-oesterreich': 'w1080_q100_Spotify-MM.png',
                'deezer-at': 'w1080_q100_Spotify-MM.png',
                'netflix-gutschein-oesterreich': 'w1080_q100_netflix-LL.png',
                'twitch-osterreich': 'w1080_q100_Twitch.png',
                'tinder-plus-osterreich': 'w1080_q100_Tinder-Plus-1.png',
                'tinder-gold-osterreich': 'w1080_q100_Tinder-Gold-LL.png',
                
                // Austrian Payment Cards
                'cashlib-osterreich': 'w1080_q100_Cashlib-Local-Labels.png',
                'flexepin-osterreich': 'w1080_q100_flexepin-cash-top-up.jpg',
                'jeton-cash-oesterreich': 'w1080_q100_Jeton-LL.png',
                'bitsa-oesterreich': 'w1080_q100_bitsa-ll.png',
                'astropay-oesterreich': 'w1080_q75_Astropay-GTH.png',
                'a-bon-osterreich': 'w1080_q75_A-bon.png',
                'paysafecard-at': 'w1080_q100_paysafecard-product-card-local-labels.png',
                'neosurf-at': 'w1080_q100_neosurf.png',
                'transcash-oesterreich': 'w1080_q100_Transcash.png',
                'mifinity': 'w1080_q100_Mifinity.png',
                'mint-prepaid-osterreich': 'w1080_q100_Mint-LL.png',
                'rewarble': 'w1080_q100_Card.png',
                'pcs-oesterreich': 'w1080_q100_PCS.png',
                
                // Communication
                'libon': 'w1080_q100_LIfecell-GTH1.png',
                'eety-guthaben': 'w1080_q100_Mobi-LL.png',
                
                // Nintendo Games
                'nintendo-switch-online': 'w1080_q100_Nintendo-Switch-LL.png',
                'animal-crossing': 'w1080_q100_Animal-Crossing-De.png',
                'pokemon-sword-shield': 'w1080_q100_pokemon-sword-shield-expansion-pass.jpg',
                'zelda-tears-kingdom': 'w1080_q100_Zelda-Tears-of-the-Kingdom-DE-1.png',
                'zelda-breath-wild': 'w1080_q100_Zelda-breath-of-the-wild-DE.png',
                'super-mario-odyssey': 'w1080_q100_Super-Mario-Odyssey-DE.png',
                'super-mario-kart': 'w1080_q100_Super-Mario-Kart-DE-1.png',
                'splatoon-3': 'w1080_q100_Splatoon-3-DE.png',
                'pokemon-scarlet': 'w1080_q100_Pokemon-Scarlet-DE.png',
                'pokemon-violet': 'w1080_q100_Pokemon-Violet-DE.png',
                
                // Microsoft
                'microsoft-geschenkkarte': 'w1080_q100_xbox-shopping-bag.png',
                'microsoft-geschenkkarte-oesterreich': 'w1080_q100_xbox-shopping-bag.png',
                
                // TikTok
                'tiktok-de': 'w1080_q100_TikTok-Local-Labels.png'
            };
            const file = map[slug];
            return file ? (ASSET_BASE + file) : null;
        }

        if (results.length === 0) {
            // Show popular items when no search results
            const popularProducts = [
                { brand: 'Amazon', category: 'Shopping Gift Cards', price: '25€', slug: 'amazon' },
                { brand: 'Google Play', category: 'Digital Content', price: '25€', slug: 'google-play' },
                { brand: 'Steam', category: 'Gaming Cards', price: '20€', slug: 'steam' },
                { brand: 'Netflix', category: 'Streaming Gift Cards', price: '25€', slug: 'netflix' },
                { brand: 'paysafecard', category: 'Prepaid Payment Cards', price: '25€', slug: 'paysafecard' },
                { brand: 'Deutsche Telekom', category: 'Mobile Top-up', price: '15€', slug: 'telekom' }
            ];
            
            const popularHeader = `
                <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #f1f5f9;">
                    <div style="font-weight: 700; font-size: 16px; color: #374151; margin-bottom: 4px;">
                        Beliebte Produkte
                    </div>
                    <div style="font-size: 14px; color: #6b7280;">
                        Die meist gekauften Guthabenkarten
                    </div>
                </div>
            `;
            
            const itemsHtml = popularProducts.map((p, index) => `
                <div class="search-result-item modern-card"
                     style="padding: 20px 24px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: space-between; border-bottom: ${index === popularProducts.length - 1 ? 'none' : '1px solid #f1f5f9'}; position: relative; overflow: hidden;"
                     data-slug="${p.slug}"
                     data-price="${p.price || ''}"
                     onmouseover="this.style.backgroundColor='#f8fafc'; this.style.transform='translateY(-1px)'; this.querySelector('.arrow-icon').style.transform='translateX(4px)'"
                     onmouseout="this.style.backgroundColor='transparent'; this.style.transform='translateY(0px)'; this.querySelector('.arrow-icon').style.transform='translateX(0px)'">
                    <div style="display: flex; align-items: center; flex: 1;">
                        ${getAvatarHtml(p)}
                        <div style="flex: 1; margin-left: 16px;">
                            <div style="font-weight: 600; font-size: 16px; color: #111827; margin: 0 0 6px 0; display: flex; align-items: center; gap: 8px; transform: translateY(-10px);">
                                ${p.brand} 
                                <span style="color: #3b82f6; font-weight: 700; background: #eff6ff; padding: 2px 8px; border-radius: 8px; font-size: 14px;">${p.price}</span>
                            </div>
                            <div style="font-size: 14px; color: #6b7280; font-weight: 500;">
                                ${p.category}
                            </div>
                        </div>
                    </div>
                    <div class="arrow-icon" style="color: #9ca3af; font-size: 18px; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #f9fafb;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                    </div>
                </div>
            `).join('');

            resultsContainer.innerHTML = popularHeader + itemsHtml;
        } else {
            // Show actual search results with modern design
            const resultsHeader = `
                <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #f1f5f9;">
                    <div style="font-weight: 700; font-size: 16px; color: #374151; margin-bottom: 4px;">
                        Suchergebnisse
                    </div>
                    <div style="font-size: 14px; color: #6b7280;">
                        ${results.length} ${results.length === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
                    </div>
                </div>
            `;
            
            const itemsHtml = results.map((p, index) => `
                <div class="search-result-item modern-card"
                     style="padding: 20px 24px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: space-between; border-bottom: ${index === results.length - 1 ? 'none' : '1px solid #f1f5f9'}; position: relative; overflow: hidden;"
                     data-slug="${p.slug}"
                     data-price="${p.price || ''}"
                     onmouseover="this.style.backgroundColor='#f8fafc'; this.style.transform='translateY(-1px)'; this.querySelector('.arrow-icon').style.transform='translateX(4px)'"
                     onmouseout="this.style.backgroundColor='transparent'; this.style.transform='translateY(0px)'; this.querySelector('.arrow-icon').style.transform='translateX(0px)'">
                    <div style="display: flex; align-items: center; flex: 1;">
                        ${getAvatarHtml(p)}
                        <div style="flex: 1; margin-left: 16px;">
                            <div style="font-weight: 600; font-size: 16px; color: #111827; margin: 0 0 6px 0; display: flex; align-items: center; gap: 8px; transform: translateY(-10px);">
                                ${p.brand} 
                                <span style="color: #3b82f6; font-weight: 700; background: #eff6ff; padding: 2px 8px; border-radius: 8px; font-size: 14px;">${p.price}</span>
                            </div>
                            <div style="font-size: 14px; color: #6b7280; font-weight: 500;">
                                ${p.category}
                            </div>
                        </div>
                    </div>
                    <div class="arrow-icon" style="color: #9ca3af; font-size: 18px; transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #f9fafb;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                    </div>
                </div>
            `).join('');

            resultsContainer.innerHTML = resultsHeader + itemsHtml;
        }

        // Click handlers for all items
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const slug = this.dataset.slug;
                const priceRaw = this.dataset.price || '';
                if (!slug) return;

                // Map slugs to correct file names
                const slugToFile = {
                    // Mobile Top-ups Germany
                    'telekom': 'telekom',
                    'vodafone': 'vodafone-aufladen',
                    'o2': 'o2-aufladen',
                    'lebara': 'lebara-aufladen',
                    'lycamobile': 'lycamobile-aufladen',
                    'congstar': 'congstar-aufladen',
                    'aldi-talk': 'aldi-talk-aufladen',
                    'ay-yildiz': 'ay-yildiz-aufladen',
                    'blau-de': 'blau-de-aufladen',
                    'blauworld': 'blauworld-aufladen',
                    'bildmobil': 'bildmobil-aufladen',
                    'e-plus': 'e-plus-aufladen',
                    'fonic': 'fonic-aufladen',
                    'fyve': 'fyve-aufladen',
                    'einfach-prepaid': 'einfach-prepaid-aufladen',
                    'klarmobil': 'klarmobil-aufladen',
                    'gt-mobile': 'gt-mobile-aufladen',
                    'ortel-mobile': 'ortel-mobile-aufladen',
                    'otelo': 'otelo-aufladen',
                    'simyo': 'simyo',
                    'toneo-first': 'toneo-first',
                    'rossmann-mobil': 'rossmann-mobil-aufladen',
                    'nettokom': 'nettokom-aufladen',
                    'netzclub': 'netzclub-aufladen',
                    'mobi': 'mobi-aufladen',
                    'turk-telekom': 'turk-telekom-aufladen',
                    
                    // Austrian Mobile
                    'bob-wertkarte': 'bob-wertkarte',
                    'drei': 'drei-aufladen',
                    'b-free': 'b-free-aufladen',
                    'lycamobile-oesterreich': 'lycamobile-oesterreich',
                    'lifecell': 'lifecell',
                    
                    // Gift Cards Germany
                    'amazon': 'amazon-gutschein',
                    'apple': 'apple-gift-card',
                    'google-play': 'google-play-guthaben',
                    'h-m': 'h-m-geschenkcode',
                    'zalando': 'zalando-gutschein-oesterreich',
                    'nike': 'nike-gutscheincode',
                    'ikea': 'ikea',
                    'douglas': 'douglas',
                    'mediamarkt': 'mediamarkt',
                    'saturn': 'saturn',
                    'cyberport': 'cyberport',
                    'jochen-schweizer': 'jochen-schweizer',
                    'eventim': 'eventim',
                    'lieferando': 'lieferando',
                    'ca-geschenkkarte': 'ca-geschenkkarte',
                    'adidas': 'adidas',
                    'lush': 'lush',
                    'cineplex': 'cineplex',
                    'tk-maxx': 'tk-maxx',
                    'rossmann': 'rossmann',
                    'tchibo': 'tchibo',
                    'otto-gutscheincode': 'otto-gutscheincode',
                    'ticketmaster': 'ticketmaster',
                    'treatwell': 'treatwell',
                    'uber': 'uber',
                    
                    // Austrian Gift Cards
                    'amazon-gutscheine-oesterreich': 'amazon-gutscheine-oesterreich',
                    'apple-gift-card-oesterreich': 'apple-gift-card-oesterreich',
                    'google-play-card-oesterreich': 'google-play-card-oesterreich',
                    'h-m-geschenkcode-osterreich': 'h-m-geschenkcode-osterreich',
                    'zalando-gutschein-oesterreich': 'zalando-gutschein-oesterreich',
                    'lieferando-osterreich': 'lieferando-osterreich',
                    'airbnb-osterreich': 'airbnb-osterreich',
                    'kobo-osterreich': 'kobo-osterreich',
                    'mango-osterreich': 'mango-osterreich',
                    'nike-osterreich': 'nike-osterreich',
                    'treatwell-osterreich': 'treatwell-osterreich',
                    
                    // Gaming Germany
                    'steam': 'steam',
                    'xbox': 'xbox-game-pass',
                    'playstation': 'playstation-plus-mitgliedschaft',
                    'nintendo': 'nintendo-eshop-card',
                    'roblox': 'roblox-gift-card',
                    'battlenet-guthabenkarte': 'battlenet-guthabenkarte',
                    'ea-game-card': 'ea-game-card',
                    'league-of-legends-riot-points': 'league-of-legends-riot-points',
                    'hearthstone-guthabenkarte': 'hearthstone-guthabenkarte',
                    'meta-quest': 'meta-quest',
                    'fortnite': 'fortnite',
                    'candy-crush': 'candy-crush',
                    'razer-gold': 'razer-gold',
                    'valorant': 'valorant',
                    'pubg': 'pubg-us',
                    
                    // Nintendo Games
                    'nintendo-switch-online': 'nintendo-switch-online',
                    'animal-crossing': 'nintendo-switch-spiele',
                    'pokemon-sword-shield': 'nintendo-switch-spiele',
                    'zelda-tears-kingdom': 'nintendo-switch-spiele',
                    'zelda-breath-wild': 'nintendo-switch-spiele',
                    'super-mario-odyssey': 'nintendo-switch-spiele',
                    'super-mario-kart': 'nintendo-switch-spiele',
                    'splatoon-3': 'nintendo-switch-spiele',
                    'pokemon-scarlet': 'nintendo-switch-spiele',
                    'pokemon-violet': 'nintendo-switch-spiele',
                    
                    // Austrian Gaming
                    'battlenet-guthabenkarte-oesterreich': 'battlenet-guthabenkarte-oesterreich',
                    'ea-origin-oesterreich': 'ea-origin-oesterreich',
                    'hearthstone-code-oesterreich': 'hearthstone-code-oesterreich',
                    'apex-legends-oesterreich': 'apex-legends-oesterreich',
                    'free-fire-osterreich': 'free-fire-osterreich',
                    'steam-oesterreich': 'steam-oesterreich',
                    'razer-gold-osterreich': 'razer-gold-osterreich',
                    'riot-points-oesterreich': 'riot-points-oesterreich',
                    'nintendo-eshop-card-oesterreich': 'nintendo-eshop-card-oesterreich',
                    'playstation-plus-mitgliedschaft-oesterreich': 'playstation-plus-mitgliedschaft-oesterreich',
                    'psn-card-oesterreich': 'psn-card-oesterreich',
                    'runescape-mitgliedschaft-oesterreich': 'runescape-mitgliedschaft-oesterreich',
                    
                    // Entertainment Germany
                    'netflix': 'netflix-geschenkkarte',
                    'spotify': 'spotify-premium-code-oesterreich',
                    'disney-plus': 'disney-plus',
                    'dazn': 'dazn',
                    'tvnow': 'tvnow',
                    'twitch-geschenkkarte': 'twitch-geschenkkarte',
                    'tinder-plus': 'tinder-plus',
                    'tinder-gold': 'tinder-gold',
                    
                    // Austrian Entertainment
                    'disney-plus-osterreich': 'disney-plus-osterreich',
                    'spotify-premium-code-oesterreich': 'spotify-premium-code-oesterreich',
                    'deezer-at': 'deezer-at',
                    'netflix-gutschein-oesterreich': 'netflix-gutschein-oesterreich',
                    'twitch-osterreich': 'twitch-osterreich',
                    'tinder-plus-osterreich': 'tinder-plus-osterreich',
                    'tinder-gold-osterreich': 'tinder-gold-osterreich',
                    
                    // Payment Cards Germany
                    'paysafecard': 'paysafecard',
                    'cashlib': 'cashlib',
                    'flexepin': 'flexepin',
                    'jeton-cash': 'jeton-cash',
                    'bitsa': 'bitsa',
                    'aplauz': 'aplauz',
                    'a-bon': 'a-bon',
                    
                    // Austrian Payment Cards
                    'cashlib-osterreich': 'cashlib-osterreich',
                    'flexepin-osterreich': 'flexepin-osterreich',
                    'jeton-cash-oesterreich': 'jeton-cash-oesterreich',
                    'bitsa-oesterreich': 'bitsa-oesterreich',
                    'astropay-oesterreich': 'astropay-oesterreich',
                    'a-bon-osterreich': 'a-bon-osterreich',
                    'paysafecard-at': 'paysafecard-at',
                    'neosurf-at': 'neosurf-at',
                    'transcash-oesterreich': 'transcash-oesterreich',
                    'mifinity': 'mifinity',
                    'mint-prepaid-osterreich': 'mint-prepaid-osterreich',
                    'rewarble': 'rewarble',
                    'pcs-oesterreich': 'pcs-oesterreich',
                    
                    // Communication & Other
                    'libon': 'libon',
                    'eety-guthaben': 'eety-guthaben',
                    'microsoft-geschenkkarte': 'microsoft-geschenkkarte',
                    'microsoft-geschenkkarte-oesterreich': 'microsoft-geschenkkarte-oesterreich',
                    'tiktok-de': 'tiktok-de',
                    
                    // Travel
                    'airbnb': 'airbnb'
                };
                
                const baseName = slugToFile[slug] || slug;
                const fileName = `guthaben.de_${baseName}.html`;

                // Build path relative to current location to work under preview subpaths
                const inDesktop = window.location.pathname.includes('/desktop/');
                const targetPath = inDesktop ? `./${fileName}` : `desktop/${fileName}`;

                window.location.href = targetPath;
            });
        });

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
        const inputEl = getInputEl();
        if (!inputEl) return;
        const wrapper = getWrapperEl(inputEl);
        const isEventOnSearch = (e.target === inputEl) || (wrapper && wrapper.contains(e.target));
        if (!isEventOnSearch) return;
        searchInput = inputEl;
        const query = inputEl.value || '';

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
        console.log('[DEBUG] Focus event on:', e.target);
        const inputEl = getInputEl();
        const wrapper = getWrapperEl(inputEl);
        if (!inputEl) return;
        if (!(e.target === inputEl || (wrapper && wrapper.contains(e.target)))) return;
        searchInput = inputEl;
        console.log('[DEBUG] Calling showOverlay from focus event');
        showOverlay();
        
        // Show popular items immediately on focus when query is short
        const query = inputEl.value || '';
        console.log('[DEBUG] Focus query length:', query.length);
        if (query.length >= 2) {
            const results = searchProducts(query, allProducts);
            showResults(results);
        } else {
            showResults([]);
            isOpen = true;
        }
    });

    // Handle direct input click (guarded)
    const directInputEl = getInputEl();
    if (directInputEl) {
        directInputEl.addEventListener('click', function() {
            console.log('[DEBUG] Direct click on search input');
            showOverlay();
            isOpen = true;
        });
    }

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
                item.style.backgroundColor = '#eff6ff';
                item.style.transform = 'translateY(-1px)';
                item.style.borderColor = '#3b82f6';
                const arrow = item.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(4px)';
            } else {
                item.style.backgroundColor = 'transparent';
                item.style.transform = 'translateY(0px)';
                item.style.borderColor = 'transparent';
                const arrow = item.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(0px)';
            }
        });
    }
});