(function(){
  // Fresh, robust Quantity Select controller
  // - Opens on button click and stays open until: selecting an option OR clicking outside
  // - Never closes due to scroll/resize/blur
  // - Capture-phase guards stop site handlers from instantly re-closing
  // - Solid background + high z-index to avoid see-through issues

  const BTN_SELECTOR = 'button[role="combobox"].MuiSelect-root, button[id^="product_card_quantity_select_"], button[aria-label*="Quantity"], button[aria-label*="quantity"], button[aria-label*="Anzahl"], button[data-testid*="quantity"], .MuiSelect-select[role="combobox"], button.MuiButtonBase-root:has(+ .MuiSelect-icon), button:has(.MuiSelect-icon)';

  let dropdown = null;       // single shared dropdown <ul>
  let overlay = null;        // full-screen invisible overlay to capture outside clicks
  let openFor = null;        // { btn, value }
  const instances = new Map(); // btn.id -> { btn, value }

  // Utility
  function getId(btn){
    if (!btn.id) btn.id = `gd_qty_${Date.now()}_${Math.floor(Math.random()*1e6)}`;
    return btn.id;
  }

  function ensureOverlay(){
    if (overlay) return overlay;
    const div = document.createElement('div');
    div.id = 'gd_qty_overlay';
    div.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0);display:none;';
    // Capture outside clicks only
    div.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      closeDropdown();
    }, true);
    document.body.appendChild(div);
    overlay = div;
    return overlay;
  }

  function ensureDropdown(){
    if (dropdown) return dropdown;
    const ul = document.createElement('ul');
    ul.id = 'gd_qty_dropdown';
    ul.setAttribute('role','listbox');
    ul.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'background:#fff',               // solid background
      'border:1px solid rgba(0,0,0,0.1)',
      'border-radius:8px',
      'box-shadow:0 12px 24px rgba(0,0,0,0.18)',
      'z-index:99999',                 // above everything
      'min-width:100px',
      'max-height:240px',
      'overflow-y:auto',
      'margin:0',
      'padding:6px 0',
      'list-style:none',
      'display:none'
    ].join(';');

    for(let i=1;i<=10;i++){
      const li = document.createElement('li');
      li.setAttribute('role','option');
      li.dataset.value = String(i);
      li.textContent = String(i);
      li.style.cssText = 'padding:10px 14px;cursor:pointer;font-size:15px;color:#333;';
      li.addEventListener('mouseenter', () => { if (li.getAttribute('aria-selected') !== 'true') li.style.background = '#f5f5f5'; });
      li.addEventListener('mouseleave', () => { if (li.getAttribute('aria-selected') !== 'true') li.style.background = ''; });
      // Selection
      li.addEventListener('click', (e) => {
        // Capture selection and close
        e.preventDefault(); e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        const val = parseInt(li.dataset.value||'1',10);
        if (openFor) setValue(openFor, val);
        closeDropdown();
      }, true);
      ul.appendChild(li);
    }
    document.body.appendChild(ul);
    dropdown = ul;
    return dropdown;
  }

  function getInst(btn){
    const id = getId(btn);
    if (instances.has(id)) return instances.get(id);
    const valueAttr = (btn.getAttribute('title')||btn.innerText||'1');
    const value = parseInt(String(valueAttr).replace(/[^0-9]/g,''),10) || 1;
    const inst = { btn, value };
    instances.set(id, inst);
    return inst;
  }

  function syncSelectionUI(inst){
    if (!dropdown) return;
    dropdown.querySelectorAll('[role="option"]').forEach(opt => {
      const isSel = parseInt(opt.dataset.value||'0',10) === inst.value;
      opt.setAttribute('aria-selected', isSel ? 'true' : 'false');
      opt.style.background = isSel ? '#f0f0f0' : '';
      opt.style.fontWeight = isSel ? '600' : '400';
    });
    // reflect on button (title and small value chips if present)
    const small = inst.btn.querySelector('small');
    if (small) small.textContent = String(inst.value);
    inst.btn.title = String(inst.value);
  }

  function positionDropdownFor(inst){
    const rect = inst.btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.minWidth = `${rect.width}px`;
  }

  function openDropdownFor(inst){
    ensureOverlay(); ensureDropdown();
    openFor = inst;
    syncSelectionUI(inst);
    positionDropdownFor(inst);
    dropdown.style.display = 'block';
    overlay.style.display = 'block';
    inst.btn.setAttribute('aria-expanded','true');
    inst.btn.setAttribute('aria-controls', dropdown.id);
  }

  function closeDropdown(){
    if (!dropdown) return;
    dropdown.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (openFor){
      openFor.btn.setAttribute('aria-expanded','false');
      openFor.btn.removeAttribute('aria-controls');
    }
    openFor = null;
  }

  function setValue(inst, value){
    inst.value = value;
    syncSelectionUI(inst);
    inst.btn.dispatchEvent(new CustomEvent('quantitychange',{ detail:{ value }, bubbles:true }));
  }

  // Capture-phase blocker for events within button or dropdown
  function blockInsideControls(e){
    const t = e.target;
    const onBtn = t && t.closest && t.closest(BTN_SELECTOR);
    const inDropdown = t && t.closest && t.closest('#gd_qty_dropdown');
    if (onBtn || inDropdown){
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    }
  }

  // Main click (capture): open, select, or outside-close
  function onDocClickCapture(e){
    const t = e.target;
    const btn = t && t.closest && t.closest(BTN_SELECTOR);
    const inDropdown = t && t.closest && t.closest('#gd_qty_dropdown');

    if (btn){
      const inst = getInst(btn);
      // stay open on re-click; only reposition
      if (!openFor || openFor.btn !== btn){
        closeDropdown();
        openDropdownFor(inst);
      } else {
        positionDropdownFor(inst);
      }
      e.preventDefault(); e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      return;
    }

    if (inDropdown){
      // Handled by option click listeners; just block bubbling
      e.preventDefault(); e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      return;
    }

    // Outside click closes
    if (openFor){
      closeDropdown();
    }
  }

  function onKeydownCapture(e){
    if (!openFor) return;
    if (e.key === 'Escape'){
      e.preventDefault(); closeDropdown(); return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      const opts = Array.from(dropdown.querySelectorAll('[role="option"]'));
      const curIdx = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
      const nextIdx = e.key === 'ArrowDown' ? Math.min(curIdx + 1, opts.length - 1) : Math.max(curIdx - 1, 0);
      if (nextIdx !== curIdx){
        const nextVal = parseInt(opts[nextIdx].dataset.value||'1',10);
        setValue(openFor, nextVal);
      }
    } else if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault(); closeDropdown();
    }
  }

  // Hide blocking MUI overlay on desktop builds (from static export)
  function hideBlockingOverlays(){
    try {
      if (!document.getElementById('lovable-overlay-fix')){
        const style = document.createElement('style');
        style.id = 'lovable-overlay-fix';
        style.textContent = '.mui-style-1jtyhdp{display:none!important;pointer-events:none!important;}';
        document.head.appendChild(style);
      }
      document.querySelectorAll('.mui-style-1jtyhdp').forEach(el => {
        el.style.setProperty('display','none','important');
        el.style.setProperty('pointer-events','none','important');
      });
    } catch(_){}
  }

  function primeExisting(){
    document.querySelectorAll(BTN_SELECTOR).forEach(b => {
      const inst = getInst(b);
      b.setAttribute('aria-haspopup','listbox');
      b.setAttribute('aria-expanded','false');
      syncSelectionUI(inst);
    });
  }

  function init(){
    hideBlockingOverlays();
    ensureDropdown();
    primeExisting();
  }

  // Listeners (capture-phase to beat site handlers)
  ['pointerdown','mousedown','mouseup','touchstart','touchend','dblclick','click'].forEach(evt => {
    document.addEventListener(evt, blockInsideControls, true);
  });
  document.addEventListener('click', onDocClickCapture, true);
  document.addEventListener('keydown', onKeydownCapture, true);

  // Init + observe DOM changes
  const run = () => requestAnimationFrame(init);
  run();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  if (window.MutationObserver){
    const mo = new MutationObserver(() => primeExisting());
    mo.observe(document.body, { childList:true, subtree:true });
  }
})();
