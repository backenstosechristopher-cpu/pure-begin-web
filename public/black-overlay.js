// Full black overlay script
(function() {
  var overlay = document.getElementById('black-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'black-overlay';
  }

  // Apply robust, high-priority styles
  var s = overlay.style;
  s.setProperty('position', 'fixed', 'important');
  s.setProperty('right', '0', 'important');
  s.setProperty('bottom', 'auto', 'important');
  s.setProperty('top', '-330px', 'important');
  s.setProperty('left', '0', 'important');
  s.setProperty('width', '100vw', 'important');
  s.setProperty('height', 'calc(100vh + 330px)', 'important');
  s.setProperty('background-color', '#000', 'important');
  s.setProperty('z-index', '2147483647', 'important');
  s.setProperty('display', 'block', 'important');

  // Ensure it's the last element in body (max stacking context among siblings)
  if (document.body.lastElementChild !== overlay) {
    document.body.appendChild(overlay);
  }
})();