(function(){
  // Lightweight Quantity Selector - rebuilt from scratch to avoid interfering with page
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
      'background:#fff', // ensure non-transparent background
      'border:1px solid #e5e7eb',
      'border-radius:8px',
      'box-shadow:0 12px 24px rgba(0,0,0,0.18)',
      'z-index:2147483646', // very high, but below any important app-specific layers
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
      li.addEventListener('mouseenter', () => {
        if (li.getAttribute('aria-selected') !== 'true') li.style.background = '#f9fafb';
      });
      li.addEventListener('mouseleave', () => {
        if (li.getAttribute('aria-selected') !== 'true') li.style.background = '';
      });
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

  function onButtonClick(e){
    const btn = e.currentTarget;
    const inst = getOrInit(btn);
    e.preventDefault();
    e.stopPropagation(); // only stop for this button click
    inst.isOpen ? close(inst) : open(inst);
  }

  function onOptionClick(e){
    const opt = e.target.closest('[role="option"]');
    if (!opt) return;
    const ul = opt.closest('ul[role="listbox"]');
    const inst = Array.from(instances.values()).find(x => x.dropdown === ul);
    if (!inst) return;
    e.preventDefault();
    e.stopPropagation();
    const val = parseInt(opt.dataset.value||'1',10);
    selectValue(inst, val);
  }

  function onDocClick(e){
    const target = e.target;
    // if click inside any dropdown or on its button, ignore
    const insideDropdown = target && target.closest && target.closest('ul[role="listbox"]');
    const onButton = target && target.closest && target.closest(BTN_SELECTOR);
    if (insideDropdown || onButton) return;
    closeAll(null);
  }

  function onKeydown(e){
    const active = document.activeElement;
    if (!active || !active.matches || !active.matches(BTN_SELECTOR)) return;
    const inst = getOrInit(active);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inst.isOpen ? close(inst) : open(inst);
    } else if (e.key === 'Escape') {
      close(inst);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      if (!inst.isOpen) open(inst);
      const opts = Array.from(inst.dropdown.querySelectorAll('[role="option"]'));
      const curIdx = opts.findIndex(o => o.getAttribute('aria-selected') === 'true');
      const nextIdx = e.key === 'ArrowDown' ? Math.min(curIdx + 1, opts.length - 1) : Math.max(curIdx - 1, 0);
      if (nextIdx !== curIdx) selectValue(inst, parseInt(opts[nextIdx].dataset.value||'1',10));
    }
  }

  function attach(){
    document.querySelectorAll(BTN_SELECTOR).forEach(btn => {
      const inst = getOrInit(btn);
      btn.setAttribute('aria-haspopup','listbox');
      btn.setAttribute('aria-expanded','false');
      // bind once
      if (!btn.dataset.qtyBound){
        btn.addEventListener('click', onButtonClick);
        btn.addEventListener('keydown', onKeydown);
        btn.dataset.qtyBound = 'true';
      }
      // bind dropdown click once
      if (!inst.dropdown.dataset.qtyBound){
        inst.dropdown.addEventListener('click', onOptionClick);
        inst.dropdown.dataset.qtyBound = 'true';
      }
    });
  }

  // Global, but passive/harmless listeners
  document.addEventListener('click', onDocClick);
  window.addEventListener('scroll', () => closeAll(null), { passive:true });
  window.addEventListener('resize', () => closeAll(null));

  // Initial and mutation-driven attach
  const init = () => attach();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  init();

  if (window.MutationObserver){
    const mo = new MutationObserver(() => attach());
    mo.observe(document.body, { childList:true, subtree:true });
  }
})();

