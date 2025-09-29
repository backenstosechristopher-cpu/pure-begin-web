(function(){
  // Price Selection Enhancement for Google Play pages
  // Replicates the exact behavior from https://www.guthaben.de/google-play-guthaben
  
  console.log('Price selection enhancement script loading...');
  
  function findPriceButtons() {
    const buttons = [];
    
    // Search for buttons containing EUR amounts or specific price patterns
    const allClickableElements = document.querySelectorAll('button, [role="button"], .MuiChip-root, .MuiButton-root, [class*="Chip"], [class*="Button"]');
    
    console.log('Found clickable elements:', allClickableElements.length);
    
    allClickableElements.forEach(element => {
      const text = (element.textContent || element.innerText || '').trim();
      const ariaLabel = element.getAttribute('aria-label') || '';
      const title = element.getAttribute('title') || '';
      const dataValue = element.getAttribute('data-value') || '';
      const allText = (text + ' ' + ariaLabel + ' ' + title + ' ' + dataValue).toLowerCase();
      
      // Look for EUR amounts or specific price patterns like the original site
      const hasEurAmount = /\b(5|10|15|20|25|30|50|75|100|150|200|500)(\s*eur|\s*€|\s*euro)\b/i.test(allText);
      const isNumericButton = /^\d+$/.test(text.trim()) && parseInt(text.trim()) > 0;
      const hasEurSymbol = allText.includes('eur') || allText.includes('€');
      
      if (hasEurAmount || (isNumericButton && hasEurSymbol) || 
          (text.match(/^\d+(EUR|€|euro)$/i)) ||
          (element.classList.contains('MuiChip-root') && /\d/.test(text))) {
        buttons.push(element);
        console.log('Added price button:', element, 'Text:', text, 'Classes:', element.className);
      }
    });
    
    console.log('Final price buttons found:', buttons.length, buttons);
    return buttons;
  }
  
  function addSelectedStyle(button) {
    console.log('Adding selected style to:', button);
    
    // Remove existing selection classes
    button.classList.remove('MuiChip-colorDefault', 'MuiChip-outlined');
    
    // Add selected classes similar to the original site
    button.classList.add('MuiChip-colorPrimary', 'Mui-selected');
    
    // Ensure blue styling with inline styles as backup
    button.style.setProperty('border', '1px solid #1976d2', 'important');
    button.style.setProperty('background-color', 'rgba(25, 118, 210, 0.08)', 'important');
    button.style.setProperty('color', '#1976d2', 'important');
    
    button.setAttribute('data-selected', 'true');
    button.setAttribute('aria-pressed', 'true');
  }
  
  function removeSelectedStyle(button) {
    console.log('Removing selected style from:', button);
    
    // Remove selected classes
    button.classList.remove('MuiChip-colorPrimary', 'Mui-selected');
    
    // Add default classes back
    if (button.classList.contains('MuiChip-root')) {
      button.classList.add('MuiChip-colorDefault', 'MuiChip-outlined');
    }
    
    // Remove inline styles
    button.style.removeProperty('border');
    button.style.removeProperty('background-color');
    button.style.removeProperty('color');
    
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
    
    // Dispatch custom event for any other listeners
    try {
      clickedButton.dispatchEvent(new CustomEvent('priceSelected', { 
        detail: { value: clickedButton.textContent, element: clickedButton }, 
        bubbles: true 
      }));
    } catch(e) {
      console.log('Could not dispatch custom event:', e);
    }
  }
  
  function handlePriceClick(event) {
    console.log('Click event on price button:', this, event);
    
    // Don't prevent default if this might interfere with existing functionality
    // event.preventDefault();
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
      
      // Add click listener with capture to intercept clicks
      button.addEventListener('click', handlePriceClick, { capture: true });
      
      // Set initial ARIA state
      if (!button.hasAttribute('aria-pressed')) {
        button.setAttribute('aria-pressed', 'false');
      }
      
      // Ensure cursor is pointer
      button.style.cursor = 'pointer';
    });
    
    // Check if any button is already selected, if not select the first one
    const selectedButton = priceButtons.find(btn => 
      btn.getAttribute('data-selected') === 'true' || 
      btn.classList.contains('Mui-selected') ||
      btn.classList.contains('MuiChip-colorPrimary')
    );
    
    if (!selectedButton && priceButtons.length > 0) {
      console.log('Selecting first button by default:', priceButtons[0]);
      addSelectedStyle(priceButtons[0]);
    }
    
    console.log('Price selection enhancement initialized for', priceButtons.length, 'buttons');
  }
  
  // Add CSS for proper styling matching the original site
  function addStyles() {
    if (document.getElementById('price-selection-styles')) return;
    
    console.log('Adding price selection styles...');
    const style = document.createElement('style');
    style.id = 'price-selection-styles';
    style.textContent = `
      /* Price button selection styles matching original site */
      .MuiChip-root[data-selected="true"],
      .MuiChip-root.Mui-selected,
      .MuiChip-root.MuiChip-colorPrimary {
        border-color: #1976d2 !important;
        background-color: rgba(25, 118, 210, 0.08) !important;
        color: #1976d2 !important;
      }
      
      .MuiChip-root[data-selected="true"]:hover,
      .MuiChip-root.Mui-selected:hover,
      .MuiChip-root.MuiChip-colorPrimary:hover {
        background-color: rgba(25, 118, 210, 0.12) !important;
      }
      
      /* Transition for smooth selection */
      .MuiChip-root,
      button[data-selected],
      [role="button"][data-selected] {
        transition: all 0.2s ease-in-out !important;
      }
      
      /* Fallback for non-MUI buttons */
      button[data-selected="true"],
      [role="button"][data-selected="true"] {
        border: 1px solid #1976d2 !important;
        background-color: rgba(25, 118, 210, 0.08) !important;
        color: #1976d2 !important;
      }
      
      button[data-selected="true"]:hover,
      [role="button"][data-selected="true"]:hover {
        background-color: rgba(25, 118, 210, 0.12) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize function
  function initialize() {
    console.log('Price selection enhancement initializing...');
    addStyles();
    
    // Try multiple times to catch dynamically loaded content
    initializePriceButtons();
    setTimeout(initializePriceButtons, 500);
    setTimeout(initializePriceButtons, 1500);
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
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              if (node.matches && (
                node.matches('button') || 
                node.matches('[role="button"]') || 
                node.matches('.MuiChip-root') ||
                node.querySelector('button, [role="button"], .MuiChip-root')
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