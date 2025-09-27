(function(){
  // Minimal, safe Quantity Selector with capture-based delegation (no global overlays)
  const BTN_SELECTOR = 'button[id^="product_card_quantity_select_"], button[id*="quantity_select"]';
  const instances = new Map(); // id -> { btn, dropdown, isOpen, value }

  function getId(btn){
    if (!btn.id) btn.id = `gd_qty_${Date.now()}_${Math.floor(Math.random()*1e6)}`;
    return btn.id;
  }

  function createDropdown(id, initial){
    const ul = document.createElement('ul');
    ul.setAttribute('role','listbox');
    ul.id = id + '_listbox';
    ul.style.cssText = [
      'position:absolute',
      'top:0',
      'left:0',
      'background:#fff',
      'border:1px solid #e5e7eb',
      'border-radius:8px',
      'box-shadow:0 12px 24px rgba(0,0,0,0.18)',
      'z-index:2147483646',
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
      li.style.cssText = 'padding:10px 14px;cursor:pointer;font-size:15px;color:#111827;';
      if (i === initial) {
        li.setAttribute('aria-selected','true');
        li.style.fontWeight = '600';
        li.style.background = '#f3f4f6';
      } else {
        li.setAttribute('aria-selected','false');
      }
      li.addEventListener('mouseenter', () => { if (li.getAttribute('aria-selected') !== 'true') li.style.background = '#f9fafb'; });
      li.addEventListener('mouseleave', () => { if (li.getAttribute('aria-selected') !== 'true') li.style.background = ''; });
      ul.appendChild(li);
    }

    document.body.appendChild(ul);
    return ul;
  }

  function syncUI(inst){
    const { btn, dropdown, value } = inst;
    dropdown.querySelectorAll('[role="option"]').forEach(opt => {
      const isSel = parseInt(opt.dataset.value||'0',10) === value;
      opt.setAttribute('aria-selected', isSel ? 'true' : 'false');
      opt.style.background = isSel ? '#f3f4f6' : '';
      opt.style.fontWeight = isSel ? '600' : '400';
    });
    const small = btn.querySelector('small');
    if (small) small.textContent = String(value);
    btn.title = String(value);
  }

  function position(inst){
    const { btn, dropdown } = inst;
    const rect = btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
    dropdown.style.minWidth = `${rect.width}px`;
  }

  function close(inst){
    if (!inst || !inst.isOpen) return;
    inst.isOpen = false;
    inst.dropdown.style.display = 'none';
    inst.btn.setAttribute('aria-expanded','false');
    inst.btn.removeAttribute('aria-controls');
  }

  function closeAll(except){
    instances.forEach((inst, id) => { if (id !== except) close(inst); });
  }

  function open(inst){
    closeAll(inst.btn.id);
    position(inst);
    inst.dropdown.style.display = 'block';
    inst.isOpen = true;
    inst.btn.setAttribute('aria-expanded','true');
    inst.btn.setAttribute('aria-controls', inst.dropdown.id);
  }

  function selectValue(inst, val){
    inst.value = val;
    syncUI(inst);
    close(inst);
    inst.btn.dispatchEvent(new CustomEvent('quantitychange',{ detail:{ value: val }, bubbles:true }));
  }

  function getOrInit(btn){
    const id = getId(btn);
    if (instances.has(id)) return instances.get(id);
    const value = parseInt((btn.getAttribute('title')||'1').replace(/[^0-9]/g,''),10) || 1;
    const dropdown = createDropdown(id, value);
    const inst = { btn, dropdown, isOpen:false, value };
    syncUI(inst);
    instances.set(id, inst);
    return inst;
  }

  // Capture-phase handler to outrun MUI handlers
  function onDocClickCapture(e){
    const target = e.target;
    const btn = (target && target.closest && target.closest(BTN_SELECTOR)) || null;
    if (btn){
      const inst = getOrInit(btn);
      try { console.debug('[qty] button capture', btn.id, { isOpen: inst.isOpen }); } catch(_) {}
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      inst.isOpen ? close(inst) : open(inst);
      try { console.debug('[qty] toggled', { isOpen: inst.isOpen }); } catch(_) {}
      return;
    }

    const anyDropdown = (target && target.closest && target.closest('ul[role="listbox"]'));
    if (anyDropdown){
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

    // Outside click closes all
    closeAll(null);
  }

  // Bubble fallback (no prevent/stop here)
  function onDocClick(e){
    const target = e.target;
    const insideDropdown = target && target.closest && target.closest('ul[role="listbox"]');
    const onButton = target && target.closest && target.closest(BTN_SELECTOR);
    if (insideDropdown || onButton) return;
    closeAll(null);
  }

  function onKeydownCapture(e){
    const active = document.activeElement;
    if (!active || !active.matches || !active.matches(BTN_SELECTOR)) return;
    const inst = getOrInit(active);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      inst.isOpen ? close(inst) : open(inst);
    } else if (e.key === 'Escape') {
      close(inst);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      if (!inst.isOpen) open(inst);
      const opts = Array.from(inst.dropdown.querySelectorAll('[role="option"]'));
      const curIdx = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
      const nextIdx = e.key === 'ArrowDown' ? Math.min(curIdx + 1, opts.length - 1) : Math.max(curIdx - 1, 0);
      if (nextIdx !== curIdx) selectValue(inst, parseInt(opts[nextIdx].dataset.value||'1',10));
    }
  }

  function primeExisting(){
    document.querySelectorAll(BTN_SELECTOR).forEach(btn => {
      const inst = getOrInit(btn);
      btn.setAttribute('aria-haspopup','listbox');
      btn.setAttribute('aria-expanded','false');
      syncUI(inst);
    });
  }

  // Global listeners
  // Capture at window AND document to beat any global stopPropagation in capture
  window.addEventListener('pointerdown', onDocClickCapture, true);
  window.addEventListener('mousedown', onDocClickCapture, true);
  window.addEventListener('click', onDocClickCapture, true);
  document.addEventListener('pointerdown', onDocClickCapture, true);
  document.addEventListener('mousedown', onDocClickCapture, true);
  document.addEventListener('click', onDocClickCapture, true);
  document.addEventListener('click', onDocClick);
  window.addEventListener('keydown', onKeydownCapture, true);
  document.addEventListener('keydown', onKeydownCapture, true);
  // Close on significant scroll or resize with debounce
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => closeAll(null), 100);
  }, { passive:true });
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => closeAll(null), 150);
  });

  const init = () => primeExisting();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  init();

  if (window.MutationObserver){
    const mo = new MutationObserver(() => primeExisting());
    mo.observe(document.body, { childList:true, subtree:true });
  }
})();
