(function(){
  // Quantity Select Manager using event delegation so ALL selectors work
  const BTN_SELECTOR = 'button[role="combobox"].MuiSelect-root, button[id^="product_card_quantity_select_"]';
  const instances = new Map(); // id -> { btn, dropdown, isOpen, value }

  function getId(btn, idx){
    if (!btn.id) btn.id = `gd_qty_${Date.now()}_${idx ?? Math.floor(Math.random()*1e6)}`;
    return btn.id;
  }

  function createDropdown(id){
    const ul = document.createElement('ul');
    ul.setAttribute('role','listbox');
    ul.id = id + '_listbox';
    ul.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'background:#fff',
      'border:1px solid #ddd',
      'border-radius:8px',
      'box-shadow:0 12px 24px rgba(0,0,0,0.2)',
      'z-index:99999',
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
      ul.appendChild(li);
    }
    document.body.appendChild(ul);
    return ul;
  }

  function syncSelectionUI(inst){
    const { btn, dropdown, value } = inst;
    dropdown.querySelectorAll('[role="option"]').forEach(opt => {
      const isSel = parseInt(opt.dataset.value||'0',10) === value;
      opt.setAttribute('aria-selected', isSel ? 'true' : 'false');
      opt.style.background = isSel ? '#f0f0f0' : '';
      opt.style.fontWeight = isSel ? '600' : '400';
    });
    const small = btn.querySelector('small');
    if (small) small.textContent = String(value);
    btn.title = String(value);
  }

  function positionDropdown(inst){
    const { btn, dropdown } = inst;
    const rect = btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.minWidth = `${rect.width}px`;
  }

  function closeAll(exceptId){
    console.log('[QTY] Closing all dropdowns except:', exceptId);
    instances.forEach((inst, id) => {
      if (id === exceptId) return;
      if (inst.isOpen){
        inst.isOpen = false;
        inst.dropdown.style.display = 'none';
        inst.btn.setAttribute('aria-expanded','false');
        inst.btn.removeAttribute('aria-controls');
      }
    });
  }

  function open(inst){
    console.log('[QTY] Opening dropdown for:', inst.btn.id);
    inst.isOpen = true;
    positionDropdown(inst);
    ignoreOutsideUntil = Date.now() + 900;
    inst.dropdown.style.display = 'block';
    inst.btn.setAttribute('aria-expanded','true');
    inst.btn.setAttribute('aria-controls', inst.dropdown.id);

    // Temporary global guard to block outside click-away handlers
    const guard = (ev) => {
      if (Date.now() < ignoreOutsideUntil) {
        ev.preventDefault();
        ev.stopPropagation();
        if (typeof ev.stopImmediatePropagation === 'function') ev.stopImmediatePropagation();
      } else {
        document.removeEventListener('mousedown', guard, true);
        document.removeEventListener('pointerdown', guard, true);
        document.removeEventListener('click', guard, true);
        document.removeEventListener('touchstart', guard, true);
        document.removeEventListener('touchend', guard, true);
        document.removeEventListener('mouseup', guard, true);
        document.removeEventListener('pointerup', guard, true);
        document.removeEventListener('focusin', guard, true);
        document.removeEventListener('focusout', guard, true);
      }
    };
    document.addEventListener('mousedown', guard, true);
    document.addEventListener('pointerdown', guard, true);
    document.addEventListener('click', guard, true);
    document.addEventListener('touchstart', guard, true);
    document.addEventListener('touchend', guard, true);
    document.addEventListener('mouseup', guard, true);
    document.addEventListener('pointerup', guard, true);
    document.addEventListener('focusin', guard, true);
    document.addEventListener('focusout', guard, true);

    console.log('[QTY] Dropdown opened, ignoring outside clicks until:', new Date(ignoreOutsideUntil));
  }

  function close(inst){
    console.log('[QTY] Closing dropdown for:', inst.btn.id);
    inst.isOpen = false;
    inst.dropdown.style.display = 'none';
    inst.btn.setAttribute('aria-expanded','false');
    inst.btn.removeAttribute('aria-controls');
  }

  function selectValue(inst, val){
    inst.value = val;
    syncSelectionUI(inst);
    close(inst);
    inst.btn.dispatchEvent(new CustomEvent('quantitychange',{ detail:{ value: val }, bubbles:true }));
  }

  function getOrInit(btn){
    const id = getId(btn);
    if (instances.has(id)) return instances.get(id);
    const dropdown = createDropdown(id);
    const value = parseInt((btn.getAttribute('title')||'1').replace(/[^0-9]/g,''),10) || 1;
    const inst = { btn, dropdown, isOpen:false, value };
    syncSelectionUI(inst);
    instances.set(id, inst);
    return inst;
  }

  let isToggling = false;
  let ignoreOutsideUntil = 0;
  let suppressClicksUntil = 0;
  
  // Delegated clicks (capture) to beat MUI handlers
  function onDocClickCapture(e){
    // Suppress duplicate click after pointerdown and run earlier than other libs
    if (e.type === 'pointerdown') {
      suppressClicksUntil = Date.now() + 600;
    } else if (e.type === 'click' && Date.now() < suppressClicksUntil) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      return;
    }
    console.log('[QTY] Click detected on:', e.target, 'at time:', Date.now(), 'type:', e.type);
    const target = e.target;
    const btn = (target && (target.closest && target.closest(BTN_SELECTOR))) || null;
    // Click on a quantity button toggles its dropdown
    if (btn){
      console.log('[QTY] Button click detected:', btn.id);
      if (isToggling) {
        console.log('[QTY] Still toggling, ignoring click');
        return;
      }
      isToggling = true;
      setTimeout(() => isToggling = false, 50);
      
      const inst = getOrInit(btn);
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      closeAll(inst.btn.id);
      inst.isOpen ? close(inst) : open(inst);
      return;
    }
    // Click on an option inside any dropdown
    const anyDropdown = (target && target.closest && target.closest('ul[role="listbox"]'));
    if (anyDropdown){
      console.log('[QTY] Dropdown option click detected');
      // find instance owning this dropdown
      const inst = Array.from(instances.values()).find(x => x.dropdown === anyDropdown);
      if (inst){
        const opt = target.closest('[role="option"]');
        if (opt && opt.dataset.value){
          e.preventDefault();
          e.stopPropagation();
          if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
          selectValue(inst, parseInt(opt.dataset.value,10));
        }
      }
      return;
    }
    // Otherwise: close all if clicking outside
    console.log('[QTY] Outside click, current time:', Date.now(), 'ignore until:', ignoreOutsideUntil);
    if (Date.now() < ignoreOutsideUntil) {
      console.log('[QTY] Ignoring outside click due to recent open');
      return;
    }
    console.log('[QTY] Processing outside click - closing all');
    closeAll(null);
  }

  // Keyboard handling (capture) for focused buttons
  function onDocKeydownCapture(e){
    const active = document.activeElement;
    if (!active) return;
    if (!active.matches || !active.matches(BTN_SELECTOR)) return;
    const inst = getOrInit(active);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      if (!inst.isOpen) open(inst);
      const opts = Array.from(inst.dropdown.querySelectorAll('[role="option"]'));
      const curIdx = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
      const nextIdx = e.key === 'ArrowDown' ? Math.min(curIdx + 1, opts.length - 1) : Math.max(curIdx - 1, 0);
      if (nextIdx !== curIdx) selectValue(inst, parseInt(opts[nextIdx].dataset.value||'1',10));
    } else if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      inst.isOpen ? close(inst) : open(inst);
    } else if (e.key === 'Escape'){
      close(inst);
    }
  }

  document.addEventListener('pointerdown', onDocClickCapture, true);
  document.addEventListener('click', onDocClickCapture, true);
  document.addEventListener('keydown', onDocKeydownCapture, true);

  // Ensure ARIA base for any existing matching buttons
  function primeExisting(){
    document.querySelectorAll(BTN_SELECTOR).forEach((b, idx) => {
      const inst = getOrInit(b);
      b.setAttribute('aria-haspopup','listbox');
      b.setAttribute('aria-expanded', inst.isOpen ? 'true' : 'false');
      // sync once to reflect current title
      syncSelectionUI(inst);
    });
  }

  const run = () => requestAnimationFrame(primeExisting);
  run();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  if (window.MutationObserver){
    const mo = new MutationObserver(run);
    mo.observe(document.body,{ childList:true, subtree:true });
  }
  setTimeout(run,100); setTimeout(run,400); setTimeout(run,1000);
})();
