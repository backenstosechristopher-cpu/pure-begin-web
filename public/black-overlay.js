// Full black overlay script
(function() {
    // Create the black overlay
    const overlay = document.createElement('div');
    overlay.id = 'black-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: black;
        z-index: 9999;
        display: block;
    `;
    
    // Add overlay to the document
    document.body.insertBefore(overlay, document.body.firstChild);
})();