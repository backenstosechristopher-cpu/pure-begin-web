# Universal Quantity Enhancement Deployment Guide

## Overview
The quantity enhancement system has been expanded to work on all pages with MUI quantity selector buttons.

## Files Created

### Universal Script
- `shared/universal-quantity-enhancement.js` - Master script that works on any page

### Category-Specific Scripts (copies of universal script)
- `desktop/amazon-quantity-enhancement.js` & `mobile/amazon-quantity-enhancement.js`
- `desktop/google-play-quantity-enhancement.js` & `mobile/google-play-quantity-enhancement.js`
- `desktop/apple-quantity-enhancement.js` & `mobile/apple-quantity-enhancement.js`
- `desktop/telekom-quantity-enhancement.js` & `mobile/telekom-quantity-enhancement.js` (already deployed)

## How to Deploy to HTML Pages

For any HTML page with quantity selector buttons, add the appropriate script before the closing `</body>` tag:

```html
<script src="[category]-quantity-enhancement.js"></script>
</body>
```

## Categories and Their Pages

### Amazon Pages
Add `<script src="amazon-quantity-enhancement.js"></script>` to:
- All files matching `guthaben.de_amazon-*`

### Google Play Pages  
Add `<script src="google-play-quantity-enhancement.js"></script>` to:
- All files matching `guthaben.de_google-play-*`

### Apple Pages
Add `<script src="apple-quantity-enhancement.js"></script>` to:
- All files matching `guthaben.de_apple-*`

### Telekom Pages (Already Done)
- `guthaben.de_telekom.html` and variants

### Other Categories
For any other product pages with quantity selectors, use the universal script:
```html
<script src="../shared/universal-quantity-enhancement.js"></script>
```

## What It Does

The enhancement script:
1. **Auto-detects** all quantity selector buttons on page load
2. **Replaces native dropdowns** with a custom Shadow DOM dropdown
3. **Prevents auto-closing** - only closes on selection or delayed outside click
4. **Blocks MUI overlays** that interfere with functionality
5. **Maintains ARIA accessibility** attributes
6. **Logs detection** to console for debugging

## Targeted Button Selectors

The script targets these button patterns:
- `button[role="combobox"].MuiSelect-root`
- `button[id^="product_card_quantity_select_"]`
- `button[aria-label*="Quantity"]` or `button[aria-label*="quantity"]`
- `button[aria-label*="Anzahl"]` (German)
- `button[data-testid*="quantity"]`
- `.MuiSelect-select[role="combobox"]`
- `button.MuiButtonBase-root:has(+ .MuiSelect-icon)`
- `button:has(.MuiSelect-icon)`

## Testing

After deployment, the console will show:
```
Universal quantity enhancement loaded for [X] buttons
```

Where [X] is the number of quantity buttons found on the page.

## Current Status

✅ **Deployed**: Telekom pages (desktop & mobile)
🔄 **Ready for deployment**: Amazon, Google Play, Apple, and other category scripts
📝 **Next step**: Add script tags to HTML pages according to categories above