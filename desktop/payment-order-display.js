(function() {
  console.log('[PAYMENT] Order display script loaded');
  
  function displayOrderData() {
    // Try URL params first
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
        timestamp: Date.now()
      };
      console.log('[PAYMENT] Loaded order data from URL:', orderData);
      
      // Save to localStorage for consistency
      try {
        localStorage.setItem('guthaben_order_data', JSON.stringify(orderData));
      } catch(e) {}
    } else {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem('guthaben_order_data');
        if (stored) {
          orderData = JSON.parse(stored);
          console.log('[PAYMENT] Loaded order data from localStorage:', orderData);
        }
      } catch(e) {
        console.error('[PAYMENT] Failed to load order data:', e);
      }
    }
    
    if (!orderData) {
      console.warn('[PAYMENT] No order data found');
      return;
    }
    
    // Create visual order summary
    createOrderSummary(orderData);
    
    // Update existing page elements if they exist
    updatePageElements(orderData);
  }
  
  function createOrderSummary(data) {
    // Check if already exists
    if (document.getElementById('order-summary-injected')) return;
    
    const summary = document.createElement('div');
    summary.id = 'order-summary-injected';
    summary.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      min-width: 280px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    summary.innerHTML = `
      <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Ihre Bestellung</div>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        ${data.productImage ? `<img src="${data.productImage}" alt="${data.productName}" style="width: 48px; height: 48px; object-fit: contain; background: white; border-radius: 8px; padding: 4px;">` : ''}
        <div>
          <div style="font-weight: 600; font-size: 16px;">${data.productName}</div>
          <div style="font-size: 13px; opacity: 0.9;">Menge: ${data.quantity}</div>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 14px; opacity: 0.9;">Betrag:</span>
        <span style="font-weight: 700; font-size: 24px;">${data.value} €</span>
      </div>
    `;
    
    document.body.appendChild(summary);
    console.log('[PAYMENT] Order summary created');
  }
  
  function updatePageElements(data) {
    // Try to find and update price/quantity elements in the existing page
    const priceElements = document.querySelectorAll('[class*="price"], [class*="amount"], [class*="total"]');
    priceElements.forEach(el => {
      if (el.textContent.includes('€') && el.textContent.length < 30) {
        const originalText = el.textContent;
        el.textContent = originalText.replace(/\d+([.,]\d+)?\s*€/, `${data.value} €`);
      }
    });
    
    console.log('[PAYMENT] Updated', priceElements.length, 'price elements');
  }
  
  function init() {
    displayOrderData();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
