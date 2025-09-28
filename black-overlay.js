// Create full black overlay for specific guthaben pages
(function() {
    const blackOverlay = document.createElement('div');
    blackOverlay.id = 'full-black-overlay';
    blackOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #000000;
        z-index: 999999;
        pointer-events: none;
    `;
    
    // Add overlay immediately
    if (document.body) {
        document.body.appendChild(blackOverlay);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(blackOverlay);
        });
    }
})();