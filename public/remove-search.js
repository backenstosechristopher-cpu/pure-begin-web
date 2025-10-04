(function() {
  if (window.__SEARCH_REMOVED__) return;
  window.__SEARCH_REMOVED__ = true;

  function removeSearchElements() {
    // Remove all input elements with type="search"
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
      const container = input.closest('div, form, section') || input.parentElement;
      if (container) {
        container.remove();
      } else {
        input.remove();
      }
    });

    // Remove elements with search-related attributes
    const searchElements = document.querySelectorAll('[placeholder*="Suche"], [placeholder*="Search"], [aria-label*="Suche"], [aria-label*="Search"]');
    searchElements.forEach(element => {
      const container = element.closest('div, form, section') || element.parentElement;
      if (container) {
        container.remove();
      } else {
        element.remove();
      }
    });

    // Remove elements with search-related classes
    const searchClassElements = document.querySelectorAll('[class*="search-"], [class*="Search"]');
    searchClassElements.forEach(element => {
      element.remove();
    });

    // Remove any MUI TextField or input that might be a search field
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
      const placeholder = input.getAttribute('placeholder');
      const ariaLabel = input.getAttribute('aria-label');
      if ((placeholder && (placeholder.toLowerCase().includes('suche') || placeholder.toLowerCase().includes('search'))) ||
          (ariaLabel && (ariaLabel.toLowerCase().includes('suche') || ariaLabel.toLowerCase().includes('search')))) {
        const container = input.closest('div.MuiFormControl-root, div.MuiTextField-root, form') || input.parentElement;
        if (container) {
          container.remove();
        } else {
          input.remove();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeSearchElements);
  } else {
    removeSearchElements();
  }

  // Also run after a short delay to catch dynamically added elements
  setTimeout(removeSearchElements, 500);
  setTimeout(removeSearchElements, 1000);
})();
