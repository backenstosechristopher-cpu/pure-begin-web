/**
 * Blau Guthaben Mobile Enhanced Quantity Selector
 * Shadow DOM-based quantity selector optimized for mobile with solid background
 */
(function() {
    'use strict';
    
    console.log('Blau mobile quantity enhancement loading...');
    
    // Create shadow host with ultra-high z-index
    const shadowHost = document.createElement('div');
    shadowHost.id = 'blau-mobile-qty-shadow-host';
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
    
    // Enhanced mobile CSS with solid backgrounds and high z-index
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
                background: rgba(0, 0, 0, 0.3);
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
                border-radius: 12px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
                min-width: 140px;
                max-width: 200px;
                opacity: 0;
                transform: translateY(-15px);
                transition: all 0.25s ease;
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
                padding: 6px 0;
                background: #ffffff;
                border-radius: 12px;
            }
            
            .qty-option {
                display: block;
                width: 100%;
                padding: 16px 20px;
                margin: 0;
                background: #ffffff;
                border: none;
                text-align: center;
                cursor: pointer;
                font-size: 16px;
                font-family: sofia-pro, sans-serif;
                font-weight: 500;
                color: #333333;
                transition: all 0.2s ease;
                border-radius: 0;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .qty-option:hover,
            .qty-option:active {
                background-color: #f0f8ff;
                color: #0066cc;
                transform: scale(1.02);
            }
            
            .qty-option:first-child {
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            }
            
            .qty-option:last-child {
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
            }
            
            .qty-option.selected {
                background-color: #0066cc;
                color: #ffffff;
                font-weight: 600;
            }
            
            .qty-option.selected:hover,
            .qty-option.selected:active {
                background-color: #0052a3;
                transform: scale(1.02);
            }
            
            /* Mobile-specific enhancements */
            @media (max-width: 768px) {
                .qty-panel {
                    min-width: 120px;
                    border-radius: 16px;
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
                }
                
                .qty-option {
                    padding: 18px 16px;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .qty-list {
                    border-radius: 16px;
                }
                
                .qty-option:first-child {
                    border-radius: 16px 16px 0 0;
                }
                
                .qty-option:last-child {
                    border-radius: 0 0 16px 16px;
                }
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .qty-panel {
                    border: 3px solid #000000;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                }
                .qty-option {
                    border-bottom: 2px solid #cccccc;
                    font-weight: 600;
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
    
    // Position panel near button (mobile optimized)
    function positionPanelNear(btn) {
        const rect = btn.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let top = rect.bottom + 8;
        let left = rect.left + (rect.width / 2) - 60; // Center horizontally
        
        // Adjust if panel would go off-screen
        if (top + 400 > viewportHeight) {
            top = rect.top - 408;
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
        minOpenUntil = Date.now() + 500; // Longer delay for mobile
        
        const currentValue = getCurrentValue(btn);
        renderOptions(currentValue);
        positionPanelNear(btn);
        
        overlayEl.classList.add('open');
        panelEl.classList.add('open');
        
        console.log('Blau mobile quantity selector opened for:', btn);
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
        console.log('Blau mobile quantity selected:', val);
    }
    
    // Handle overlay clicks with mobile delay
    overlayEl.addEventListener('click', (e) => {
        setTimeout(() => {
            if (Date.now() > minOpenUntil && e.target === overlayEl) {
                close();
            }
        }, 50);
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
        
        let styleEl = document.getElementById('blau-mobile-qty-blocker');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'blau-mobile-qty-blocker';
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
        console.log(`Blau mobile quantity enhancement loaded for ${buttons.length} buttons`);
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