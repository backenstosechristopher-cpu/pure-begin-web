(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Prefer URL parameters, then fall back to localStorage
    const params = new URLSearchParams(window.location.search);
    const urlValue = params.get('value');
    const urlQuantity = params.get('quantity');

    let orderData = null;

    if (urlValue) {
      orderData = {
        productName: 'Google Play',
        productImage: 'https://static.rapido.com/cms/sites/21/2024/07/11151016/Google-Play-LL-New.png',
        quantity: parseInt(urlQuantity || '1', 10),
        value: parseInt(urlValue, 10),
        timestamp: Date.now(),
      };
      try { localStorage.setItem('guthaben_order_data', JSON.stringify(orderData)); } catch (_) {}
      console.log('Loaded order data from URL:', orderData);
    } else {
      // Retrieve order data from localStorage
      const orderDataStr = localStorage.getItem('guthaben_order_data');
      if (!orderDataStr) {
        console.log('No order data found via URL or localStorage');
        return;
      }
      orderData = JSON.parse(orderDataStr);
      console.log('Retrieved order data from localStorage:', orderData);
    }

    // Find elements to update on payment page
    // Look for product name elements
    const productNameElements = document.querySelectorAll('[data-testid*="product-name"], [class*="product-name"], .product-title, h1, h2');
    
    // Look for product image elements
    const productImageElements = document.querySelectorAll('[data-testid*="product-image"], [class*="product-image"], img[alt*="product"], img[alt*="Product"]');
    
    // Look for quantity elements
    const quantityElements = document.querySelectorAll('[data-testid*="quantity"], [class*="quantity"], .quantity-value');
    
    // Look for value/price elements
    const priceElements = document.querySelectorAll('[data-testid*="price"], [data-testid*="amount"], [class*="price"], [class*="amount"], .total, .subtotal');
    
    console.log('Found product name elements:', productNameElements.length);
    console.log('Found product image elements:', productImageElements.length);
    console.log('Found quantity elements:', quantityElements.length);
    console.log('Found price elements:', priceElements.length);
    
    // Update product name
    if (orderData.productName) {
      productNameElements.forEach(el => {
        if (el.tagName === 'IMG') return; // Skip images
        if (el.textContent.trim().length < 100) { // Only update short text elements
          el.textContent = orderData.productName;
        }
      });
    }
    
    // Update product image
    if (orderData.productImage) {
      productImageElements.forEach(img => {
        if (img.tagName === 'IMG') {
          img.src = orderData.productImage;
          img.alt = orderData.productName;
        }
      });
    }
    
    // Update quantity
    if (orderData.quantity) {
      quantityElements.forEach(el => {
        if (el.tagName === 'INPUT') {
          el.value = orderData.quantity;
        } else {
          el.textContent = orderData.quantity;
        }
      });
    }
    
    // Update price/value
    if (orderData.value) {
      priceElements.forEach(el => {
        if (el.textContent.includes('€') || el.textContent.includes('EUR')) {
          el.textContent = `${orderData.value} €`;
        }
      });
    }
    
    // Create or update a summary section if it doesn't exist
    createOrderSummary(orderData);
  }
  
  function createOrderSummary(orderData) {
    // Check if summary already exists
    let summaryContainer = document.getElementById('order-summary-injected');
    
    if (!summaryContainer) {
      // Try to find a suitable container
      const mainContent = document.querySelector('main, .main-content, [role="main"], .container');
      
      if (mainContent) {
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'order-summary-injected';
        summaryContainer.style.cssText = `
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          font-family: Arial, sans-serif;
        `;
        
        mainContent.insertBefore(summaryContainer, mainContent.firstChild);
      }
    }
    
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #333;">Bestellübersicht</h3>
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
          ${orderData.productImage ? `<img src="${orderData.productImage}" alt="${orderData.productName}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 4px;">` : ''}
          <div>
            <div style="font-weight: bold; font-size: 16px; color: #333;">${orderData.productName}</div>
            <div style="color: #666; font-size: 14px; margin-top: 5px;">Menge: ${orderData.quantity}</div>
          </div>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; font-size: 16px;">Betrag:</span>
          <span style="font-weight: bold; font-size: 20px; color: #FFA81E;">${orderData.value} €</span>
        </div>
      `;
    }
  }
})();
