(function() {
  if (window.__SEARCH_REMOVED__) return;
  window.__SEARCH_REMOVED__ = true;

  function removeSearchElements() {
    // Remove by specific ID
    const searchById = document.getElementById('search-field-input');
    if (searchById) {
      const container = searchById.closest('.MuiAutocomplete-root, .MuiFormControl-root, form, div[role="search"]');
      if (container) {
        container.remove();
      } else {
        searchById.parentElement?.remove();
      }
    }

    // Remove all MUI Autocomplete components
    document.querySelectorAll('.MuiAutocomplete-root').forEach(el => {
      const input = el.querySelector('input');
      if (input) {
        const placeholder = input.getAttribute('placeholder');
        const id = input.getAttribute('id');
        if ((placeholder && (placeholder.toLowerCase().includes('suche') || placeholder.toLowerCase().includes('search'))) ||
            (id && (id.toLowerCase().includes('search')))) {
          el.remove();
        }
      }
    });

    // Remove all input elements with type="search"
    document.querySelectorAll('input[type="search"]').forEach(input => {
      const container = input.closest('div, form, section');
      (container || input.parentElement || input).remove();
    });

    // Remove elements with search-related placeholders or labels
    document.querySelectorAll('[placeholder*="Suche"], [placeholder*="Search"], [placeholder*="suche"], [placeholder*="search"]').forEach(element => {
      const container = element.closest('.MuiAutocomplete-root, .MuiFormControl-root, .MuiTextField-root, form, section, div');
      (container || element.parentElement || element).remove();
    });

    // Remove by aria-label
    document.querySelectorAll('[aria-label*="Suche"], [aria-label*="Search"], [aria-label*="suche"], [aria-label*="search"]').forEach(element => {
      const container = element.closest('.MuiAutocomplete-root, .MuiFormControl-root, form');
      (container || element.parentElement || element).remove();
    });

    // Remove elements with search-related IDs
    document.querySelectorAll('[id*="search"], [id*="Search"]').forEach(element => {
      if (element.tagName === 'INPUT' || element.closest('.MuiAutocomplete-root')) {
        const container = element.closest('.MuiAutocomplete-root, .MuiFormControl-root, form, section');
        (container || element.parentElement || element).remove();
      }
    });

    // Remove elements with search-related classes
    document.querySelectorAll('[class*="search-"], [class*="Search"]').forEach(element => {
      element.remove();
    });
  }

  // Run immediately
  removeSearchElements();

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeSearchElements);
  }

  // Run multiple times to catch dynamically rendered content
  setTimeout(removeSearchElements, 100);
  setTimeout(removeSearchElements, 300);
  setTimeout(removeSearchElements, 500);
  setTimeout(removeSearchElements, 1000);
  setTimeout(removeSearchElements, 2000);

  // Watch for new elements being added
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const element = node;
          if (element.querySelector && (
            element.querySelector('[placeholder*="Suche"]') ||
            element.querySelector('[id*="search"]') ||
            element.querySelector('.MuiAutocomplete-root') ||
            element.id?.includes('search')
          )) {
            shouldRun = true;
          }
        }
      });
    });
    if (shouldRun) {
      setTimeout(removeSearchElements, 50);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
