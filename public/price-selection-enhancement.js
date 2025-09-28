(function(){
  // Price Selection Enhancement for Google Play pages
  // Adds blue border selection functionality to price buttons (5€, 25€, 100€)
  
  console.log('Price selection enhancement script loading...');
  
  // More comprehensive selectors for price buttons
  const PRICE_BUTTON_SELECTORS = [
    // MUI chip selectors
    '.MuiChip-root',
    // Button selectors with common patterns
    'button[data-testid*="price"]',
    'button[data-testid*="amount"]',
    'button[aria-label*="€"]',
    'button[aria-label*="euro"]',
    'button[title*="€"]',
    'button[title*="euro"]',
    '[role="button"]',
    'button',
    // Data attributes
    '[data-price]',
    '[data-value]',
    // CSS classes
    '.price-button',
    '.amount-selector button',
    'button[class*="price"]',
    'button[class*="amount"]',
    'button[class*="Mui"]'
  ];
  
  function findPriceButtons() {
    const buttons = [];
    const potentialButtons = new Set();
    
    // First, gather all potential buttons
    PRICE_BUTTON_SELECTORS.forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(btn => potentialButtons.add(btn));
      } catch (e) {
        console.log('Invalid selector:', selector, e);
      }
    });
    
    console.log('Found potential buttons:', potentialButtons.size);
    
    // Then filter for price-related content
    potentialButtons.forEach(btn => {
      const text = (btn.textContent || btn.innerText || '').trim();
      const ariaLabel = btn.getAttribute('aria-label') || '';
      const title = btn.getAttribute('title') || '';
      const dataValue = btn.getAttribute('data-value') || '';
      const allText = (text + ' ' + ariaLabel + ' ' + title + ' ' + dataValue).toLowerCase();
      
      console.log('Checking button:', {
        element: btn,
        text: text,
        ariaLabel: ariaLabel,
        title: title,
        dataValue: dataValue,
        allText: allText
      });
      
      // Check if button contains price-related content
      if (allText.includes('€') || 
          allText.includes('euro') ||
          /\b(5|25|100)\b/.test(allText) ||
          btn.dataset.price ||
          btn.dataset.value ||
          btn.classList.contains('MuiChip-root') ||
          (text && /\d/.test(text))) {
        buttons.push(btn);
        console.log('Added price button:', btn, 'Text:', text);
      }
    });
    
    console.log('Final price buttons found:', buttons.length, buttons);
    return buttons;
  }
  
  function addSelectedStyle(button) {
    console.log('Adding selected style to:', button);
    // Add blue border and selected state
    button.style.setProperty('border', '2px solid #2196F3', 'important');
    button.style.setProperty('box-shadow', '0 0 0 1px #2196F3', 'important');
    button.setAttribute('data-selected', 'true');
    button.setAttribute('aria-pressed', 'true');
  }
  
  function removeSelectedStyle(button) {
    console.log('Removing selected style from:', button);
    // Remove blue border and selected state
    button.style.removeProperty('border');
    button.style.removeProperty('box-shadow');
    button.removeAttribute('data-selected');
    button.setAttribute('aria-pressed', 'false');
  }
  
  function handlePriceSelection(clickedButton) {
    console.log('Price button clicked:', clickedButton);
    const allPriceButtons = findPriceButtons();
    
    // Remove selection from all buttons
    allPriceButtons.forEach(btn => {
      removeSelectedStyle(btn);
    });
    
    // Add selection to clicked button
    addSelectedStyle(clickedButton);
    
    console.log('Price selected:', clickedButton.textContent);
  }
  
  function handlePriceClick(event) {
    console.log('Click event on price button:', this, event);
    event.preventDefault();
    event.stopPropagation();
    
    handlePriceSelection(this);
  }
  
  function initializePriceButtons() {
    console.log('Initializing price buttons...');
    const priceButtons = findPriceButtons();
    
    if (priceButtons.length === 0) {
      console.log('No price buttons found, will retry in 1 second...');
      setTimeout(initializePriceButtons, 1000);
      return;
    }
    
    priceButtons.forEach((button, index) => {
      console.log(`Setting up button ${index + 1}:`, button);
      
      // Remove existing listeners to avoid duplicates
      button.removeEventListener('click', handlePriceClick);
      
      // Add click listener with capture to ensure we get the event first
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
      console.log('Selecting first button by default:', priceButtons[0]);
      addSelectedStyle(priceButtons[0]);
    }
    
    console.log('Price selection enhancement initialized for', priceButtons.length, 'buttons');
  }
  
  // Add CSS for selected state animation
  function addStyles() {
    if (document.getElementById('price-selection-styles')) return;
    
    console.log('Adding price selection styles...');
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
    console.log('Price selection enhancement initializing...');
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
        console.log('DOM changed, reinitializing price buttons...');
        setTimeout(initializePriceButtons, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  console.log('Price selection enhancement script loaded');
})();