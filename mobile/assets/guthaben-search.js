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
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        max-height: 500px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
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
    { name: 'Google Play', category: 'Apps & Games', price: '€10 - €100', icon: '📱', url: 'guthaben.de_google-play-card-oesterreich.html' },
    { name: 'iTunes Karte', category: 'Apps & Games', price: '€10 - €100', icon: '📱', url: 'guthaben.de_apple-gift-card-oesterreich.html' },
    { name: 'Fortnite Deutschland', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_10-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_100-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €125 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_125-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €150 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_150-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_25-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_50-eur.html' },
    { name: 'Fortnite Geschenkkarte-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_fortnite_75-eur.html' },
    { name: 'League of Legends Riot Points-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points_10-eur.html' },
    { name: 'League of Legends Riot Points-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points_20-eur.html' },
    { name: 'Nintendo bringt neue Switch 2 auf den Markt', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_neuigkeiten_nintendo-switch-2-deutschland.html' },
    { name: 'Nintendo eShop', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card-oesterreich_100-eur.html' },
    { name: 'Nintendo eShop Card', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card.html' },
    { name: 'Nintendo eShop Card-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card_100-eur.html' },
    { name: 'Nintendo eShop Card-Guthaben €15 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card_15-eur.html' },
    { name: 'Nintendo eShop Card-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card_25-eur.html' },
    { name: 'Nintendo eShop Card-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card_50-eur.html' },
    { name: 'Nintendo eShop Card-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-eshop-card_75-eur.html' },
    { name: 'Nintendo Switch Online Mitgliedschaft', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-online.html' },
    { name: 'Nintendo Switch Online-Guthaben €12 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-online_12-monate.html' },
    { name: 'Nintendo Switch Online-Guthaben €3 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-online_3-monate.html' },
    { name: 'Nintendo Switch-Spiele-Guthaben € online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele_animal-crossing.html' },
    { name: 'Nintendo Switch-Spiele-Guthaben €29 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele_29-99-eur.html' },
    { name: 'Nintendo Switch-Spiele-Guthaben €70 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele_70-eur.html' },
    { name: 'Nintendo Switch-Spiele?', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_nintendo-switch-spiele.html' },
    { name: 'Playstation Plus', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_10-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_100-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €150 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich_150-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_20-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €200 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich_200-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_25-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €250 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich_250-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €30 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_30-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €40 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_40-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_50-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €60 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_60-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft_75-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €750 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich_750-eur.html' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €80 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich_80-eur.html' },
    { name: 'PlayStation Plus online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_playstation-plus-mitgliedschaft-oesterreich.html' },
    { name: 'Riot Points', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_league-of-legends-riot-points.html' },
    { name: 'Roblox Gutschein', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_roblox-gift-card_10-eur.html' },
    { name: 'Roblox Karte', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_roblox-gift-card.html' },
    { name: 'Steam', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_steam_10-eur.html' },
    { name: 'Steam Gutschein', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_steam-oesterreich.html' },
    { name: 'Valorant Points', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_valorant.html' },
    { name: 'Valorant Points-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_valorant_10-eur.html' },
    { name: 'Valorant Points-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_valorant_20-eur.html' },
    { name: 'Xbox', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-gift-card-oesterreich.html' },
    { name: 'Xbox Game Pass', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass.html' },
    { name: 'Xbox Game Pass -Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_10-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_100-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €15 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_15-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_25-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €30 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_30-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €5 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_5-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_50-eur.html' },
    { name: 'Xbox Game Pass -Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass_75-eur.html' },
    { name: 'Xbox Game Pass?', category: 'Gaming', price: '€10 - €100', icon: '🎮', url: 'guthaben.de_xbox-game-pass-oesterreich.html' },
    { name: 'Aldi Talk', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_aldi-talk-aufladen.html' },
    { name: 'BILDmobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_bildmobil-aufladen.html' },
    { name: 'Congstar', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_congstar-aufladen_15-eur.html' },
    { name: 'Congstar prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_congstar-aufladen.html' },
    { name: 'GT Mobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_gt-mobile-aufladen.html' },
    { name: 'GT Mobile-Guthaben €40 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_gt-mobile-aufladen_40-eur.html' },
    { name: 'GT Mobile-Guthaben €5 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_gt-mobile-aufladen_5-eur.html' },
    { name: 'Klarmobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_klarmobil-aufladen.html' },
    { name: 'Lebara', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lebara-aufladen.html' },
    { name: 'Lifecell Deutschland', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lifecell.html' },
    { name: 'Lifecell-Guthaben €15 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lifecell_15-eur.html' },
    { name: 'Lifecell-Guthaben €30 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lifecell_30-eur.html' },
    { name: 'Lifecell-Guthaben €5 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lifecell_5-eur.html' },
    { name: 'Lycamobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_lycamobile-aufladen.html' },
    { name: 'Mobi', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_mobi-aufladen.html' },
    { name: 'O2', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_o2-aufladen.html' },
    { name: 'Ortel', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_ortel-mobile-aufladen_15-eur.html' },
    { name: 'Ortel Mobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_ortel-mobile-aufladen.html' },
    { name: 'Rossmann Mobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_rossmann-mobil-aufladen.html' },
    { name: 'Rossmann Mobil-Guthaben €15 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_rossmann-mobil-aufladen_15-eur.html' },
    { name: 'Rossmann Mobil-Guthaben €25 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_rossmann-mobil-aufladen_25-eur.html' },
    { name: 'Telekom', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_telekom_10-eur.html' },
    { name: 'Telekom prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_telekom.html' },
    { name: 'Türk Telekom', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_turk-telekom-aufladen.html' },
    { name: 'Vodafone', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_vodafone-aufladen.html' },
    { name: 'Vodafone Prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱', url: 'guthaben.de_vodafone-aufladen_15-eur.html' },
    { name: 'Amazon Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_amazon-gutschein.html' },
    { name: 'IKEA Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_ikea.html' },
    { name: 'Mediamarkt Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_mediamarkt.html' },
    { name: 'Zalando Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutscheincode.html' },
    { name: 'Zalando Gutschein Österreich-Guthaben €10 online', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich_10-euro.html' },
    { name: 'Zalando Gutschein Österreich-Guthaben €15 online', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich_15-euro.html' },
    { name: 'Zalando Gutschein Österreich-Guthaben €20 online', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich_20-euro.html' },
    { name: 'Zalando Gutschein Österreich-Guthaben €25 online', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich_25-euro.html' },
    { name: 'Zalando Gutschein Österreich-Guthaben €50 online', category: 'Shopping', price: '€10 - €100', icon: '🛒', url: 'guthaben.de_zalando-gutschein-oesterreich_50-euro.html' },
    { name: 'Adidas Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_adidas.html' },
    { name: 'Airbnb', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_airbnb-osterreich.html' },
    { name: 'Airbnb Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_airbnb.html' },
    { name: 'Aircash A-bon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon-osterreich.html' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_10-eur.html' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_20-eur.html' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_25-eur.html' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_5-eur.html' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_50-eur.html' },
    { name: 'Apex Legends Coins Österreich ab 9.99 €', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_apex-legends-oesterreich.html' },
    { name: 'Aplauz', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_aplauz.html' },
    { name: 'Aplauz-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_aplauz_10-eur.html' },
    { name: 'Aplauz-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_aplauz_100-eur.html' },
    { name: 'Aplauz-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_aplauz_25-eur.html' },
    { name: 'Aplauz-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_aplauz_50-eur.html' },
    { name: 'AstroPay Österreich online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_astropay-oesterreich.html' },
    { name: 'Ay Yildiz', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ay-yildiz-aufladen.html' },
    { name: 'B. free', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_b-free-aufladen.html' },
    { name: 'Battle.net', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_battlenet-guthabenkarte-oesterreich.html' },
    { name: 'BITSA', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_bitsa-oesterreich.html' },
    { name: 'Blau', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_blau-de-aufladen_15-eur.html' },
    { name: 'Blau.de', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_blau-de-aufladen.html' },
    { name: 'blauworld', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_blauworld-aufladen_15-eur.html' },
    { name: 'Blauworld', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_blauworld-aufladen.html' },
    { name: 'bob Wertkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_bob-wertkarte.html' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte_100-eur.html' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte_15-eur.html' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte_150-eur.html' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte_25-eur.html' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte_50-eur.html' },
    { name: 'C&amp;A Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ca-geschenkkarte.html' },
    { name: 'Candy Crush Saga / Candy Crush Soda', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_candy-crush.html' },
    { name: 'Candy Crush Saga Gutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_candy-crush_25-eur.html' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cineplex_10-eur.html' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cineplex_15-eur.html' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cineplex_20-eur.html' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cineplex_25-eur.html' },
    { name: 'Cineplex Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cineplex.html' },
    { name: 'Cookie-Erklärung -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cookie-hinweis.html' },
    { name: 'Cyberport Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cyberport.html' },
    { name: 'Cyberport Gutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_cyberport_100-eur.html' },
    { name: 'Darum fragen Shops nach Ihren Daten', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_warum-shops-telefonnummer-adresse-deutschland.html' },
    { name: 'Datenschutzerklärung -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_datenschutzerklaerung.html' },
    { name: 'DAZN Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_dazn.html' },
    { name: 'Deezer Premium Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_deezer-at.html' },
    { name: 'Douglas Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_douglas.html' },
    { name: 'Drei', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_drei-aufladen.html' },
    { name: 'E-Plus', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_e-plus-aufladen_15-eur.html' },
    { name: 'E-Plus Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_e-plus-aufladen.html' },
    { name: 'EA FC 26: Wünsche der Community', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_ea-fc-26-community-wuensche-deutschland.html' },
    { name: 'EA Origin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ea-game-card_15-eur.html' },
    { name: 'EA Origin Karte online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ea-origin-oesterreich.html' },
    { name: 'Eety', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_eety-guthaben.html' },
    { name: 'Einfach Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_einfach-prepaid-aufladen.html' },
    { name: 'Eventim Geschenkkarte online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_eventim.html' },
    { name: 'Eventim Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_eventim_25-eur.html' },
    { name: 'Fehler -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon_faq.guthaben.de_hc_de.html' },
    { name: 'Flexepin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin-osterreich.html' },
    { name: 'Flexepin Vouchers-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_10-eur.html' },
    { name: 'Flexepin Vouchers-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_100-eur.html' },
    { name: 'Flexepin Vouchers-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_150-eur.html' },
    { name: 'Flexepin Vouchers-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_20-eur.html' },
    { name: 'Flexepin Vouchers-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_30-eur.html' },
    { name: 'Flexepin Vouchers-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_flexepin_50-eur.html' },
    { name: 'Fonic', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_fonic-aufladen.html' },
    { name: 'Free Fire Diamonds Österreich', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_free-fire-osterreich.html' },
    { name: 'Fyve', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_fyve-aufladen.html' },
    { name: 'Georg', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_georg-aufladen.html' },
    { name: 'Geschenkgutscheine', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_shopping-gutscheine.html' },
    { name: 'Guthaben', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_.html' },
    { name: 'H&amp;M Geschenkcode', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_h-m-geschenkcode-osterreich.html' },
    { name: 'H&amp;M Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_h-m-geschenkcode.html' },
    { name: 'Handy', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_handy-aufladen.html' },
    { name: 'Hearthstone', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_hearthstone-code-oesterreich.html' },
    { name: 'Hearthstone Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_hearthstone-guthabenkarte.html' },
    { name: 'Hearthstone-Gutschein-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_hearthstone-guthabenkarte_20-eur.html' },
    { name: 'Hearthstone-Gutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_hearthstone-guthabenkarte_50-eur.html' },
    { name: 'Impressum -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_impressum.html' },
    { name: 'Jeton Cash', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_jeton-cash.html' },
    { name: 'JetonCash Österreich online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_jeton-cash-oesterreich.html' },
    { name: 'Jochen Schweizer Geschenkkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_jochen-schweizer_100-eur.html' },
    { name: 'Jochen Schweizer Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_jochen-schweizer_50-eur.html' },
    { name: 'Jochen Schweizer Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_jochen-schweizer.html' },
    { name: 'Kaufe Aircash A-bon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_a-bon.html' },
    { name: 'Kaufen Sie ihre Entertainment', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_entertainment-cards.html' },
    { name: 'Kaufen Sie ihre Gamecards Prepaid online auf', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_gamecards.html' },
    { name: 'Kobo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_kobo-osterreich.html' },
    { name: 'Libon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_libon.html' },
    { name: 'Libon-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_libon_10-eur.html' },
    { name: 'Libon-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_libon_20-eur.html' },
    { name: 'Libon-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_libon_5-eur.html' },
    { name: 'Lieferando', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_lieferando-osterreich.html' },
    { name: 'Lieferando Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_lieferando.html' },
    { name: 'Lush Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_lush.html' },
    { name: 'M:tel', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mtel.html' },
    { name: 'Magenta Klax', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_klax-aufladen.html' },
    { name: 'Mango Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mango-osterreich.html' },
    { name: 'Meta Quest Deutschland  Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest.html' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest_100-eur.html' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest_15-eur.html' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest_25-eur.html' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest_50-eur.html' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_meta-quest_75-eur.html' },
    { name: 'Microsoft Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte.html' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte-oesterreich_10-euro.html' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte-oesterreich_15-euro.html' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte-oesterreich_25-euro.html' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte-oesterreich_50-euro.html' },
    { name: 'Microsoft Geschenkkarte-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte_10-eur.html' },
    { name: 'Microsoft Geschenkkarte-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte_15-eur.html' },
    { name: 'Microsoft Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte_25-eur.html' },
    { name: 'Microsoft Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_microsoft-geschenkkarte_50-eur.html' },
    { name: 'MiFinity Voucher', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mifinity.html' },
    { name: 'MINT Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mint-prepaid-osterreich.html' },
    { name: 'MINT Prepaid Karte-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mint-prepaid_10-eur.html' },
    { name: 'MINT Prepaid Karte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mint-prepaid_100-eur.html' },
    { name: 'MINT Prepaid Karte-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mint-prepaid_20-eur.html' },
    { name: 'MINT Prepaid Karte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_mint-prepaid_50-eur.html' },
    { name: 'MT Games', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_games-kaufen-ohne-persoenliche-daten-deutschland.html' },
    { name: 'MT Privatsphäre beim Gamen: So spielen Sie sicher', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_online-privatsphaere-gaming-2025-deutschland.html' },
    { name: 'Nettokom', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_nettokom-aufladen_15-eur.html' },
    { name: 'NettoKOM', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_nettokom-aufladen.html' },
    { name: 'Netzclub', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_netzclub-aufladen.html' },
    { name: 'Neuigkeiten -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten.html' },
    { name: 'Nike Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_nike-gutscheincode.html' },
    { name: 'Origin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ea-game-card.html' },
    { name: 'otelo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_otelo-aufladen.html' },
    { name: 'Otto Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_otto-gutscheincode.html' },
    { name: 'PCS Mastercard', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pcs_100-eur.html' },
    { name: 'PCS Mastercard Deutschland', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pcs.html' },
    { name: 'PCS online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pcs-oesterreich.html' },
    { name: 'PSN', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_psn-card-oesterreich.html' },
    { name: 'PUBG Mobile UC', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pubg-us.html' },
    { name: 'PUBG Mobile UC -Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pubg-us_10-usd.html' },
    { name: 'PUBG Mobile UC -Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pubg-us_5-usd.html' },
    { name: 'PUBG Mobile UC -Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_pubg-us_50-usd.html' },
    { name: 'Razer Gold', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold-osterreich.html' },
    { name: 'Razer Gold Card', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold.html' },
    { name: 'Razer Gold Card-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_10-eur.html' },
    { name: 'Razer Gold Card-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_100-eur.html' },
    { name: 'Razer Gold Card-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_20-usd.html' },
    { name: 'Razer Gold Card-Guthaben €200 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_200-usd.html' },
    { name: 'Razer Gold Card-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_25-eur.html' },
    { name: 'Razer Gold Card-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_5-eur.html' },
    { name: 'Razer Gold Card-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_razer-gold_50-eur.html' },
    { name: 'Rewarble Advanced Cash', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rewarble-advanced.html' },
    { name: 'Rewarble Advanced Cash-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rewarble-advanced_10-eur.html' },
    { name: 'Rewarble Advanced Cash-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rewarble-advanced_30-eur.html' },
    { name: 'Rewarble Advanced Cash-Guthaben €60 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rewarble-advanced_60-eur.html' },
    { name: 'Rewarble Perfect Money', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rewarble-perfect-money-osterreich.html' },
    { name: 'Rossmann Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_rossmann.html' },
    { name: 'RuneScape Mitgliedschaft Österreich 7,49 €', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_runescape-mitgliedschaft-oesterreich.html' },
    { name: 'Saturn Gutscheinkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_saturn_100-eur.html' },
    { name: 'Saturn Gutscheinkarte-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_saturn_150-eur.html' },
    { name: 'Saturn Online Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_saturn.html' },
    { name: 'Simyo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_simyo.html' },
    { name: 'Simyo-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_simyo_15-eur.html' },
    { name: 'Sind Ihre Gaming-Daten wirklich sicher?', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_gaming-daten-sicherheit-deutschland.html' },
    { name: 'Sitemap -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_sitemap.html' },
    { name: 'Sparen Sie Zeit mit der', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_app.html' },
    { name: 'Spiele online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_spiele-online-kaufen-ohne-konto-deutschland.html' },
    { name: 'Tchibo Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tchibo.html' },
    { name: 'Ticketmaster Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ticketmaster.html' },
    { name: 'TikTok', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tiktok-de_15-eur.html' },
    { name: 'TikTok Deutschland', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tiktok-de.html' },
    { name: 'Tinder Gold Abonnement', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tinder-gold-osterreich.html' },
    { name: 'Tinder Gold-Guthaben €13 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tinder-gold_13-eur.html' },
    { name: 'Tinder Plus Abonnement', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tinder-plus-osterreich.html' },
    { name: 'Tinder Plus-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tinder-plus_10-eur.html' },
    { name: 'TK Maxx Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tk-maxx_100-eur.html' },
    { name: 'TK Maxx Gutschein online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tk-maxx.html' },
    { name: 'Toneo First Mastercard online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first.html' },
    { name: 'Toneo First Mastercard-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_100-eur.html' },
    { name: 'Toneo First Mastercard-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_15-eur.html' },
    { name: 'Toneo First Mastercard-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_150-eur.html' },
    { name: 'Toneo First Mastercard-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_30-eur.html' },
    { name: 'Toneo First Mastercard-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_50-eur.html' },
    { name: 'Toneo First Mastercard-Guthaben €7 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_toneo-first_7-50-eur.html' },
    { name: 'Treatwell Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell-osterreich.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_100-eur.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €125 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_125-eur.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_150-eur.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_25-eur.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_50-eur.html' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_treatwell_75-eur.html' },
    { name: 'TV Now', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tvnow.html' },
    { name: 'TV Now RTL+-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tvnow_15-eur.html' },
    { name: 'TV Now RTL+-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tvnow_25-eur.html' },
    { name: 'TV Now RTL+-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tvnow_5-eur.html' },
    { name: 'TV Now RTL+-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_tvnow_50-eur.html' },
    { name: 'Twitch', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-osterreich.html' },
    { name: 'Twitch Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte.html' },
    { name: 'Twitch Gutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_100-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €125 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_125-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_15-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_150-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_25-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_50-eur.html' },
    { name: 'Twitch Gutschein-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_twitch-geschenkkarte_75-eur.html' },
    { name: 'Warum Sie eine separate Gaming E-Mail brauchen', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_separate-email-gaming-deutschland.html' },
    { name: 'Webseitenfunktion -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_webseitenfunktion.html' },
    { name: 'Welche Daten sammelt Ihr Game Store?', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_informationen-game-store-daten-deutschland.html' },
    { name: 'Wer wir sind -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_ueber-uns.html' },
    { name: 'Widerrufsrecht -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_widerrufsrecht.html' },
    { name: 'Wo bleibt GTA 6? Release, Gerüchte &amp; Infos', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_neuigkeiten_gta-6-release-geruechte-rockstar-deutschland.html' },
    { name: 'WoW Gamecard', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard.html' },
    { name: 'WoW Gamecard 60 Tage online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard-oesterreich.html' },
    { name: 'WoW Gamecard-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard_20-eur.html' },
    { name: 'WoW Gamecard-Guthaben €200 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard-oesterreich_200-eur.html' },
    { name: 'WoW Gamecard-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard_50-eur.html' },
    { name: 'WoW Gamecard-Guthaben €500 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wow-gamecard-oesterreich_500-eur.html' },
    { name: 'WOWWW!', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_wowww-aufladen.html' },
    { name: 'Yesss', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_yesss-aufladen.html' },
    { name: 'Yooopi', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_yooopi.html' },
    { name: 'Zahlungsmethoden – Sicher Bezahlen -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐', url: 'guthaben.de_zahlungsmethoden.html' },
    { name: 'Disney+ Gutschein', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_disney-plus-osterreich.html' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €27 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_disney-plus_27-eur.html' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €54 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_disney-plus_54-eur.html' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €90 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_disney-plus_90-eur.html' },
    { name: 'Netflix', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_netflix-geschenkkarte.html' },
    { name: 'Netflix Gutschein', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_netflix-geschenkkarte_100-eur.html' },
    { name: 'Spotify Gutschein-Guthaben €10 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich_10-euro.html' },
    { name: 'Spotify Gutschein-Guthaben €30 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich_30-eur.html' },
    { name: 'Spotify Gutschein-Guthaben €60 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich_60-euro.html' },
    { name: 'Spotify Premium', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium.html' },
    { name: 'Spotify Premium Gutschein Österreich ab 10 €', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium-code-oesterreich.html' },
    { name: 'Spotify Premium Gutschein-Guthaben €10 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium_10-eur.html' },
    { name: 'Spotify Premium Gutschein-Guthaben €120 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium_120-eur.html' },
    { name: 'Spotify Premium Gutschein-Guthaben €30 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium_30-eur.html' },
    { name: 'Spotify Premium Gutschein-Guthaben €60 online', category: 'Streaming', price: '€10 - €100', icon: '📺', url: 'guthaben.de_spotify-premium_60-eur.html' },
    { name: 'Uber Gutschein', category: 'Transport', price: '€10 - €100', icon: '🚗', url: 'guthaben.de_uber.html' },
    { name: 'CASHlib', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib-osterreich.html' },
    { name: 'CASHlib-Guthaben €10 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_10-eur.html' },
    { name: 'CASHlib-Guthaben €100 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_100-eur.html' },
    { name: 'CASHlib-Guthaben €150 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_150-eur.html' },
    { name: 'CASHlib-Guthaben €20 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_20-eur.html' },
    { name: 'CASHlib-Guthaben €5 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_5-eur.html' },
    { name: 'CASHlib-Guthaben €50 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_cashlib_50-eur.html' },
    { name: 'Neosurf Ticket', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_neosurf-at.html' },
    { name: 'PaysafeCard online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-at.html' },
    { name: 'PaysafeCard Onlline', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard.html' },
    { name: 'PaysafeCard Players Pass DE', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €10 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_10-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €100 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_100-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €15 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_15-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €20 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_20-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €25 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_25-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €30 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_30-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €5 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_5-eur.html' },
    { name: 'PaysafeCard Players Pass-Guthaben €50 online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_paysafecard-players-pass_50-eur.html' },
    { name: 'Prepaid Kreditkarten und', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_neuigkeiten_neosurf-deutschland-oesterreich-guthabenkarten.html' },
    { name: 'Transcash', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_transcash.html' },
    { name: 'Transcash online', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_transcash-oesterreich.html' },
    { name: 'Transcash Ticket', category: 'Zahlung', price: '€10 - €100', icon: '💳', url: 'guthaben.de_transcash_100-eur.html' }
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
      const host = inputContainer.parentElement || inputContainer;
      host.style.position = host.style.position || 'relative';
      host.appendChild(resultsContainer);
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
    // Prepopulate suggestions on load for visibility
    showPopularProducts();
    function showPopularProducts() {
      const popular = products.slice(0, 8);
      searchResults.innerHTML = `
        <div class="search-category-header">Beliebte Produkte</div>
        ${popular.map(product => createResultHTML(product)).join('')}
      `;
      searchResults.style.display = 'block';
      attachResultHandlers();
    }
    
    function attachResultHandlers() {
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          const productUrl = this.dataset.url;
          const productName = this.dataset.product;
          
          if (productUrl && productUrl !== '') {
            // Navigate to product page
            window.location.href = productUrl;
          } else {
            // Fallback: just fill search input
            searchInput.value = productName;
            searchResults.style.display = 'none';
          }
        });
      });
    }
    
    searchInput.addEventListener('focus', function() {
      if (searchInput.value.trim() === '') {
        console.log('[Search] focus -> show popular');
        showPopularProducts();
      }
    });
    
    searchInput.addEventListener('input', function(e) {
      const query = String(e.target.value || '').toLowerCase().trim();
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
