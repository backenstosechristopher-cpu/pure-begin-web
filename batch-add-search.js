// Batch update script to add search injectors to all HTML files
// Run with: node batch-add-search.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Desktop pages that need the injector
const desktopPages = [
  'guthaben.de_.html',
  'guthaben.de_ueber-uns.html',
  'guthaben.de_google-play-guthaben.html',
  'guthaben.de_psn-card.html',
  'guthaben.de_luckydeal.html',
  'guthaben.de_handy-aufladen.html',
  'guthaben.de_e-plus-aufladen.html',
  'guthaben.de_vodafone-aufladen.html',
  'guthaben.de_telekom.html',
  'guthaben.de_lycamobile-aufladen.html',
  'guthaben.de_ortel-mobile-aufladen.html',
  'guthaben.de_blau-de-aufladen.html',
  'guthaben.de_congstar-aufladen.html',
  'guthaben.de_lebara-aufladen.html',
  'guthaben.de_fonic-aufladen.html',
  'guthaben.de_klarmobil-aufladen.html',
  'guthaben.de_otelo-aufladen.html',
  'guthaben.de_bildmobil-aufladen.html',
  'guthaben.de_blauworld-aufladen.html',
  'guthaben.de_mobi-aufladen.html',
  'guthaben.de_prepaid-zahlungsmittel.html',
  'guthaben.de_paysafecard.html',
  'guthaben.de_cashlib.html',
  'guthaben.de_jeton-cash.html',
  'guthaben.de_transcash.html',
  'guthaben.de_bitsa.html',
  'guthaben.de_a-bon.html',
  'guthaben.de_pcs.html',
  'guthaben.de_mifinity.html',
  'guthaben.de_rewarble-advanced.html',
  'guthaben.de_mint-prepaid.html',
  'guthaben.de_aplauz.html',
  'guthaben.de_flexepin.html',
  'guthaben.de_toneo-first.html',
  'guthaben.de_entertainment-cards.html',
  'guthaben.de_apple-gift-card.html',
  'guthaben.de_netflix-geschenkkarte.html',
  'guthaben.de_spotify-premium.html',
  'guthaben.de_tvnow.html',
  'guthaben.de_tinder-gold.html',
  'guthaben.de_tinder-plus.html',
  'guthaben.de_disney-plus.html',
  'guthaben.de_dazn.html',
  'guthaben.de_eventim.html',
  'guthaben.de_cineplex.html',
  'guthaben.de_jochen-schweizer.html',
  'guthaben.de_microsoft-geschenkkarte.html',
  'guthaben.de_twitch-geschenkkarte.html',
  'guthaben.de_gamecards.html',
  'guthaben.de_paysafecard-players-pass.html',
  'guthaben.de_playstation-plus-mitgliedschaft.html',
  'guthaben.de_steam.html',
  'guthaben.de_xbox-gift-card.html',
  'guthaben.de_nintendo-eshop-card.html',
  'guthaben.de_nintendo-switch-online.html',
  'guthaben.de_roblox-gift-card.html',
  'guthaben.de_battlenet-guthabenkarte.html',
  'guthaben.de_wow-gamecard.html',
  'guthaben.de_league-of-legends-riot-points.html',
  'guthaben.de_valorant.html',
  'guthaben.de_shopping-gutscheine.html',
  'guthaben.de_amazon-gutschein.html',
  'guthaben.de_zalando-gutscheincode.html',
  'guthaben.de_lieferando.html',
  'guthaben.de_uber.html',
  'guthaben.de_airbnb.html',
  'guthaben.de_douglas.html',
  'guthaben.de_nike-gutscheincode.html',
  'guthaben.de_ikea.html',
  'guthaben.de_h-m-geschenkcode.html',
  'guthaben.de_otto-gutscheincode.html',
  'guthaben.de_tchibo.html',
  'guthaben.de_mediamarkt.html',
  'guthaben.de_tk-maxx.html',
  // Add variant pages (prices, etc.) - scan directory for all
];

