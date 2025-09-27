(function(){
  // Universal Shadow DOM based Quantity Selector for all guthaben.de pages
  // - Works on any page with MUI quantity selectors
  // - Opens on button click, stays open until selection or outside click
  // - Fully isolated via Shadow DOM
  // - Auto-detects and enhances all quantity buttons on page load

  const BTN_SELECTOR = 'button[role="combobox"].MuiSelect-root, button[id^="product_card_quantity_select_"], button[aria-label*="Quantity"], button[aria-label*="quantity"], button[aria-label*="Anzahl"], button[data-testid*="quantity"], .MuiSelect-select[role="combobox"], button.MuiButtonBase-root:has(+ .MuiSelect-icon), button:has(.MuiSelect-icon)';

  // Host (fixed, top layer)
  const host = document.createElement('div');
  host.id = 'qty-shadow-host';
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:none;pointer-events:none;';
  document.documentElement.appendChild(host);

  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{ all: initial; }
      *{ box-sizing: border-box; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      .overlay{ position:fixed; inset:0; background: transparent; pointer-events:auto; }
      .panel{ position:fixed; background:#fff; color:#111; border:1px solid rgba(0,0,0,.12); border-radius:10px; box-shadow:0 18px 42px rgba(0,0,0,.22); min-width:120px; max-height:260px; overflow:auto; z-index:1; }
      .list{ list-style:none; margin:0; padding:6px 0; }
      .item{ padding:10px 14px; cursor:pointer; font-size:15px; }
      .item:hover{ background:#f5f5f5; }
      .item[selected]{ background:#f0f0f0; font-weight:600; }
    </style>
    <div class="overlay" part="overlay"></div>
    <div class="panel" part="panel" style="left:0;top:0;display:none">
      <ul class="list"></ul>
    </div>
  `;

  const overlayEl = root.querySelector('.overlay');
  const panelEl = root.querySelector('.panel');
  const listEl = root.querySelector('.list');

  let currentBtn = null;
  let minOpenUntil = 0;

  function getCurrentValue(btn){
    const title = btn.getAttribute('title') || '';
    const small = btn.querySelector('small');
    const txt = small?.textContent || title || '1';
    const v = parseInt(String(txt).replace(/[^0-9]/g,''), 10);
    return Number.isFinite(v) && v > 0 ? v : 1;
  }

  function renderOptions(selected){
    listEl.innerHTML = '';
    for(let i=1;i<=10;i++){
      const li = document.createElement('li');
      li.className = 'item';
      li.textContent = String(i);
      if (i === selected) li.setAttribute('selected','');
      li.addEventListener('click', () => {
        selectValue(i);
      });
      listEl.appendChild(li);
    }
  }

  function positionPanelNear(btn){
    const rect = btn.getBoundingClientRect();
    const top = Math.round(rect.bottom + 6);
    const left = Math.round(rect.left);
    panelEl.style.top = `${top}px`;
    panelEl.style.left = `${left}px`;
    panelEl.style.minWidth = `${Math.max(rect.width, 120)}px`;
  }

  function openFor(btn){
    currentBtn = btn;
    const val = getCurrentValue(btn);
    renderOptions(val);
    positionPanelNear(btn);

    // Show host and panel
    host.style.display = 'block';
    host.style.pointerEvents = 'auto';
    panelEl.style.display = 'block';
    console.log('[Blau Qty] open');
    // minimal guard to avoid instant close
    minOpenUntil = Date.now() + 300;

    // ARIA
    try {
      btn.setAttribute('aria-expanded', 'true');
    } catch(_){}
  }

  function close(){
    panelEl.style.display = 'none';
    host.style.display = 'none';
    host.style.pointerEvents = 'none';
    try { currentBtn?.setAttribute('aria-expanded','false'); } catch(_){}
    currentBtn = null;
    console.log('[Blau Qty] close');
  }

  function selectValue(val){
    if (!currentBtn) return;
    // Reflect on button
    const small = currentBtn.querySelector('small');
    if (small) small.textContent = String(val);
    try { currentBtn.title = String(val); } catch(_){}

    // Fallback: update a visible text node containing the quantity number
    const textEl = currentBtn.querySelector('[data-qty], .quantity, .MuiTypography-root, span');
    if (textEl){
      const txt = textEl.textContent || '';
      if (/\d+/.test(txt)) textEl.textContent = txt.replace(/\d+/, String(val));
      else textEl.textContent = String(val);
    }

    // Fire event for integrations
    try {
      currentBtn.dispatchEvent(new CustomEvent('quantitychange', { detail:{ value: val }, bubbles: true }));
      currentBtn.dispatchEvent(new Event('change', { bubbles:true }));
      currentBtn.dispatchEvent(new Event('input', { bubbles:true }));
    } catch(_){ }

    close();
  }

  // overlay click handler removed to avoid intercepting page clicks

  // While open, block all site events outside our UI to prevent auto-close
  function whileOpenBlocker(e){
    if (!currentBtn) return;
    const t = e.target;
    // allow interactions inside our shadow UI
    if (t && (t === host || (t.getRootNode && t.getRootNode() === root) || (t.closest && t.closest('#qty-shadow-host')))){
      return;
    }
    // allow interactions on the source button
    const onBtn = t && t.closest && t.closest(BTN_SELECTOR);
    if (onBtn) return;
    // otherwise, swallow the event while open
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
  }

  // Open on pointerdown or click (capture)
  function maybeOpen(e){
    const t = e.target;
    const btn = t && t.closest && t.closest(BTN_SELECTOR);
    if (!btn) return;
    // Prevent site handlers from reacting to this interaction
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

    if (currentBtn && currentBtn === btn){
      // already open for this button: just reposition
      positionPanelNear(btn);
      return;
    }
    openFor(btn);
  }

  // Attach opener
  document.addEventListener('click', maybeOpen, true);

  // Close on outside click (bubble), overlay allows pass-through
  document.addEventListener('click', (e) => {
    if (!currentBtn) return;
    const t = e.target;
    const inPanel = t && (t === panelEl || (panelEl.contains && panelEl.contains(t)));
    const onBtn = t && t.closest && t.closest(BTN_SELECTOR);
    if (!inPanel && !onBtn && Date.now() >= minOpenUntil) close();
  }, false);


  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentBtn){
      e.preventDefault(); e.stopPropagation();
      close();
    }
  }, true);

  // Hide blocking overlays from static export (MUI backdrops)
  function hideBlockingOverlays(){
    try {
      if (!document.getElementById('lovable-overlay-fix')){
        const style = document.createElement('style');
        style.id = 'lovable-overlay-fix';
        style.textContent = `
          .mui-style-1jtyhdp{ display:none !important; pointer-events:none !important; }
          .MuiBackdrop-root, .MuiModal-backdrop, [class*="Backdrop"]{ display:none !important; pointer-events:none !important; }
        `;
        document.head.appendChild(style);
      }
      document.querySelectorAll('.mui-style-1jtyhdp, .MuiBackdrop-root, .MuiModal-backdrop, [class*="Backdrop"]').forEach(el => {
        el.style.setProperty('display','none','important');
        el.style.setProperty('pointer-events','none','important');
      });
    } catch(_){}
  }

  // Keep buttons primed for ARIA and hide overlays
  function prime(){
    hideBlockingOverlays();
    document.querySelectorAll(BTN_SELECTOR).forEach(b => {
      b.setAttribute('aria-haspopup','listbox');
      b.setAttribute('aria-expanded', currentBtn && currentBtn === b ? 'true' : 'false');
    });
  }
  // Initial run
  prime(); hideBlockingOverlays();
  if (window.MutationObserver){
    const mo = new MutationObserver(() => { prime(); hideBlockingOverlays(); });
    mo.observe(document.body, { childList:true, subtree:true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { prime(); hideBlockingOverlays(); }, { once:true });
  window.addEventListener('load', () => { prime(); hideBlockingOverlays(); }, { once:true });
})();
