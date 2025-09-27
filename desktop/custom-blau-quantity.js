(function(){
  if (window.__blauCustomQtyInit) return; // prevent double init
  window.__blauCustomQtyInit = true;

  const safe = (fn) => (...args) => { try { return fn(...args); } catch (e) { console.warn('[Blau qty] handler error', e); } };

  const injectStyles = () => {
    if (document.getElementById('custom-blau-quantity')) return;
    const style = document.createElement('style');
    style.id = 'custom-blau-quantity';
    style.textContent = `
/* Neutralize potential blocking overlays only during our dropdown */
body.__blauQtyOpen .MuiBackdrop-root, body.__blauQtyOpen .MuiModal-backdrop { pointer-events: none !important; }
/* Ensure our dropdown sits on top and is opaque */
.custom-quantity-selector { position: relative; display: inline-block; margin: 8px 0; }
.custom-quantity-btn { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 8px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; min-width: 140px; font-size: 14px; transition: all 0.2s ease; }
.custom-quantity-btn:hover { border-color: #ffa81e; box-shadow: 0 2px 8px rgba(255,168,30,0.2); }
.custom-quantity-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 2147483646; max-height: 240px; overflow-y: auto; display: none; }
.custom-quantity-dropdown.open { display: block; }
.custom-quantity-option { padding: 10px 16px; cursor: pointer; border-bottom: 1px solid #f0f0f0; transition: background 0.2s ease; background: #fff; }
.custom-quantity-option:hover { background: #f8f9fa; }
.custom-quantity-option:last-child { border-bottom: none; }
.custom-quantity-arrow { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #666; transition: transform 0.2s ease; }
.custom-quantity-btn.open .custom-quantity-arrow { transform: rotate(180deg); }
`;
    document.head.appendChild(style);
  };

  const createSelector = (hostEl, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-quantity-selector';
    wrapper.innerHTML = `
      <div class="custom-quantity-btn" data-index="${index}" aria-haspopup="listbox" aria-expanded="false" role="button">
        <span class="quantity-text">Menge: 1</span>
        <div class="custom-quantity-arrow"></div>
      </div>
      <div class="custom-quantity-dropdown" role="listbox">
        ${[1,2,3,4,5,10].map(v => `<div class="custom-quantity-option" role="option" data-value="${v}">${v}</div>`).join('')}
      </div>
    `;
    hostEl.parentNode.insertBefore(wrapper, hostEl.nextSibling);

    const btn = wrapper.querySelector('.custom-quantity-btn');
    const dropdown = wrapper.querySelector('.custom-quantity-dropdown');
    const quantityText = wrapper.querySelector('.quantity-text');

    const closeAll = () => {
      document.querySelectorAll('.custom-quantity-dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.custom-quantity-btn.open').forEach(b => b.classList.remove('open'));
      document.body.classList.remove('__blauQtyOpen');
    };

    const open = safe((e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAll();
      dropdown.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('__blauQtyOpen');
    });

    const choose = safe((e) => {
      e.preventDefault();
      e.stopPropagation();
      const value = e.currentTarget.getAttribute('data-value');
      quantityText.textContent = `Menge: ${value}`;
      // Sync to any underlying input/select if present
      const original = hostEl.querySelector('input, select');
      if (original) {
        original.value = value;
        try { original.dispatchEvent(new Event('change', { bubbles: true })); } catch {}
      }
      closeAll();
    });

    const toggle = safe((e) => {
      if (dropdown.classList.contains('open')) {
        e.preventDefault(); e.stopPropagation();
        closeAll();
        btn.setAttribute('aria-expanded', 'false');
      } else {
        open(e);
      }
    });

    btn.addEventListener('click', toggle, true); // capture to beat framework handlers
    btn.addEventListener('pointerdown', safe(e => { e.preventDefault(); }), true);

    wrapper.querySelectorAll('.custom-quantity-option').forEach(opt => {
      opt.addEventListener('click', choose, true);
      opt.addEventListener('pointerdown', safe(e => { e.preventDefault(); }), true);
    });

    // One-time global listeners
    if (!window.__blauQtyGlobals) {
      window.__blauQtyGlobals = true;
      document.addEventListener('click', safe(() => closeAll()));
      document.addEventListener('keydown', safe((e) => { if (e.key === 'Escape') closeAll(); }));
    }
  };

  const init = () => {
    injectStyles();
    // Hide any native selectors if still visible for safety
    try { document.querySelectorAll('[id*="product_card_quantity_select"]').forEach(n => n.style.display = 'none'); } catch {}

    const nodes = document.querySelectorAll('[id*="product_card_quantity_select"]');
    nodes.forEach((n, i) => createSelector(n, i));
    console.log('[Blau qty] Custom selectors attached:', nodes.length);
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 400);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 400));
  }
})();