// Mobile pages
const mobilePages = [
  'guthaben.de_.html',
  'guthaben.de_psn-card.html',
  'guthaben.de_google-play-guthaben.html',
  'guthaben.de_luckydeal.html',
  'guthaben.de_paysafecard.html',
  'guthaben.de_apple-gift-card.html',
  'guthaben.de_paysafecard-players-pass.html',
  'guthaben.de_e-plus-aufladen.html',
  'guthaben.de_amazon-gutschein.html',
  'guthaben.de_aldi-talk-auf.html',
  'guthaben.de_steam.html',
  'guthaben.de_handy-aufladen.html',
  'guthaben.de_vodafone-aufladen.html',
  'guthaben.de_telekom.html',
  'guthaben.de_lycamobile-aufladen.html',
  'guthaben.de_ortel-mobile-aufladen.html',
  'guthaben.de_blau-de-aufladen.html',
  'guthaben.de_congstar-aufladen.html',
  'guthaben.de_lebara-aufladen.html',
  'guthaben.de_prepaid-zahlungsmittel.html',
  'guthaben.de_cashlib.html',
  'guthaben.de_jeton-cash.html',
  'guthaben.de_transcash.html',
  'guthaben.de_bitsa.html',
  'guthaben.de_a-bon.html',
  'guthaben.de_pcs.html',
  'guthaben.de_mifinity.html',
  'guthaben.de_entertainment-cards.html',
  'guthaben.de_netflix-geschenkkarte.html',
  'guthaben.de_spotify-premium.html',
  'guthaben.de_tvnow.html',
  'guthaben.de_tinder-gold.html',
  'guthaben.de_tinder-plus.html',
  'guthaben.de_disney-plus.html',
  'guthaben.de_gamecards.html',
  'guthaben.de_playstation-plus-mitgliedschaft.html',
  'guthaben.de_xbox-gift-card.html',
  'guthaben.de_nintendo-eshop-card.html',
  'guthaben.de_shopping-gutscheine.html',
  'guthaben.de_zalando-gutscheincode.html',
  'guthaben.de_lieferando.html',
  'guthaben.de_uber.html',
  'guthaben.de_airbnb.html',
  'guthaben.de_douglas.html',
  'guthaben.de_nike-gutscheincode.html',
];

function updateFile(filePath, scriptTag) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has the script
    if (content.includes('search-injector')) {
      console.log(`⏭️  Already updated: ${filePath}`);
      return true;
    }

    // Replace </body></html> with script + </body></html>
    const updatedContent = content.replace(
      /<\/body><\/html>/i,
      `${scriptTag}\n</body></html>`
    );

    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  No </body></html> found in: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function getAllHtmlFiles(directory) {
  const files = [];
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip assets directory
      if (item !== 'assets') {
        files.push(...getAllHtmlFiles(fullPath));
      }
    } else if (item.endsWith('.html') && item.startsWith('guthaben.de')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
console.log('🚀 Starting batch search injector update...\n');

// Update desktop files
console.log('📱 Updating DESKTOP files...');
const desktopDir = path.join(__dirname, 'desktop');
const desktopFiles = getAllHtmlFiles(desktopDir);
let desktopUpdated = 0;

for (const file of desktopFiles) {
  if (updateFile(file, '<script src="../search-injector-desktop.js"></script>')) {
    desktopUpdated++;
  }
}

console.log(`\n✨ Desktop: Updated ${desktopUpdated}/${desktopFiles.length} files\n`);

// Update mobile files
console.log('📱 Updating MOBILE files...');
const mobileDir = path.join(__dirname, 'mobile');
const mobileFiles = getAllHtmlFiles(mobileDir);
let mobileUpdated = 0;

for (const file of mobileFiles) {
  if (updateFile(file, '<script src="../search-injector-mobile.js"></script>')) {
    mobileUpdated++;
  }
}

console.log(`\n✨ Mobile: Updated ${mobileUpdated}/${mobileFiles.length} files\n`);

console.log(`🎉 COMPLETE! Total updated: ${desktopUpdated + mobileUpdated} files`);
