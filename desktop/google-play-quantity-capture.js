(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    let selectedQuantity = null;
    let selectedValue = null;
    const productName = 'Google Play';
    const productImage = 'https://static.rapido.com/cms/sites/21/2024/07/11151016/Google-Play-LL-New.png';
    
    // Find all quantity buttons (5 EUR, 25 EUR, 50 EUR, 100 EUR)
    const quantityButtons = document.querySelectorAll('[data-testid*="quantity"], button[class*="quantity"], [class*="amount-button"]');
    
    // Also look for buttons with text containing EUR
    const allButtons = Array.from(document.querySelectorAll('button'));
    const eurButtons = allButtons.filter(btn => {
      const text = btn.textContent.trim();
      return /\d+\s*€|€\s*\d+/.test(text);
    });
    
    // Find custom input field
    const customInputs = document.querySelectorAll('input[type="number"], input[placeholder*="EUR"], input[placeholder*="Betrag"]');
    
    // Find "Jetzt kaufen" button
    const buyButtons = Array.from(document.querySelectorAll('button, a')).filter(el => 
      el.textContent.includes('Jetzt kaufen') || 
      el.textContent.includes('Kaufen') ||
      el.getAttribute('data-testid')?.includes('buy')
    );
    
    console.log('Found EUR buttons:', eurButtons.length);
    console.log('Found custom inputs:', customInputs.length);
    console.log('Found buy buttons:', buyButtons.length);
    
    // Add click listeners to quantity buttons
    [...quantityButtons, ...eurButtons].forEach(button => {
      button.addEventListener('click', function(e) {
        const text = this.textContent.trim();
        const match = text.match(/(\d+)\s*€|€\s*(\d+)/);
        
        if (match) {
          selectedValue = parseInt(match[1] || match[2]);
          selectedQuantity = 1;
          console.log('Selected quantity:', selectedQuantity, 'Value:', selectedValue);
        }
      });
    });
    
    // Add change listener to custom input
    customInputs.forEach(input => {
      input.addEventListener('change', function() {
        selectedValue = parseInt(this.value);
        selectedQuantity = 1;
        console.log('Custom value entered:', selectedValue);
      });
    });
    
    // Add click listener to "Jetzt kaufen" button
    buyButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        // If no selection, try to find it from URL or current page state
        if (!selectedValue) {
          // Try to extract from URL parameters
          const urlParams = new URLSearchParams(window.location.search);
          const valueParam = urlParams.get('value');
          const quantityParam = urlParams.get('quantity');
          
          if (valueParam) {
            selectedValue = parseInt(valueParam) / 100; // Convert cents to euros
          }
          if (quantityParam) {
            selectedQuantity = parseInt(quantityParam);
          }
        }
        
        // Store the selection data
        if (selectedValue) {
          const orderData = {
            productName: productName,
            productImage: productImage,
            quantity: selectedQuantity || 1,
            value: selectedValue,
            timestamp: Date.now()
          };
          
          localStorage.setItem('guthaben_order_data', JSON.stringify(orderData));
          console.log('Order data stored:', orderData);
        }
      });
    });
    
    // Also check URL on load for pre-selected values
    const urlParams = new URLSearchParams(window.location.search);
    const valueParam = urlParams.get('value');
    const quantityParam = urlParams.get('quantity');
    
    if (valueParam) {
      selectedValue = parseInt(valueParam) / 100;
      selectedQuantity = parseInt(quantityParam) || 1;
      
      const orderData = {
        productName: productName,
        productImage: productImage,
        quantity: selectedQuantity,
        value: selectedValue,
        timestamp: Date.now()
      };
      
      localStorage.setItem('guthaben_order_data', JSON.stringify(orderData));
      console.log('Pre-loaded order data from URL:', orderData);
    }
  }
})();
