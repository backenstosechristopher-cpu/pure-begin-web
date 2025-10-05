(function() {
  'use strict';

  const DEST_FILENAME = 'payment.html';
  const PAGE_DIR = (function() {
    const path = window.location.pathname;
    const idx = path.lastIndexOf('/') + 1;
    return path.slice(0, idx);
  })();
  const DEST_URL = PAGE_DIR + DEST_FILENAME; // always navigate within same /desktop/ dir

  // Run as soon as possible and also after dynamic renders
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    safeAttachBuyHandlers();

    // MutationObserver to catch late-rendered buttons
    const mo = new MutationObserver(() => safeAttachBuyHandlers());
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    // Fallback: periodic scan for a short time
    let scans = 0;
    const interval = setInterval(() => {
      if (++scans > 20) return clearInterval(interval);
      safeAttachBuyHandlers();
    }, 500);

    // Always add a small debug checkout button to ensure navigation works
    createTestButton();
  }

  function safeAttachBuyHandlers() {
    const candidates = Array.from(document.querySelectorAll('button, a, [role="button"]'));
    const buyButtons = candidates.filter(el => {
      const text = (el.textContent || '').trim();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const testid = (el.getAttribute('data-testid') || '').toLowerCase();
      return /jetzt\s*kaufen/i.test(text) ||
             /^kaufen$/i.test(text) ||
             aria.includes('kaufen') ||
             testid.includes('buy') ||
             testid.includes('checkout');
    });

    buyButtons.forEach(btn => {
      if (btn.dataset._buyHandlerAttached) return; // avoid duplicates
      btn.dataset._buyHandlerAttached = '1';

      // If it's an anchor, rewrite the href for extra robustness
      if (btn.tagName === 'A') {
        try { btn.setAttribute('href', DEST_URL); btn.setAttribute('target', '_self'); } catch (_) {}
      }

      btn.addEventListener('click', onBuyClick, true); // capture phase to intercept frameworks
    });
  }

  function onBuyClick(e) {
    try { e.preventDefault(); e.stopPropagation(); } catch (_) {}

    const data = captureOrderData();
    try { localStorage.setItem('guthaben_order_data', JSON.stringify(data)); } catch (_) {}

    // Navigate with a tiny delay to let storage settle
    setTimeout(() => {
      const url = `${DEST_URL}?value=${encodeURIComponent(data.value)}&quantity=${encodeURIComponent(data.quantity)}`;
      window.location.href = url;
    }, 0);

  }

  function captureOrderData() {
    // Product title from heading if available
    const heading = document.querySelector('h1, [data-testid*="product-title"], .product-title');
    const productName = heading ? heading.textContent.trim() : 'Google Play';

    // Try to find product image
    const productImgEl = document.querySelector('img[alt*="Google Play" i], img[alt*="product" i], .MuiBox-root img');
    const productImage = productImgEl ? (productImgEl.currentSrc || productImgEl.src) : 'https://static.rapido.com/cms/sites/21/2024/07/11151016/Google-Play-LL-New.png';

    let selectedValue = null;
    let selectedQuantity = 1;

    // 1) Prefer selected toggle button
    const selectedBtn = document.querySelector('.MuiToggleButton-root.Mui-selected, .MuiToggleButton-root[aria-pressed="true"], button.blue-border');
    if (selectedBtn) {
      const txt = selectedBtn.textContent || '';
      const m = txt.match(/(\d{1,4})\s*€|€\s*(\d{1,4})/);
      if (m) selectedValue = parseInt(m[1] || m[2], 10);
    }

    // 2) Fallback: custom numeric input near the amount section
    if (!selectedValue) {
      const amountInput = document.querySelector('input[type="number"], input[placeholder*="EUR" i], input[placeholder*="Wert" i]');
      if (amountInput && amountInput.value) {
        const iv = parseInt(amountInput.value.replace(/\D/g, ''), 10);
        if (!isNaN(iv)) selectedValue = iv;
      }
    }

    // 3) Final fallback
    if (!selectedValue) selectedValue = 5;

    return {
      productName,
      productImage,
      quantity: selectedQuantity,
      value: selectedValue,
      timestamp: Date.now(),
    };
  }
})();
