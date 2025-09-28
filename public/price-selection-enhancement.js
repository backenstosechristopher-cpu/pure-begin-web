(function(){
  // Price Selection Enhancement for Google Play pages
  // Adds blue border selection functionality to price buttons (5€, 25€, 100€)
  
  const PRICE_BUTTON_SELECTORS = [
    'button[data-testid*="price"]',
    'button[aria-label*="€"]',
    'button[aria-label*="euro"]',
    '[role="button"][data-value]',
    '.MuiChip-root',
    '.MuiButton-root:contains("€")',
    'button:contains("5")',
    'button:contains("25")',
    'button:contains("100")',
    '[data-price]',
    '.price-button',
    '.amount-selector button',
    'button[class*="price"]',
    'button[class*="amount"]'
  ];
  
  // Custom contains selector since it's not standard
  function findPriceButtons() {
    const buttons = [];
    const allButtons = document.querySelectorAll('button, [role="button"], .MuiChip-root');
    
    allButtons.forEach(btn => {
      const text = btn.textContent || btn.innerText || '';
      const ariaLabel = btn.getAttribute('aria-label') || '';
      const title = btn.getAttribute('title') || '';
      const allText = (text + ' ' + ariaLabel + ' ' + title).toLowerCase();
      
      // Check if button contains price-related content
      if (allText.includes('€') || 
          allText.includes('euro') ||
          /\b(5|25|100)\b/.test(allText) ||
          btn.dataset.price ||
          btn.dataset.value ||
          btn.classList.contains('MuiChip-root')) {
        buttons.push(btn);
      }
    });
    
    // Also try common selectors
    PRICE_BUTTON_SELECTORS.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(btn => {
          if (!buttons.includes(btn)) {
            buttons.push(btn);
          }
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });
    
    return buttons;
  }
  
  function addSelectedStyle(button) {
    // Add blue border and selected state
    button.style.setProperty('border', '2px solid #2196F3', 'important');
    button.style.setProperty('box-shadow', '0 0 0 1px #2196F3', 'important');
    button.setAttribute('data-selected', 'true');
    button.setAttribute('aria-pressed', 'true');
  }
  
  function removeSelectedStyle(button) {
    // Remove blue border and selected state
    button.style.removeProperty('border');
    button.style.removeProperty('box-shadow');
    button.removeAttribute('data-selected');
    button.setAttribute('aria-pressed', 'false');
  }
  
  function handlePriceSelection(clickedButton) {
    const allPriceButtons = findPriceButtons();
    
    // Remove selection from all buttons
    allPriceButtons.forEach(btn => {
      removeSelectedStyle(btn);
    });
    
    // Add selection to clicked button
    addSelectedStyle(clickedButton);
    
    console.log('Price selected:', clickedButton.textContent);
  }
  
  function initializePriceButtons() {
    const priceButtons = findPriceButtons();
    
    priceButtons.forEach(button => {
      // Remove existing listeners to avoid duplicates
      button.removeEventListener('click', handlePriceClick);
      
      // Add click listener
      button.addEventListener('click', handlePriceClick, { capture: true });
      
      // Set initial ARIA state
      if (!button.hasAttribute('aria-pressed')) {
        button.setAttribute('aria-pressed', 'false');
      }
      
      // Add cursor pointer if not already styled
      if (getComputedStyle(button).cursor !== 'pointer') {
        button.style.cursor = 'pointer';
      }
    });
    
    // Select first button by default if none are selected
    const selectedButton = priceButtons.find(btn => btn.getAttribute('data-selected') === 'true');
    if (!selectedButton && priceButtons.length > 0) {
      addSelectedStyle(priceButtons[0]);
    }
    
    console.log('Price selection enhancement initialized for', priceButtons.length, 'buttons');
  }
  
  function handlePriceClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    handlePriceSelection(this);
  }
  
  // Add CSS for selected state animation
  function addStyles() {
    if (document.getElementById('price-selection-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'price-selection-styles';
    style.textContent = `
      button[data-selected="true"], 
      [role="button"][data-selected="true"],
      .MuiChip-root[data-selected="true"] {
        transition: all 0.2s ease-in-out !important;
      }
      
      button[data-selected="true"]:hover,
      [role="button"][data-selected="true"]:hover,
      .MuiChip-root[data-selected="true"]:hover {
        border-color: #1976D2 !important;
        box-shadow: 0 0 0 2px #1976D2 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize on page load and content changes
  function initialize() {
    addStyles();
    initializePriceButtons();
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Watch for dynamic content changes
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new nodes contain buttons
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && (
                node.matches('button') || 
                node.matches('[role="button"]') || 
                node.querySelector('button, [role="button"]')
              )) {
                shouldReinit = true;
              }
            }
          });
        }
      });
      
      if (shouldReinit) {
        setTimeout(initializePriceButtons, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();