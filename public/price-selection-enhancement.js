(function(){
  // Price Selection Enhancement for Google Play pages
  // Replicate behavior: clicking a price option gives it a blue selected state

  const BLUE = '#1976d2';

  function isPriceText(text) {
    if (!text) return false;
    const t = text.replace(/\s+/g, '').toLowerCase();
    // Accept forms like 5eur, 5€ , 50eur, etc.
    return /(5|10|15|20|25|30|50|75|100|150|200|500)(eur|€|euro)?$/.test(t);
  }

  function resolveButton(el) {
    if (!el || el.nodeType !== 1) return null;
    // prefer chip/button containers
    return el.closest('.MuiChip-root, .MuiButtonBase-root, button, [role="button"]');
  }

  function isPriceButton(el) {
    if (!el) return false;
    const text = (el.textContent || el.innerText || '').trim();
    if (isPriceText(text)) return true;
    // sometimes price is in a child span
    const childText = (el.querySelector('span, small, b, strong')?.textContent || '').trim();
    return isPriceText(childText);
  }

  function findPriceButtons(scope = document) {
    const candidates = scope.querySelectorAll('.MuiChip-root, .MuiButtonBase-root, button, [role="button"]');
    const results = [];
    candidates.forEach(el => { if (isPriceButton(el)) results.push(el); });
    return results;
  }

  function clearAllSelections(scope = document) {
    scope.querySelectorAll('.price-selected').forEach(el => el.classList.remove('price-selected'));
    scope.querySelectorAll('[data-selected="true"]').forEach(el => el.removeAttribute('data-selected'));
  }

  function selectButton(btn) {
    const root = resolveButton(btn);
    if (!root) return;
    // Limit clearing to the same group container if possible
    const group = root.closest('[role="group"], .MuiStack-root, .MuiBox-root, .MuiGrid-root') || document;
    group.querySelectorAll('.price-selected,[data-selected="true"]').forEach(el => {
      el.classList.remove('price-selected');
      el.removeAttribute('data-selected');
      el.setAttribute('aria-pressed', 'false');
      el.style.removeProperty('border');
      el.style.removeProperty('background-color');
      el.style.removeProperty('color');
    });

    root.classList.add('price-selected');
    root.setAttribute('data-selected', 'true');
    root.setAttribute('aria-pressed', 'true');

    // Inline fallback to guarantee blue look
    root.style.setProperty('border', `1px solid ${BLUE}`, 'important');
    root.style.setProperty('background-color', 'rgba(25,118,210,0.08)', 'important');
    root.style.setProperty('color', BLUE, 'important');
  }

  function onDocClick(e) {
    const el = resolveButton(e.target);
    if (!el) return;
    if (!isPriceButton(el)) return;
    // Do not block native behavior; just style
    selectButton(el);
  }

  function addStyles() {
    if (document.getElementById('price-selection-styles')) return;
    const style = document.createElement('style');
    style.id = 'price-selection-styles';
    style.textContent = `
      .price-selected,
      .MuiChip-root.price-selected,
      .MuiChip-root[data-selected="true"],
      .MuiChip-root.Mui-selected,
      .MuiChip-root.MuiChip-colorPrimary {
        border-color: ${BLUE} !important;
        background-color: rgba(25,118,210,0.08) !important;
        color: ${BLUE} !important;
        transition: all .2s ease-in-out !important;
      }
      .price-selected:hover {
        background-color: rgba(25,118,210,0.12) !important;
      }
      .MuiChip-root, button, [role="button"] { cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  function initialize() {
    addStyles();
    // Pre-mark first button if none selected
    const buttons = findPriceButtons();
    const hasSelected = buttons.some(b => b.classList.contains('price-selected') || b.getAttribute('data-selected') === 'true');
    if (!hasSelected && buttons.length) selectButton(buttons[0]);
  }

  // Attach global delegated listener
  document.addEventListener('click', onDocClick, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  // Mutation observer to keep working with dynamic DOM
  if (window.MutationObserver) {
    const mo = new MutationObserver(() => {
      // ensure styles and default selection persist
      initialize();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();