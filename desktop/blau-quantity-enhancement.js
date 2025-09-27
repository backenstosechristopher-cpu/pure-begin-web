(function(){
  // Blau Quantity Selector (lightweight, non-blocking)
  // - No overlay, no global blockers, no preventDefault
  // - Opens on click, closes on outside click or Esc
  // - Updates small/title and best-effort visible number, and fires events

  const BTN_SELECTOR = 'button[role="combobox"].MuiSelect-root, button[id^="product_card_quantity_select_"], button[aria-label*="Quantity" i], button[aria-label*="Anzahl" i], [data-testid*="quantity" i], .MuiSelect-select[role="combobox"], button.MuiButtonBase-root:has(+ .MuiSelect-icon), button:has(.MuiSelect-icon)';

  // Shadow host (does not capture pointer events)
  const host = document.createElement('div');
  host.id = 'blau-qty-host';
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  root.innerHTML = `
    <style>
      :host{ all: initial; }
      *{ box-sizing: border-box; }
      .panel{ position:fixed; left:0; top:0; display:none; pointer-events:auto; background:#fff; color:#111; border:1px solid rgba(0,0,0,.12); border-radius:10px; box-shadow:0 18px 42px rgba(0,0,0,.22); min-width:120px; max-height:260px; overflow:auto; z-index:2147483647; }
      .list{ list-style:none; margin:0; padding:6px 0; }
      .item{ padding:10px 14px; cursor:pointer; font-size:15px; line-height:1.3; }
      .item:hover{ background:#f5f5f5; }
      .item[selected]{ background:#f0f0f0; font-weight:600; }
    </style>
    <div class="panel" part="panel">
      <ul class="list"></ul>
    </div>
  `;

  const panelEl = root.querySelector('.panel');
  const listEl = root.querySelector('.list');

  let currentBtn = null;
  let minOpenUntil = 0;

  function getCurrentValue(btn){
    const small = btn.querySelector('small');
    const txt = (small?.textContent || btn.getAttribute('title') || btn.textContent || '1') + '';
    const v = parseInt(txt.replace(/[^0-9]/g,''), 10);
    return Number.isFinite(v) && v > 0 ? v : 1;
  }

  function renderOptions(selected){
    listEl.innerHTML = '';
    for (let i=1;i<=10;i++){
      const li = document.createElement('li');
      li.className = 'item';
      li.textContent = String(i);
      if (i === selected) li.setAttribute('selected','');
      li.addEventListener('click', () => selectValue(i));
      listEl.appendChild(li);
    }
  }

  function positionPanelNear(btn){
    const rect = btn.getBoundingClientRect();
    const top = Math.round(rect.bottom + 6);
    const left = Math.round(Math.max(8, Math.min(window.innerWidth - 140, rect.left)));
    panelEl.style.top = `${top}px`;
    panelEl.style.left = `${left}px`;
    panelEl.style.minWidth = `${Math.max(rect.width, 120)}px`;
  }

  function openFor(btn){
    currentBtn = btn;
    renderOptions(getCurrentValue(btn));
    positionPanelNear(btn);
    host.style.pointerEvents = 'none'; // host never captures page interactions
    panelEl.style.display = 'block';
    minOpenUntil = Date.now() + 200; // ignore immediate close
    try { btn.setAttribute('aria-expanded','true'); } catch(_){}
  }

  function close(){
    panelEl.style.display = 'none';
    try { currentBtn?.setAttribute('aria-expanded','false'); } catch(_){}
    currentBtn = null;
    minOpenUntil = 0;
  }

  function selectValue(val){
    if (!currentBtn) return;

    // Update visible parts conservatively
    const small = currentBtn.querySelector('small');
    if (small) small.textContent = String(val);
    try { currentBtn.title = String(val); } catch(_){}
    const textEl = currentBtn.querySelector('[data-qty], .quantity, .MuiTypography-root, span');
    if (textEl){
      const txt = textEl.textContent || '';
      textEl.textContent = /\d+/.test(txt) ? txt.replace(/\d+/, String(val)) : String(val);
    }

    // Dispatch events so page can react
    try {
      currentBtn.dispatchEvent(new CustomEvent('quantitychange', { detail:{ value: val }, bubbles: true }));
      currentBtn.dispatchEvent(new Event('change', { bubbles:true }));
      currentBtn.dispatchEvent(new Event('input', { bubbles:true }));
    } catch(_){ }

    close();
  }

  // Open on click (capture so we can run even if site stops propagation). Do not preventDefault
  function maybeOpen(e){
    const t = e.target;
    const btn = t && t.closest && t.closest(BTN_SELECTOR);
    if (!btn) return;
    if (currentBtn && currentBtn === btn){ positionPanelNear(btn); return; }
    openFor(btn);
  }
  // opener bound per-button via prime()

  // Close on outside click (bubble). Do not stop the page's click.
  document.addEventListener('click', (e) => {
    if (!currentBtn) return;
    const t = e.target;
    const inPanel = t && (t === panelEl || (panelEl.contains && panelEl.contains(t)));
    const onBtn = t && t.closest && t.closest(BTN_SELECTOR);
    if (!inPanel && !onBtn && Date.now() >= minOpenUntil) close();
  }, false);

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentBtn) close();
  }, true);

  // Hide MUI backdrops that can block the page
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
    } catch(_){ }
  }

  // Prime: bind click handlers to buttons and set ARIA
  function bindButton(b){
    if (b.dataset.blauQtyBound) return;
    b.dataset.blauQtyBound = '1';
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      hideBlockingOverlays();
      openFor(b);
    }, true);
  }
  function prime(){
    hideBlockingOverlays();
    document.querySelectorAll(BTN_SELECTOR).forEach(b => {
      b.setAttribute('aria-haspopup','listbox');
      b.setAttribute('aria-expanded', currentBtn && currentBtn === b ? 'true' : 'false');
      bindButton(b);
    });
  }
  prime();
  if (window.MutationObserver){
    const mo = new MutationObserver(prime);
    mo.observe(document.body, { childList:true, subtree:true });
  }
})();
