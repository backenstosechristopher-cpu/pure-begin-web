document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    // Add custom CSS
    const style = document.createElement('style');
    style.id = 'custom-blau-quantity';
    style.textContent = `
.custom-quantity-selector {
  position: relative;
  display: inline-block;
  margin: 8px 0;
}
.custom-quantity-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 120px;
  font-size: 14px;
  transition: all 0.2s ease;
}
.custom-quantity-btn:hover {
  border-color: #ffa81e;
  box-shadow: 0 2px 8px rgba(255, 168, 30, 0.2);
}
.custom-quantity-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: none;
}
.custom-quantity-dropdown.open {
  display: block;
}
.custom-quantity-option {
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}
.custom-quantity-option:hover {
  background: #f8f9fa;
}
.custom-quantity-option:last-child {
  border-bottom: none;
}
.custom-quantity-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #666;
  transition: transform 0.2s ease;
}
.custom-quantity-btn.open .custom-quantity-arrow {
  transform: rotate(180deg);
}
    `;
    document.head.appendChild(style);
    
    // Find quantity selectors and add custom ones
    const quantitySelectors = document.querySelectorAll('[id*="product_card_quantity_select"]');
    
    quantitySelectors.forEach(function(selector, index) {
      const customSelector = document.createElement('div');
      customSelector.className = 'custom-quantity-selector';
      customSelector.innerHTML = `
        <div class="custom-quantity-btn" data-index="${index}">
          <span class="quantity-text">Menge: 1</span>
          <div class="custom-quantity-arrow"></div>
        </div>
        <div class="custom-quantity-dropdown">
          <div class="custom-quantity-option" data-value="1">1</div>
          <div class="custom-quantity-option" data-value="2">2</div>
          <div class="custom-quantity-option" data-value="3">3</div>
          <div class="custom-quantity-option" data-value="4">4</div>
          <div class="custom-quantity-option" data-value="5">5</div>
          <div class="custom-quantity-option" data-value="10">10</div>
        </div>
      `;
      
      selector.parentNode.insertBefore(customSelector, selector.nextSibling);
      
      const btn = customSelector.querySelector('.custom-quantity-btn');
      const dropdown = customSelector.querySelector('.custom-quantity-dropdown');
      const options = customSelector.querySelectorAll('.custom-quantity-option');
      const quantityText = customSelector.querySelector('.quantity-text');
      
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-quantity-dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.parentNode.querySelector('.custom-quantity-btn').classList.remove('open');
          }
        });
        
        dropdown.classList.toggle('open');
        btn.classList.toggle('open');
      });
      
      options.forEach(function(option) {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          const value = this.dataset.value;
          quantityText.textContent = `Menge: ${value}`;
          dropdown.classList.remove('open');
          btn.classList.remove('open');
          
          const originalSelect = selector.querySelector('input, select');
          if (originalSelect) {
            originalSelect.value = value;
          }
        });
      });
      
      document.addEventListener('click', function() {
        dropdown.classList.remove('open');
        btn.classList.remove('open');
      });
    });
    
    console.log('Custom Blau quantity selectors added:', quantitySelectors.length);
  }, 500);
});