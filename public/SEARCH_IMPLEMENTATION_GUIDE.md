# Search Functionality Implementation Guide

## Overview
This guide explains how to enable the universal search functionality across all pages of the Guthaben.de website (both desktop and mobile versions).

## Files Created

### Search Scripts
- **Desktop:**
  - `public/desktop/assets/universal-search.js` - Main search functionality
  - `public/desktop/assets/logo-redirect-fix.js` - Logo redirect fix
  - `public/search-injector-desktop.js` - Auto-loader script

- **Mobile:**
  - `public/mobile/assets/universal-search.js` - Mobile search with overlay
  - `public/mobile/assets/logo-redirect-fix.js` - Logo redirect fix  
  - `public/search-injector-mobile.js` - Auto-loader script

## How It Works

The search scripts automatically:
1. Detect the search input field on any page (using multiple selectors)
2. Bind search functionality with live product suggestions
3. Navigate to correct product pages on click
4. Fix logo redirects to point to `guthaben.de_.html`

## Implementation Methods

### Method 1: Using Auto-Injector Scripts (Recommended)

Add ONE line before `</body>` tag in each HTML file:

**For Desktop pages:**
```html
<script src="../search-injector-desktop.js"></script>
</body></html>
```

**For Mobile pages:**
```html
<script src="../search-injector-mobile.js"></script>
</body></html>
```

The injector scripts will automatically load the required search and logo-fix scripts.

### Method 2: Direct Script Loading

Alternatively, load scripts directly before `</body>`:

**For Desktop:**
```html
<script src="assets/universal-search.js"></script>
<script src="assets/logo-redirect-fix.js"></script>
</body></html>
```

**For Mobile:**
```html
<script src="assets/universal-search.js"></script>
<script src="assets/logo-redirect-fix.js"></script>
</body></html>
```

## Pages That Need Updates

### Desktop Directory (`public/desktop/`)
All `guthaben.de_*.html` files (~600 files) need the script tag added

### Mobile Directory (`public/mobile/`)
All `guthaben.de_*.html` files (~600 files) need the script tag added

## Already Implemented

✅ `public/desktop/guthaben.de.html` - Homepage (using direct scripts)
✅ `public/desktop/guthaben.de_google-play-guthaben.html` - Example product page
✅ `public/mobile/guthaben.de.html` - Mobile homepage

## Testing

To verify the search works on a page:
1. Open the page in a browser
2. Look for the search input field in the header
3. Type a product name (e.g., "PlayStation", "Amazon", "Netflix")
4. You should see search results dropdown appear
5. Click any result to navigate to that product page
6. Check console for `[Search] initialized` or similar logs

## Search Features

- **Smart scoring algorithm**: Exact matches > starts-with > contains > category match
- **Live filtering**: Results update as you type
- **Product categories**: Gaming, Shopping, Streaming, Mobilfunk, etc.
- **Responsive design**: Works on all screen sizes
- **MutationObserver**: Handles dynamic content loading
- **Multiple input detection**: Finds search field by ID, class, role, or placeholder

## Troubleshooting

If search doesn't work on a page:
1. Check browser console for error messages
2. Verify the script tag is present before `</body>`
3. Check that `assets/universal-search.js` path is correct relative to the HTML file
4. Ensure the page has a search input field with one of these:
   - `id="search-field-input"`
   - `class="MuiAutocomplete-input"`
   - `role="combobox"`
   - `placeholder` containing "Suche"

## Product URLs

All search results link to pages in the format:
- `guthaben.de_playstation-network-psn-guthabenkarte.html`
- `guthaben.de_vodafone-aufladen.html`
- `guthaben.de_amazon-gutschein.html`
- etc.

Make sure these product page files exist in the same directory as the page including the search.

## Batch Update Script (Optional)

For updating all files at once, you can use a shell script:

```bash
# Desktop pages
for file in public/desktop/guthaben.de_*.html; do
  if ! grep -q "search-injector-desktop.js" "$file"; then
    sed -i 's|</body></html>|<script src="../search-injector-desktop.js"></script>\n</body></html>|' "$file"
  fi
done

# Mobile pages  
for file in public/mobile/guthaben.de_*.html; do
  if ! grep -q "search-injector-mobile.js" "$file"; then
    sed -i 's|</body></html>|<script src="../search-injector-mobile.js"></script>\n</body></html>|' "$file"
  fi
done
```

## Support

The search scripts include console logging for debugging. Open browser DevTools and check Console tab for messages like:
- `[Search] initialized`
- `[Search] input: <query>, results: <count>`
- `[Logo Fix] Updated logo link`
