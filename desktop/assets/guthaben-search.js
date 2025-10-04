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
    { name: 'Google Play', category: 'Apps & Games', price: '€10 - €100', icon: '📱' },
    { name: 'iTunes Karte', category: 'Apps & Games', price: '€10 - €100', icon: '📱' },
    { name: 'Fortnite Deutschland', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €125 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €150 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Fortnite Geschenkkarte-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'League of Legends Riot Points-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'League of Legends Riot Points-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo bringt neue Switch 2 auf den Markt', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card-Guthaben €15 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo eShop Card-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch Online Mitgliedschaft', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch Online-Guthaben €12 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch Online-Guthaben €3 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch-Spiele-Guthaben € online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch-Spiele-Guthaben €29 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch-Spiele-Guthaben €70 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Nintendo Switch-Spiele?', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Playstation Plus', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €150 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €200 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €250 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €30 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €40 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €60 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €750 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus Mitgliedschaft-Guthaben €80 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'PlayStation Plus online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Riot Points', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Roblox Gutschein', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Roblox Karte', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Steam', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Steam Gutschein', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Valorant Points', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Valorant Points-Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Valorant Points-Guthaben €20 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €10 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €100 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €15 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €25 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €30 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €5 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €50 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass -Guthaben €75 online', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Xbox Game Pass?', category: 'Gaming', price: '€10 - €100', icon: '🎮' },
    { name: 'Aldi Talk', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'BILDmobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Congstar', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Congstar prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'GT Mobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'GT Mobile-Guthaben €40 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'GT Mobile-Guthaben €5 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Klarmobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lebara', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lifecell Deutschland', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lifecell-Guthaben €15 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lifecell-Guthaben €30 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lifecell-Guthaben €5 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Lycamobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Mobi', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'O2', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Ortel', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Ortel Mobile', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Rossmann Mobil', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Rossmann Mobil-Guthaben €15 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Rossmann Mobil-Guthaben €25 online', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Telekom', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Telekom prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Türk Telekom', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Vodafone', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Vodafone Prepaid', category: 'Mobilfunk', price: '€10 - €100', icon: '📱' },
    { name: 'Amazon Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'IKEA Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Mediamarkt Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein Österreich-Guthaben €10 online', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein Österreich-Guthaben €15 online', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein Österreich-Guthaben €20 online', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein Österreich-Guthaben €25 online', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Zalando Gutschein Österreich-Guthaben €50 online', category: 'Shopping', price: '€10 - €100', icon: '🛒' },
    { name: 'Adidas Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Airbnb', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Airbnb Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aircash A-bon Prepaid-Code-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Apex Legends Coins Österreich ab 9.99 €', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aplauz', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aplauz-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aplauz-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aplauz-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Aplauz-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'AstroPay Österreich online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Ay Yildiz', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'B. free', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Battle.net', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'BITSA', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Blau', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Blau.de', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'blauworld', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Blauworld', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'bob Wertkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkgutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'C&amp;A Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Candy Crush Saga / Candy Crush Soda', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Candy Crush Saga Gutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cineplex Geschenkgutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cineplex Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cookie-Erklärung -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cyberport Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Cyberport Gutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Darum fragen Shops nach Ihren Daten', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Datenschutzerklärung -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'DAZN Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Deezer Premium Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Douglas Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Drei', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'E-Plus', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'E-Plus Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'EA FC 26: Wünsche der Community', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'EA Origin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'EA Origin Karte online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Eety', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Einfach Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Eventim Geschenkkarte online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Eventim Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Fehler -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Flexepin Vouchers-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Fonic', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Free Fire Diamonds Österreich', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Fyve', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Georg', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Geschenkgutscheine', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Guthaben', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'H&amp;M Geschenkcode', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'H&amp;M Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Handy', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Hearthstone', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Hearthstone Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Hearthstone-Gutschein-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Hearthstone-Gutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Impressum -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Jeton Cash', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'JetonCash Österreich online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Jochen Schweizer Geschenkkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Jochen Schweizer Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Jochen Schweizer Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Kaufe Aircash A-bon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Kaufen Sie ihre Entertainment', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Kaufen Sie ihre Gamecards Prepaid online auf', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Kobo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Libon', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Libon-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Libon-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Libon-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Lieferando', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Lieferando Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Lush Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'M:tel', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Magenta Klax', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Mango Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Deutschland  Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Meta Quest Geschenkkarte-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte Österreich-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Microsoft Geschenkkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MiFinity Voucher', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MINT Prepaid', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MINT Prepaid Karte-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MINT Prepaid Karte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MINT Prepaid Karte-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MINT Prepaid Karte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MT Games', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'MT Privatsphäre beim Gamen: So spielen Sie sicher', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Nettokom', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'NettoKOM', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Netzclub', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Neuigkeiten -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Nike Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Origin', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'otelo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Otto Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PCS Mastercard', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PCS Mastercard Deutschland', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PCS online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PSN', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PUBG Mobile UC', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PUBG Mobile UC -Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PUBG Mobile UC -Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'PUBG Mobile UC -Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €200 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Razer Gold Card-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rewarble Advanced Cash', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rewarble Advanced Cash-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rewarble Advanced Cash-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rewarble Advanced Cash-Guthaben €60 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rewarble Perfect Money', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Rossmann Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'RuneScape Mitgliedschaft Österreich 7,49 €', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Saturn Gutscheinkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Saturn Gutscheinkarte-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Saturn Online Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Simyo', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Simyo-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Sind Ihre Gaming-Daten wirklich sicher?', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Sitemap -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Sparen Sie Zeit mit der', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Spiele online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Tchibo Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Ticketmaster Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TikTok', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TikTok Deutschland', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Tinder Gold Abonnement', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Tinder Gold-Guthaben €13 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Tinder Plus Abonnement', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Tinder Plus-Guthaben €10 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TK Maxx Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TK Maxx Gutschein online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €30 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Toneo First Mastercard-Guthaben €7 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €125 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Treatwell Gutscheinkarte-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TV Now', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TV Now RTL+-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TV Now RTL+-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TV Now RTL+-Guthaben €5 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'TV Now RTL+-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €100 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €125 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €15 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €150 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €25 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Twitch Gutschein-Guthaben €75 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Warum Sie eine separate Gaming E-Mail brauchen', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Webseitenfunktion -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Welche Daten sammelt Ihr Game Store?', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Wer wir sind -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Widerrufsrecht -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Wo bleibt GTA 6? Release, Gerüchte &amp; Infos', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard 60 Tage online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard-Guthaben €20 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard-Guthaben €200 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard-Guthaben €50 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WoW Gamecard-Guthaben €500 online', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'WOWWW!', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Yesss', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Yooopi', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Zahlungsmethoden – Sicher Bezahlen -', category: 'Sonstiges', price: '€10 - €100', icon: '⭐' },
    { name: 'Disney+ Gutschein', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €27 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €54 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Disney+ Gutscheinkarte-Guthaben €90 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Netflix', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Netflix Gutschein', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Gutschein-Guthaben €10 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Gutschein-Guthaben €30 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Gutschein-Guthaben €60 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium Gutschein Österreich ab 10 €', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium Gutschein-Guthaben €10 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium Gutschein-Guthaben €120 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium Gutschein-Guthaben €30 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Spotify Premium Gutschein-Guthaben €60 online', category: 'Streaming', price: '€10 - €100', icon: '📺' },
    { name: 'Uber Gutschein', category: 'Transport', price: '€10 - €100', icon: '🚗' },
    { name: 'CASHlib', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €10 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €100 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €150 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €20 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €5 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'CASHlib-Guthaben €50 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Neosurf Ticket', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Onlline', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass DE', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €10 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €100 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €15 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €20 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €25 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €30 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €5 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'PaysafeCard Players Pass-Guthaben €50 online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Prepaid Kreditkarten und', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Transcash', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Transcash online', category: 'Zahlung', price: '€10 - €100', icon: '💳' },
    { name: 'Transcash Ticket', category: 'Zahlung', price: '€10 - €100', icon: '💳' }
  ];
  
  // Inject HTML - Just add results container
  function injectHTML() {
    // Find the existing search input (desktop and mobile)
    const existingInput =
      document.getElementById('search-field-input');
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
    const searchInput = document.getElementById('search-field-input');
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
    // Position dropdown
    const positionDropdown = () => {
      const rect = searchInput.getBoundingClientRect();
      Object.assign(searchResults.style, {
        width: rect.width + 'px',
        left: Math.round(rect.left) + 'px',
        top: Math.round(rect.bottom + 8) + 'px'
      });
    };
    
    // Ensure results are hidden initially
    searchResults.style.display = 'none';
    searchResults.innerHTML = '';
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
      if (searchInput.value.trim() !== '') {
        searchResults.style.display = 'block';
      }
    });
    
    const handleInput = (raw) => {
      const query = String(raw || '').toLowerCase().trim();
      positionDropdown();
      if (query.length > 80) { return; }
      if (query.length === 0) {
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
    };

    ['input','keyup','change','paste','compositionend'].forEach(evt => {
      searchInput.addEventListener(evt, () => handleInput(searchInput.value));
    });
    // In case MUI updates value on keydown before input event
    searchInput.addEventListener('keydown', () => setTimeout(() => handleInput(searchInput.value), 0));
    
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
      const input = document.getElementById('search-field-input');
      if (input) {
        clearInterval(timer);
        initSearch();
        // Re-bind if MUI re-renders/replaces the input element
        try {
          const mo = new MutationObserver(() => {
            const el = document.getElementById('search-field-input');
            if (el && el.dataset.gthBound !== '1') {
              initSearch();
            }
          });
          mo.observe(document.body, { childList: true, subtree: true });
        } catch (e) { console.warn('[Search] observer error', e); }
      } else if (++attempts >= 80) {
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
