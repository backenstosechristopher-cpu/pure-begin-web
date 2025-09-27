/**
 * Blau Guthaben Enhanced Quantity Selector
 * Shadow DOM-based quantity selector with solid background and high z-index
 */
(function() {
    'use strict';
    
    console.log('Blau quantity enhancement loading...');
    
    // Create shadow host with ultra-high z-index
    const shadowHost = document.createElement('div');
    shadowHost.id = 'blau-qty-shadow-host';
    shadowHost.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
    `;
    document.body.appendChild(shadowHost);
    
    // Attach shadow root
    const shadow = shadowHost.attachShadow({ mode: 'closed' });
    
    // Enhanced CSS with solid backgrounds and high z-index
    shadow.innerHTML = `
        <style>
            :host {
                all: initial;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999999;
            }
            
            .qty-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.2);
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
                pointer-events: none;
                z-index: 999998;
            }
            
            .qty-overlay.open {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
            
            .qty-panel {
                position: absolute;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                min-width: 120px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.2s ease;
                z-index: 999999;
                pointer-events: auto;
            }
            
            .qty-panel.open {
                opacity: 1;
                transform: translateY(0);
            }
            
            .qty-list {
                list-style: none;
                margin: 0;
                padding: 4px 0;
                background: #ffffff;
                border-radius: 8px;
            }
            
            .qty-option {
                display: block;
                width: 100%;
                padding: 12px 16px;
                margin: 0;
                background: #ffffff;
                border: none;
                text-align: left;
                cursor: pointer;
                font-size: 14px;
                font-family: sofia-pro, sans-serif;
                color: #333333;
                transition: background-color 0.15s ease;
                border-radius: 0;
            }
            
            .qty-option:hover {
                background-color: #f5f5f5;
                color: #0066cc;
            }
            
            .qty-option:first-child {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            
            .qty-option:last-child {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            
            .qty-option.selected {
                background-color: #0066cc;
                color: #ffffff;
                font-weight: 600;
            }
            
            .qty-option.selected:hover {
                background-color: #0052a3;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .qty-panel {
                    border: 2px solid #000000;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                .qty-option {
                    border-bottom: 1px solid #cccccc;
                }
                .qty-option:last-child {
                    border-bottom: none;
                }
            }
        </style>
        
        <div class="qty-overlay"></div>
        <div class="qty-panel">
            <ul class="qty-list"></ul>
        </div>
    `;
    
    // Get DOM elements
    const overlayEl = shadow.querySelector('.qty-overlay');
    const panelEl = shadow.querySelector('.qty-panel');
    const listEl = shadow.querySelector('.qty-list');
    
    let currentBtn = null;
    let minOpenUntil = 0;
    
    // Extract current quantity value
    function getCurrentValue(btn) {
        const valueEl = btn.querySelector('[aria-expanded]') || 
                       btn.querySelector('span') ||
                       btn;
        const text = valueEl.textContent || valueEl.innerText || '';
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }
    
    // Render quantity options
    function renderOptions(selected) {
        listEl.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('button');
            option.className = `qty-option ${i === selected ? 'selected' : ''}`;
            option.textContent = i;
            option.setAttribute('data-value', i);
            option.addEventListener('click', () => selectValue(i));
            listEl.appendChild(option);
        }
    }
    
    // Position panel near button
    function positionPanelNear(btn) {
        const rect = btn.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let top = rect.bottom + 5;
        let left = rect.left;
        
        // Adjust if panel would go off-screen
        if (top + 300 > viewportHeight) {
            top = rect.top - 305;
        }
        
        if (left + 120 > viewportWidth) {
            left = viewportWidth - 125;
        }
        
        if (left < 5) {
            left = 5;
        }
        
        panelEl.style.top = top + 'px';
        panelEl.style.left = left + 'px';
    }
    
    // Open quantity selector
    function openFor(btn) {
        currentBtn = btn;
        minOpenUntil = Date.now() + 300;
        
        const currentValue = getCurrentValue(btn);
        renderOptions(currentValue);
        positionPanelNear(btn);
        
        overlayEl.classList.add('open');
        panelEl.classList.add('open');
        
        console.log('Blau quantity selector opened for:', btn);
    }
    
    // Close quantity selector
    function close() {
        overlayEl.classList.remove('open');
        panelEl.classList.remove('open');
        currentBtn = null;
        minOpenUntil = 0;
    }
    
    // Select quantity value
    function selectValue(val) {
        if (!currentBtn) return;
        
        // Update button display
        const valueEl = currentBtn.querySelector('[aria-expanded]') || 
                       currentBtn.querySelector('span') ||
                       currentBtn;
        
        if (valueEl) {
            const currentText = valueEl.textContent || valueEl.innerText || '';
            const newText = currentText.replace(/\d+/, val);
            
            if (valueEl.textContent !== undefined) {
                valueEl.textContent = newText;
            } else {
                valueEl.innerText = newText;
            }
        }
        
        // Dispatch change event
        const event = new CustomEvent('quantitychange', {
            detail: { value: val, button: currentBtn },
            bubbles: true,
            cancelable: true
        });
        currentBtn.dispatchEvent(event);
        
        close();
        console.log('Blau quantity selected:', val);
    }
    
    // Handle overlay clicks - close when clicking outside panel
    overlayEl.addEventListener('click', (e) => {
        if (Date.now() > minOpenUntil && !panelEl.contains(e.target)) {
            close();
        }
    });
    
    // Block interactions while open
    function whileOpenBlocker(e) {
        if (!overlayEl.classList.contains('open')) return;
        if (panelEl.contains(e.target) || currentBtn?.contains(e.target)) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    
    // Detect quantity button clicks
    function maybeOpen(e) {
        const btn = e.target.closest('[id*="quantity"], [class*="quantity"], .MuiSelect-root, [role="combobox"]');
        if (btn && (btn.id?.includes('quantity') || btn.className?.includes('quantity') || 
                   btn.className?.includes('MuiSelect') || btn.getAttribute('role') === 'combobox')) {
            
            e.preventDefault();
            e.stopPropagation();
            openFor(btn);
            return false;
        }
    }
    
    // Add event listeners
    window.addEventListener('pointerdown', whileOpenBlocker, { capture: true, passive: false });
    window.addEventListener('click', whileOpenBlocker, { capture: true, passive: false });
    document.addEventListener('pointerdown', maybeOpen, { capture: true, passive: false });
    document.addEventListener('click', maybeOpen, { capture: true, passive: false });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlayEl.classList.contains('open')) {
            e.preventDefault();
            close();
        }
    });
    
    // Hide interfering overlays
    function hideBlockingOverlays() {
        const css = `
            .MuiBackdrop-root, .MuiModal-backdrop {
                display: none !important;
                pointer-events: none !important;
            }
        `;
        
        let styleEl = document.getElementById('blau-qty-blocker');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'blau-qty-blocker';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
    }
    
    // Initialize
    function prime() {
        const buttons = document.querySelectorAll('[id*="quantity"], [class*="quantity"], .MuiSelect-root, [role="combobox"]');
        buttons.forEach(btn => {
            btn.setAttribute('aria-haspopup', 'listbox');
            btn.setAttribute('aria-expanded', 'false');
        });
        
        hideBlockingOverlays();
        console.log(`Blau quantity enhancement loaded for ${buttons.length} buttons`);
    }
    
    // Setup observer for dynamic content
    const observer = new MutationObserver(() => {
        prime();
        hideBlockingOverlays();
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', prime);
    } else {
        prime();
    }
    
    window.addEventListener('load', prime);
    observer.observe(document.body, { childList: true, subtree: true });
})();