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
    { name: 'Adidas Geschenkkarte kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_adidas.html' },
    { name: 'Airbnb Guthaben', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_airbnb-osterreich.html' },
    { name: 'Airbnb Gutschein', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_airbnb.html' },
    { name: 'Airbnb Gutschein kaufen', category: 'Services', price: 'ab €100', icon: '🎫', url: 'guthaben.de_airbnb_100-eur.html' },
    { name: 'Aircash A-bon', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_a-bon-osterreich.html' },
    { name: 'Aircash A-bon Prepaid-Code', category: 'Verschiedenes', price: 'ab €10', icon: '🎁', url: 'guthaben.de_a-bon_10-eur.html' },
    { name: 'Aldi Talk aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_aldi-talk-aufladen_15-eur.html' },
    { name: 'Aldi Talk Guthaben aufladen?', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_aldi-talk-aufladen.html' },
    { name: 'Amazon Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_amazon-gutschein.html' },
    { name: 'Amazon Gutschein Kaufen Österreich', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_amazon-gutscheine-oesterreich.html' },
    { name: 'Apex Legends Coins Österreich ab 9.99 €', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_apex-legends-oesterreich.html' },
    { name: 'Aplauz', category: 'Verschiedenes', price: 'ab €10', icon: '🎁', url: 'guthaben.de_aplauz_10-eur.html' },
    { name: 'Aplauz Kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_aplauz.html' },
    { name: 'AstroPay Österreich online kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_astropay-oesterreich.html' },
    { name: 'Ay Yildiz aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_ay-yildiz-aufladen_15-eur.html' },
    { name: 'Ay Yildiz aufladen? Guthaben Code online kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_ay-yildiz-aufladen.html' },
    { name: 'B. free aufladen? Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_b-free-aufladen.html' },
    { name: 'Battle.net', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_battlenet-guthabenkarte-oesterreich.html' },
    { name: 'Battle.net Guthaben kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_battlenet-guthabenkarte.html' },
    { name: 'Beste Wetter-App: Die cleversten Reise-Apps für den Sommer', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_beste-wetter-app-deutschland.html' },
    { name: 'BILDmobil aufladen', category: 'Mobilfunk', price: 'ab €10', icon: '📱', url: 'guthaben.de_bildmobil-aufladen_10-eur.html' },
    { name: 'BILDmobil aufladen? Prepaid karte kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_bildmobil-aufladen.html' },
    { name: 'BITSA', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_bitsa-oesterreich.html' },
    { name: 'BITSA Guthaben aufladen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_bitsa.html' },
    { name: 'BITSA Guthaben kaufen', category: 'Zahlung', price: 'ab €100', icon: '💳', url: 'guthaben.de_bitsa_100-eur.html' },
    { name: 'Blau Guthaben aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_blau-de-aufladen_15-eur.html' },
    { name: 'Blau.de aufladen? Gutschein kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_blau-de-aufladen.html' },
    { name: 'blauworld aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_blauworld-aufladen_15-eur.html' },
    { name: 'Blauworld aufladen? Blauworld Guthaben für 15 €', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_blauworld-aufladen.html' },
    { name: 'bob Wertkarte aufladen? Guthaben kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_bob-wertkarte.html' },
    { name: 'C&amp;A Geschenkgutschein', category: 'Verschiedenes', price: 'ab €100', icon: '🎁', url: 'guthaben.de_ca-geschenkkarte_100-eur.html' },
    { name: 'C&amp;A Geschenkkarte', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_ca-geschenkkarte.html' },
    { name: 'Candy Crush Saga / Candy Crush Soda Kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_candy-crush.html' },
    { name: 'Candy Crush Saga Gutschein', category: 'Verschiedenes', price: 'ab €25', icon: '🎁', url: 'guthaben.de_candy-crush_25-eur.html' },
    { name: 'CASHlib', category: 'Zahlung', price: 'ab €10', icon: '💳', url: 'guthaben.de_cashlib_10-eur.html' },
    { name: 'CASHlib Guthaben', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_cashlib-osterreich.html' },
    { name: 'Cineplex Geschenkgutschein', category: 'Services', price: 'ab €10', icon: '🎫', url: 'guthaben.de_cineplex_10-eur.html' },
    { name: 'Cineplex Gutschein', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_cineplex.html' },
    { name: 'Congstar aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_congstar-aufladen_15-eur.html' },
    { name: 'Congstar prepaid aufladen? Kaufe Congstar Gutschein', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_congstar-aufladen.html' },
    { name: 'Cyberport Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_cyberport.html' },
    { name: 'Darum fragen Shops nach Ihren Daten', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_warum-shops-telefonnummer-adresse-deutschland.html' },
    { name: 'DAZN Gutschein kaufen', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_dazn.html' },
    { name: 'Deezer Premium Geschenkkarte', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_deezer-at.html' },
    { name: 'Die besten Zombie Filme auf Netflix zu Halloween', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_neuigkeiten_die-besten-zombie-filme-netflix.html' },
    { name: 'Disney+ Gutschein', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_disney-plus.html' },
    { name: 'Disney+ Gutscheinkarte', category: 'Streaming', price: 'ab €27', icon: '📺', url: 'guthaben.de_disney-plus_27-eur.html' },
    { name: 'Douglas Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_douglas.html' },
    { name: 'Drei aufladen? Code kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_drei-aufladen.html' },
    { name: 'E-Plus Guthaben aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_e-plus-aufladen_15-eur.html' },
    { name: 'E-Plus Prepaid', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_e-plus-aufladen.html' },
    { name: 'EA FC 26: Wünsche der Community', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_neuigkeiten_ea-fc-26-community-wuensche-deutschland.html' },
    { name: 'EA Origin Guthaben', category: 'Gaming', price: 'ab €15', icon: '🎮', url: 'guthaben.de_ea-game-card_15-eur.html' },
    { name: 'EA Origin Karte online kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_ea-origin-oesterreich.html' },
    { name: 'Eety Guthaben aufladen? Code kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_eety-guthaben.html' },
    { name: 'Einfach Prepaid aufladen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_einfach-prepaid-aufladen.html' },
    { name: 'Elden Ring: Nightreign — das neue Abenteuer 2025', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_elden-ring-nightreign-deutschland.html' },
    { name: 'Eventim Geschenkkarte', category: 'Services', price: 'ab €25', icon: '🎫', url: 'guthaben.de_eventim_25-eur.html' },
    { name: 'Eventim Geschenkkarte online kaufen für 25€', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_eventim.html' },
    { name: 'Festivals 2025: Top Events &amp; Tipps für den Musiksommer', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_festivals-2025-deutschland.html' },
    { name: 'Filme streamen 2025: Die besten Neuheiten für Ihren Sommer', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_filme-streamen-deutschland.html' },
    { name: 'Flexepin kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_flexepin-osterreich.html' },
    { name: 'Flexepin Vouchers', category: 'Zahlung', price: 'ab €10', icon: '💳', url: 'guthaben.de_flexepin_10-eur.html' },
    { name: 'Fonic aufladen? Guthaben online kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_fonic-aufladen.html' },
    { name: 'Fonic Guthaben aufladen', category: 'Mobilfunk', price: 'ab €20', icon: '📱', url: 'guthaben.de_fonic-aufladen_20-eur.html' },
    { name: 'Fortnite Deutschland  Code kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_fortnite.html' },
    { name: 'Fortnite Geschenkkarte', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_fortnite_10-eur.html' },
    { name: 'Free Fire Diamonds Österreich', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_free-fire-osterreich.html' },
    { name: 'Fyve aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_fyve-aufladen_15-eur.html' },
    { name: 'Fyve aufladen? Fyve Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_fyve-aufladen.html' },
    { name: 'Gaming auf Reisen ohne Probleme? Wir zeigen wie!', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_gaming-deutschland.html' },
    { name: 'Georg aufladen? Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_georg-aufladen.html' },
    { name: 'Geschenkgutscheine kaufen Sie online auf Guthaben.de', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_shopping-gutscheine.html' },
    { name: 'Geschenkkarte: Die coole Alternative zum physischen Geschenk', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_geschenkkarte-deutschland.html' },
    { name: 'Google Play Guthaben', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_google-play-guthaben.html' },
    { name: 'Google Play Guthaben Kaufen Österreich', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_google-play-card-oesterreich.html' },
    { name: 'GT Mobile', category: 'Mobilfunk', price: 'ab €40', icon: '📱', url: 'guthaben.de_gt-mobile-aufladen_40-eur.html' },
    { name: 'GT Mobile aufladen? Kaufe online', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_gt-mobile-aufladen.html' },
    { name: 'Guthaben aufladen innerhalb 30 Sekunden auf Guthaben.de', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_.html' },
    { name: 'H&amp;M Geschenkcode', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_h-m-geschenkcode-osterreich.html' },
    { name: 'H&amp;M Gutschein kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_h-m-geschenkcode.html' },
    { name: 'Handy aufladen für jeden Provider auf Guthaben.de', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_handy-aufladen.html' },
    { name: 'Hearthstone Code Österreich', category: 'Gaming', price: 'ab €200', icon: '🎮', url: 'guthaben.de_hearthstone-code-oesterreich_200-eur.html' },
    { name: 'Hearthstone Code Österreich 20 €', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_hearthstone-code-oesterreich.html' },
    { name: 'Hearthstone Gutschein kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_hearthstone-guthabenkarte.html' },
    { name: 'Hearthstone-Gutschein', category: 'Gaming', price: 'ab €20', icon: '🎮', url: 'guthaben.de_hearthstone-guthabenkarte_20-eur.html' },
    { name: 'IKEA Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_ikea.html' },
    { name: 'Ist das Verknüpfen von Kreditkarte und Gaming-Konto sicher?', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_kreditkarte-gaming-verknuepfen-deutschland.html' },
    { name: 'iTunes Karte', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_apple-gift-card.html' },
    { name: 'iTunes Karte Guthaben Österreich', category: 'Apps & Dienste', price: 'ab €10', icon: '📱', url: 'guthaben.de_apple-gift-card-oesterreich.html' },
    { name: 'Jeton Cash', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_jeton-cash.html' },
    { name: 'Jeton Cash kaufen', category: 'Zahlung', price: 'ab €10', icon: '💳', url: 'guthaben.de_jeton-cash_10-eur.html' },
    { name: 'JetonCash Österreich online kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_jeton-cash-oesterreich.html' },
    { name: 'Jochen Schweizer Geschenkkarte', category: 'Services', price: 'ab €100', icon: '🎫', url: 'guthaben.de_jochen-schweizer_100-eur.html' },
    { name: 'Jochen Schweizer Gutschein kaufen', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_jochen-schweizer.html' },
    { name: 'Just a moment...', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_kundenservice.html' },
    { name: 'Kaufe Aircash A-bon', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_a-bon.html' },
    { name: 'Kaufen Sie ihre Entertainment gift cards online auf Guthaben.de', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_entertainment-cards.html' },
    { name: 'Kaufen Sie ihre Gamecards Prepaid online auf Guthaben.de', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_gamecards.html' },
    { name: 'Klarmobil aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_klarmobil-aufladen_15-eur.html' },
    { name: 'Klarmobil aufladen?', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_klarmobil-aufladen.html' },
    { name: 'Kobo Guthaben', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_kobo-osterreich.html' },
    { name: 'Können Spielehersteller sehen, was ich online mache?', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_spielverhalten-tracking-games-deutschland.html' },
    { name: 'League of Legends Riot Points', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points_10-eur.html' },
    { name: 'Lebara aufladen Code', category: 'Mobilfunk', price: 'ab €10', icon: '📱', url: 'guthaben.de_lebara-aufladen_10-eur.html' },
    { name: 'Lebara aufladen Code-Guthaben € online kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_lebara-aufladen_data-l.html' },
    { name: 'Lebara aufladen?', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_lebara-aufladen.html' },
    { name: 'Libon', category: 'Verschiedenes', price: 'ab €10', icon: '🎁', url: 'guthaben.de_libon_10-eur.html' },
    { name: 'Libon Code online kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_libon.html' },
    { name: 'Lieferando Guthaben', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_lieferando-osterreich.html' },
    { name: 'Lieferando Gutschein', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_lieferando.html' },
    { name: 'Lieferando Gutschein kaufen', category: 'Services', price: 'ab €100', icon: '🎫', url: 'guthaben.de_lieferando_100-eur.html' },
    { name: 'Lifecell', category: 'Verschiedenes', price: 'ab €15', icon: '🎁', url: 'guthaben.de_lifecell_15-eur.html' },
    { name: 'Lifecell Deutschland Code kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_lifecell.html' },
    { name: 'Lucky Deals', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_luckydeal.html' },
    { name: 'Lush Gutschein code kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_lush.html' },
    { name: 'Lush Gutschein kaufen', category: 'Shopping', price: 'ab €10', icon: '🛒', url: 'guthaben.de_lush_10-eur.html' },
    { name: 'Lycamobile aufladen', category: 'Mobilfunk', price: 'ab €10', icon: '📱', url: 'guthaben.de_lycamobile-aufladen_10-eur.html' },
    { name: 'Lycamobile aufladen-Guthaben € online kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_lycamobile-aufladen_lyca-flat.html' },
    { name: 'Lycamobile aufladen? Lycamobile Guthaben', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_lycamobile-aufladen.html' },
    { name: 'Lycamobile Guthaben? Code kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_lycamobile-oesterreich.html' },
    { name: 'M:tel Guthaben', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_mtel.html' },
    { name: 'Magenta Klax aufladen? Code kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_klax-aufladen.html' },
    { name: 'Mango Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_mango-osterreich.html' },
    { name: 'Mediamarkt Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_mediamarkt.html' },
    { name: 'Mediamarkt Gutschein kaufen', category: 'Shopping', price: 'ab €10', icon: '🛒', url: 'guthaben.de_mediamarkt_10-eur.html' },
    { name: 'Meta Quest Deutschland  Gutschein kaufen', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_meta-quest.html' },
    { name: 'Meta Quest Geschenkkarte', category: 'Apps & Dienste', price: 'ab €100', icon: '📱', url: 'guthaben.de_meta-quest_100-eur.html' },
    { name: 'Microsoft Geschenkkarte', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_microsoft-geschenkkarte.html' },
    { name: 'Microsoft Geschenkkarte Österreich', category: 'Apps & Dienste', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_microsoft-geschenkkarte-oesterreich.html' },
    { name: 'MiFinity Voucher kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_mifinity.html' },
    { name: 'MINT Prepaid Karte', category: 'Mobilfunk', price: 'ab €10', icon: '📱', url: 'guthaben.de_mint-prepaid_10-eur.html' },
    { name: 'MINT Prepaid Kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_mint-prepaid-osterreich.html' },
    { name: 'Mobi aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_mobi-aufladen_15-eur.html' },
    { name: 'Mobi aufladen? Kaufe online für 15 €', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_mobi-aufladen.html' },
    { name: 'Mobile Daten im Ausland clever nutzen: Tipps &amp; Sicherheit', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_neuigkeiten_mobile-daten-deutschland-reisen.html' },
    { name: 'MT Games kaufen ohne persönliche Daten', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_games-kaufen-ohne-persoenliche-daten-deutschland.html' },
    { name: 'MT Privatsphäre beim Gamen: So spielen Sie sicher', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_online-privatsphaere-gaming-2025-deutschland.html' },
    { name: 'Neosurf Ticket kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_neosurf-at.html' },
    { name: 'Netflix aufladen?', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_netflix-geschenkkarte.html' },
    { name: 'Netflix Gutschein kaufen', category: 'Streaming', price: 'ab €100', icon: '📺', url: 'guthaben.de_netflix-geschenkkarte_100-eur.html' },
    { name: 'Netflix Gutschein Kaufen Österreich', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_netflix-gutschein-oesterreich.html' },
    { name: 'NettoKOM aufladen? Kaufe Handy Guthaben für 15 €', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_nettokom-aufladen.html' },
    { name: 'Nettokom Guthaben aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_nettokom-aufladen_15-eur.html' },
    { name: 'Netzclub aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_netzclub-aufladen_15-eur.html' },
    { name: 'Netzclub aufladen? Kaufe online', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_netzclub-aufladen.html' },
    { name: 'Neuigkeiten', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten.html' },
    { name: 'Nicht verpassen: Die 5 besten Dokumentationen auf Netflix', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_neuigkeiten_5-besten-dokumentationen-auf-netflix.html' },
    { name: 'Nike Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_nike-osterreich.html' },
    { name: 'Nike Gutschein Code', category: 'Shopping', price: 'ab €100', icon: '🛒', url: 'guthaben.de_nike-gutscheincode_100-eur.html' },
    { name: 'Nike Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_nike-gutscheincode.html' },
    { name: 'Nintendo bringt neue Switch 2 auf den Markt', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_neuigkeiten_nintendo-switch-2-deutschland.html' },
    { name: 'Nintendo eShop Card', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card.html' },
    { name: 'Nintendo eShop Card Österreich', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card-oesterreich.html' },
    { name: 'Nintendo eShop Guthaben Österreich', category: 'Gaming', price: 'ab €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card-oesterreich_100-eur.html' },
    { name: 'Nintendo Switch Online', category: 'Gaming', price: 'ab €12', icon: '🎮', url: 'guthaben.de_nintendo-switch-online_12-monate.html' },
    { name: 'Nintendo Switch Online Mitgliedschaft kaufen ab 7,99 €', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_nintendo-switch-online.html' },
    { name: 'Nintendo Switch-Spiele', category: 'Gaming', price: 'ab €29', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele_29-99-eur.html' },
    { name: 'Nintendo Switch-Spiele-Guthaben € online kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele_animal-crossing.html' },
    { name: 'Nintendo Switch-Spiele? Code kaufen ab 59,99 €', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele.html' },
    { name: 'O2 Guthaben aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_o2-aufladen_15-eur.html' },
    { name: 'O2 Guthaben aufladen? O2 Gutschein', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_o2-aufladen.html' },
    { name: 'Origin Guthaben? Kaufe EA Origin Gutschein online', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_ea-game-card.html' },
    { name: 'Ortel aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_ortel-mobile-aufladen_15-eur.html' },
    { name: 'Ortel Mobile Aufladen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_ortel-mobile-aufladen.html' },
    { name: 'otelo aufladen? otelo Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_otelo-aufladen.html' },
    { name: 'otelo Guthaben aufladen', category: 'Mobilfunk', price: 'ab €19', icon: '📱', url: 'guthaben.de_otelo-aufladen_19-eur.html' },
    { name: 'Otto Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_otto-gutscheincode.html' },
    { name: 'PaysafeCard online kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_paysafecard-at.html' },
    { name: 'PaysafeCard Onlline Kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_paysafecard.html' },
    { name: 'PaysafeCard Players Pass', category: 'Zahlung', price: 'ab €10', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_10-eur.html' },
    { name: 'PaysafeCard Players Pass DE Code kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_paysafecard-players-pass.html' },
    { name: 'PCS Mastercard Deutschland', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_pcs.html' },
    { name: 'PCS Mastercard kaufen', category: 'Zahlung', price: 'ab €100', icon: '💳', url: 'guthaben.de_pcs_100-eur.html' },
    { name: 'PCS online kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_pcs-oesterreich.html' },
    { name: 'Playstation Plus', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft.html' },
    { name: 'PlayStation Plus Mitgliedschaft', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_10-eur.html' },
    { name: 'PlayStation Plus online kaufen ab 3 Monate', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich.html' },
    { name: 'Prepaid Kreditkarten und', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_neuigkeiten_neosurf-deutschland-oesterreich-guthabenkarten.html' },
    { name: 'PSN Guthaben', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_psn-card.html' },
    { name: 'PSN Guthaben Österreich kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_psn-card-oesterreich.html' },
    { name: 'PUBG Mobile UC', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_pubg-us_10-usd.html' },
    { name: 'PUBG Mobile UC kaufen ab 10 USD', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_pubg-us.html' },
    { name: 'Razer Gold Card', category: 'Verschiedenes', price: 'ab €10', icon: '🎁', url: 'guthaben.de_razer-gold_10-eur.html' },
    { name: 'Razer Gold Card kaufen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_razer-gold.html' },
    { name: 'Razer Gold Guthaben', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_razer-gold-osterreich.html' },
    { name: 'Rewarble Advanced Cash', category: 'Zahlung', price: 'ab €10', icon: '💳', url: 'guthaben.de_rewarble-advanced_10-eur.html' },
    { name: 'Rewarble Advanced Cash Kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_rewarble-advanced.html' },
    { name: 'Rewarble Perfect Money Kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_rewarble-perfect-money-osterreich.html' },
    { name: 'Richten Sie die Kindersicherung auf Ihrem Smartphone ein met Lebara Kinder', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_kindersicherung-basics.html' },
    { name: 'Riot Points', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points.html' },
    { name: 'Riot Points League of Legends Österreich', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_riot-points-oesterreich.html' },
    { name: 'Roblox Gutschein Code', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_roblox-gift-card_10-eur.html' },
    { name: 'Roblox Karte', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_roblox-gift-card.html' },
    { name: 'Rossmann Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_rossmann.html' },
    { name: 'Rossmann Mobil', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_rossmann-mobil-aufladen_15-eur.html' },
    { name: 'Rossmann Mobil aufladen? Kaufe online', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_rossmann-mobil-aufladen.html' },
    { name: 'RuneScape Mitgliedschaft Österreich 7,49 €', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_runescape-mitgliedschaft-oesterreich.html' },
    { name: 'Saturn Gutscheinkarte', category: 'Shopping', price: 'ab €100', icon: '🛒', url: 'guthaben.de_saturn_100-eur.html' },
    { name: 'Saturn Online Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_saturn.html' },
    { name: 'Simyo', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_simyo_15-eur.html' },
    { name: 'Simyo aufladen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_simyo.html' },
    { name: 'Sind Ihre Gaming-Daten wirklich sicher?', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_gaming-daten-sicherheit-deutschland.html' },
    { name: 'Sitemap', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_sitemap.html' },
    { name: 'Sparen Sie Zeit mit der Guthaben.de App', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_app.html' },
    { name: 'Spiele online kaufen ohne Konto zu erstellen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_spiele-online-kaufen-ohne-konto-deutschland.html' },
    { name: 'Spotify Gutschein', category: 'Streaming', price: 'ab €10', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich_10-euro.html' },
    { name: 'Spotify Premium', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_spotify-premium.html' },
    { name: 'Spotify Premium Gutschein', category: 'Streaming', price: 'ab €10', icon: '📺', url: 'guthaben.de_spotify-premium_10-eur.html' },
    { name: 'Spotify Premium Gutschein Österreich', category: 'Streaming', price: 'Preis variiert', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich.html' },
    { name: 'Steam Guthaben Kaufen', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_steam_10-eur.html' },
    { name: 'Steam Guthaben Österreich', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_steam-oesterreich_10-eur.html' },
    { name: 'Steam Gutschein kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_steam.html' },
    { name: 'Steam Gutschein Kaufen Österreich', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_steam-oesterreich.html' },
    { name: 'Tchibo Gutschein', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_tchibo.html' },
    { name: 'Tchibo Gutschein kaufen', category: 'Shopping', price: 'ab €10', icon: '🛒', url: 'guthaben.de_tchibo_10-eur.html' },
    { name: 'Telekom Guthaben aufladen', category: 'Mobilfunk', price: 'ab €10', icon: '📱', url: 'guthaben.de_telekom_10-eur.html' },
    { name: 'Telekom prepaid aufladen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_telekom.html' },
    { name: 'Ticketmaster Gutschein', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_ticketmaster.html' },
    { name: 'TikTok Deutschland  Code kaufen', category: 'Social Media', price: 'Preis variiert', icon: '💬', url: 'guthaben.de_tiktok-de.html' },
    { name: 'TikTok Gift Card', category: 'Social Media', price: 'ab €15', icon: '💬', url: 'guthaben.de_tiktok-de_15-eur.html' },
    { name: 'Tinder Gold', category: 'Verschiedenes', price: 'ab €13', icon: '🎁', url: 'guthaben.de_tinder-gold_13-eur.html' },
    { name: 'Tinder Gold Abonnement Kaufen ab 12.85 €', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_tinder-gold-osterreich.html' },
    { name: 'Tinder Plus', category: 'Verschiedenes', price: 'ab €10', icon: '🎁', url: 'guthaben.de_tinder-plus_10-eur.html' },
    { name: 'Tinder Plus Abonnement Kaufen ab 9.99 €', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_tinder-plus-osterreich.html' },
    { name: 'TK Maxx Gutschein kaufen', category: 'Shopping', price: 'ab €100', icon: '🛒', url: 'guthaben.de_tk-maxx_100-eur.html' },
    { name: 'TK Maxx Gutschein online kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_tk-maxx.html' },
    { name: 'Toneo First Mastercard', category: 'Zahlung', price: 'ab €100', icon: '💳', url: 'guthaben.de_toneo-first_100-eur.html' },
    { name: 'Toneo First Mastercard online kaufen ab 7.50 €', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_toneo-first.html' },
    { name: 'Transcash Guthaben', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_transcash.html' },
    { name: 'Transcash online kaufen', category: 'Zahlung', price: 'Preis variiert', icon: '💳', url: 'guthaben.de_transcash-oesterreich.html' },
    { name: 'Transcash Ticket kaufen', category: 'Zahlung', price: 'ab €100', icon: '💳', url: 'guthaben.de_transcash_100-eur.html' },
    { name: 'Treatwell Gutschein', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_treatwell-osterreich.html' },
    { name: 'Treatwell Gutscheinkarte', category: 'Verschiedenes', price: 'ab €100', icon: '🎁', url: 'guthaben.de_treatwell_100-eur.html' },
    { name: 'Türk Telekom aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_turk-telekom-aufladen_15-eur.html' },
    { name: 'Türk Telekom aufladen? Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_turk-telekom-aufladen.html' },
    { name: 'TV Now Guthaben', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_tvnow.html' },
    { name: 'TV Now RTL+', category: 'Verschiedenes', price: 'ab €15', icon: '🎁', url: 'guthaben.de_tvnow_15-eur.html' },
    { name: 'Twitch Guthaben', category: 'Social Media', price: 'Preis variiert', icon: '💬', url: 'guthaben.de_twitch-osterreich.html' },
    { name: 'Twitch Gutschein', category: 'Social Media', price: 'ab €100', icon: '💬', url: 'guthaben.de_twitch-geschenkkarte_100-eur.html' },
    { name: 'Twitch Gutschein kaufen', category: 'Social Media', price: 'Preis variiert', icon: '💬', url: 'guthaben.de_twitch-geschenkkarte.html' },
    { name: 'Uber Gutschein', category: 'Services', price: 'Preis variiert', icon: '🎫', url: 'guthaben.de_uber.html' },
    { name: 'Uber Gutschein kaufen', category: 'Services', price: 'ab €100', icon: '🎫', url: 'guthaben.de_uber_100-eur.html' },
    { name: 'Umweltfreundlich reisen: Die besten Ziele in Deutschland', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_umweltfreundlich-reisen-in-deutschland.html' },
    { name: 'Valorant Points', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_valorant.html' },
    { name: 'Vodafone aufladen?', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_vodafone-aufladen.html' },
    { name: 'Vodafone Prepaid aufladen', category: 'Mobilfunk', price: 'ab €15', icon: '📱', url: 'guthaben.de_vodafone-aufladen_15-eur.html' },
    { name: 'Warum Sie eine separate Gaming E-Mail brauchen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_separate-email-gaming-deutschland.html' },
    { name: 'Webseitenfunktion', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_webseitenfunktion.html' },
    { name: 'Welche Daten sammelt Ihr Game Store?', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_informationen-game-store-daten-deutschland.html' },
    { name: 'Wellness: Erreichen Sie Ihre Ziele mit diesen smarten Trends', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_wellness-gesund-leben-gesundheit.html' },
    { name: 'Wer wir sind', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_ueber-uns.html' },
    { name: 'Widerrufsrecht', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_widerrufsrecht.html' },
    { name: 'Wo bleibt GTA 6? Release, Gerüchte &amp; Infos', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_neuigkeiten_gta-6-release-geruechte-rockstar-deutschland.html' },
    { name: 'WoW Gamecard', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_wow-gamecard.html' },
    { name: 'WoW Gamecard 60 Tage online kaufen', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_wow-gamecard-oesterreich.html' },
    { name: 'WOWWW! Guthaben', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_wowww-aufladen.html' },
    { name: 'Xbox Game Pass', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_xbox-game-pass_10-eur.html' },
    { name: 'Xbox Game Pass? Kaufen Sie ihren Code ab 9,99 €', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_xbox-game-pass-oesterreich.html' },
    { name: 'Xbox Gift Card Österreich', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_xbox-gift-card-oesterreich.html' },
    { name: 'Xbox Guthaben', category: 'Gaming', price: 'ab €10', icon: '🎮', url: 'guthaben.de_xbox-gift-card_10-eur.html' },
    { name: 'Xbox Guthaben aufladen?', category: 'Gaming', price: 'Preis variiert', icon: '🎮', url: 'guthaben.de_xbox-gift-card.html' },
    { name: 'Yesss aufladen? Guthaben kaufen', category: 'Mobilfunk', price: 'Preis variiert', icon: '📱', url: 'guthaben.de_yesss-aufladen.html' },
    { name: 'Yooopi Guthaben', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_yooopi.html' },
    { name: 'Zahlungsmethoden – Sicher Bezahlen', category: 'Verschiedenes', price: 'Preis variiert', icon: '🎁', url: 'guthaben.de_zahlungsmethoden.html' },
    { name: 'Zalando Gutschein kaufen', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_zalando-gutscheincode.html' },
    { name: 'Zalando Gutschein Österreich', category: 'Shopping', price: 'Preis variiert', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich.html' }
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
                       document.querySelector('.MuiAutocomplete-input, .MuiInputBase-input, input[type="search"]') ||
                       document.querySelector('[role="combobox"]') ||
                       document.querySelector('input[placeholder*="Suche"], input[placeholder*="Such"], input[placeholder*="Search"]');
    if (!searchInput) return;
    if (!searchInput.id) searchInput.id = 'search-field-input';
    try { console.log('[UniversalSearch/Desktop] bound to input', searchInput); } catch(_) {}

    
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
        
      try { console.log('[UniversalSearch/Desktop] query', query, 'results', filtered.length); } catch(_) {}
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
                    document.querySelector('.MuiAutocomplete-input, .MuiInputBase-input, input[type="search"]') ||
                    document.querySelector('[role="combobox"]') ||
                    document.querySelector('input[placeholder*="Suche"], input[placeholder*="Such"], input[placeholder*="Search"]');
      if (input) {
        if (!input.id) input.id = 'search-field-input';
        clearInterval(timer);
        initSearch();
        try { console.log('[UniversalSearch/Desktop] input detected, initialized'); } catch(_) {}

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