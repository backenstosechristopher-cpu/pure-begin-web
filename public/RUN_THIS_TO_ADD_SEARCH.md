# Add Search to All Pages - Instructions

## Quick Start

To add search functionality to all HTML pages at once:

### Option 1: Run the Batch Script (Recommended)

```bash
cd public
node batch-add-search.js
```

This will automatically:
- Find all `guthaben.de_*.html` files in desktop/ and mobile/ directories
- Add the search injector script before `</body></html>`
- Skip files that already have the search script
- Show progress and results

### Option 2: Manual Update

If you prefer to update files manually or the script doesn't work, add these lines before `</body></html>`:

**For desktop/guthaben.de_*.html files:**
```html
<script src="../search-injector-desktop.js"></script>
</body></html>
```

**For mobile/guthaben.de_*.html files:**
```html
<script src="../search-injector-mobile.js"></script>
</body></html>
```

## What Gets Updated

The script will update all product pages like:
- `guthaben.de_google-play-guthaben.html`
- `guthaben.de_psn-card.html`
- `guthaben.de_amazon-gutschein.html`
- `guthaben.de_vodafone-aufladen.html`
- And ~600 more product pages...

## Already Updated

These pages already have search enabled:
- ✅ `desktop/guthaben.de.html` (homepage)
- ✅ `desktop/guthaben.de_google-play-guthaben.html`
- ✅ `mobile/guthaben.de.html` (homepage)

## Verification

After running the script, test a few pages:

1. Open any product page (e.g., `guthaben.de_playstation-network-psn-guthabenkarte.html`)
2. Look for the search input in the header
3. Type a product name (e.g., "Netflix", "Amazon")
4. You should see search results dropdown
5. Click any result to navigate to that product

## Troubleshooting

If search doesn't work after running the script:

1. **Check browser console** for errors
2. **Verify script path** - make sure the relative path `../search-injector-desktop.js` is correct
3. **Clear cache** - do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check the script tag** was added before `</body></html>`

## Manual Check

To verify a file was updated, search for this text in the HTML:
```
search-injector-desktop.js
```
or
```
search-injector-mobile.js
```

## Need Help?

If you encounter any issues:
1. Check the console output from the batch script
2. Look for any error messages
3. Verify the file structure matches the expected paths
4. Make sure Node.js is installed for running the batch script
