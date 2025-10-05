(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('Navigation setup initialized');
    
    // Find all "Jetzt kaufen" buttons and links
    const allElements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const buyButtons = allElements.filter(el => {
      const text = el.textContent.trim();
      return text.includes('Jetzt kaufen') || 
             text.includes('JETZT KAUFEN') ||
             text === 'Kaufen' ||
             el.getAttribute('data-testid')?.includes('buy') ||
             el.getAttribute('aria-label')?.includes('kaufen');
    });
    
    console.log(`Found ${buyButtons.length} buy button(s)`);
    
    // Remove existing event listeners and add new ones
    buyButtons.forEach((button, index) => {
      console.log(`Setting up buy button ${index + 1}:`, button);
      
      // Prevent default behavior
      button.addEventListener('click', function(e) {
        console.log('Buy button clicked!');
        e.preventDefault();
        e.stopPropagation();
        
        // Get selected quantity/value
        const orderData = captureOrderData();
        
        // Store in localStorage
        if (orderData.value) {
          localStorage.setItem('guthaben_order_data', JSON.stringify(orderData));
          console.log('Order data saved:', orderData);
        }
        
        // Navigate to payment page
        console.log('Navigating to payment.html');
        window.location.href = 'payment.html';
      }, true); // Use capture phase to intercept before other handlers
    });
    
    // Also create a test button if none found
    if (buyButtons.length === 0) {
      console.log('No buy buttons found, creating test button');
      createTestButton();
    }
  }
  
  function captureOrderData() {
    const productName = 'Google Play';
    const productImage = 'https://static.rapido.com/cms/sites/21/2024/07/11151016/Google-Play-LL-New.png';
    let selectedValue = null;
    let selectedQuantity = 1;
    
    // Try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const valueParam = urlParams.get('value');
    const quantityParam = urlParams.get('quantity');
    
    if (valueParam) {
      selectedValue = parseInt(valueParam) / 100; // Convert cents to euros
      selectedQuantity = parseInt(quantityParam) || 1;
    }
    
    // Try to find selected button
    const selectedButton = document.querySelector('button.blue-border, button[aria-pressed="true"], .MuiToggleButton-root.Mui-selected');
    if (selectedButton) {
      const text = selectedButton.textContent.trim();
      const match = text.match(/(\d+)\s*€|€\s*(\d+)/);
      if (match) {
        selectedValue = parseInt(match[1] || match[2]);
      }
    }
    
    // Fallback: use custom input
    const customInput = document.querySelector('input[type="number"]');
    if (customInput && customInput.value) {
      selectedValue = parseInt(customInput.value);
    }
    
    // Default to 5 EUR if nothing selected
    if (!selectedValue) {
      selectedValue = 5;
    }
    
    return {
      productName: productName,
      productImage: productImage,
      quantity: selectedQuantity,
      value: selectedValue,
      timestamp: Date.now()
    };
  }
  
  function createTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = '🛒 Test: Go to Payment Page';
    testButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 15px 25px;
      background: #FFA81E;
      color: #1F2226;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 168, 30, 0.4);
    `;
    
    testButton.addEventListener('click', function() {
      const orderData = captureOrderData();
      localStorage.setItem('guthaben_order_data', JSON.stringify(orderData));
      console.log('Test button: Navigating to payment.html with data:', orderData);
      window.location.href = 'payment.html';
    });
    
    document.body.appendChild(testButton);
    console.log('Test button created');
  }
})();
