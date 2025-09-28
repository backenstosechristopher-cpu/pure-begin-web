// Create full black overlay for specific guthaben pages
(function() {
    const blackOverlay = document.createElement('div');
    blackOverlay.id = 'full-black-overlay';
    blackOverlay.style.cssText = `
        position: fixed;
        top: 40px;
        left: 0;
        width: 100vw;
        height: calc(100vh - 40px);
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