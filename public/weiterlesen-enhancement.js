(function() {
    'use strict';

    // Function to initialize Weiterlesen (Read more) functionality
    function initializeWeiterlesenButtons() {
        // Find all "Weiterlesen" buttons/links
        const weiterlesenElements = document.querySelectorAll('[data-text*="Weiterlesen"], .weiterlesen, [class*="weiterlesen"], button:contains("Weiterlesen"), a:contains("Weiterlesen")');
        
        // If no elements found with direct selectors, try finding by text content
        if (weiterlesenElements.length === 0) {
            const allButtons = document.querySelectorAll('button, a, span, div[role="button"]');
            const weiterlesenByText = Array.from(allButtons).filter(el => 
                el.textContent && el.textContent.trim().toLowerCase().includes('weiterlesen')
            );
            weiterlesenByText.forEach(enhanceWeiterlesenElement);
        } else {
            weiterlesenElements.forEach(enhanceWeiterlesenElement);
        }

        console.log(`Enhanced ${weiterlesenElements.length || 0} Weiterlesen buttons`);
    }

    function enhanceWeiterlesenElement(button) {
        // Skip if already enhanced
        if (button.hasAttribute('data-weiterlesen-enhanced')) {
            return;
        }

        // Mark as enhanced
        button.setAttribute('data-weiterlesen-enhanced', 'true');

        // Find the associated text content
        const textContainer = findTextContainer(button);
        if (!textContainer) {
            console.warn('No text container found for Weiterlesen button:', button);
            return;
        }

        // Make button clickable
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';

        // Determine initial state based on button text
        const buttonText = button.textContent.trim().toLowerCase();
        const isWeniger = buttonText.includes('weniger') || buttonText.includes('schließen') || buttonText.includes('zuklappen');
        
        // Add click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            toggleTextContent(button, textContainer);
        });

        // Setup initial state
        if (!isWeniger) {
            // This is a "Weiterlesen" button - setup collapsed state
            setupCollapsedState(button, textContainer);
        } else {
            // This is a "Weniger lesen" button - text is already expanded
            const fullText = textContainer.innerHTML;
            textContainer.setAttribute('data-full-text', fullText);
            textContainer.setAttribute('data-expanded', 'true');
        }
    }

    function findTextContainer(button) {
        // Strategy 1: Look for a sibling or parent element that contains the expandable text
        let container = button.parentElement;
        
        // Look in the same parent for text content
        const textElements = container.querySelectorAll('p, div, span, section');
        for (let element of textElements) {
            if (element !== button && element.textContent.length > 200) {
                return element;
            }
        }

        // Strategy 2: Look for elements with common class names for text content
        const possibleContainers = document.querySelectorAll(
            '.description, .content, .text, .details, .info, [class*="text"], [class*="content"], [class*="description"]'
        );
        
        for (let container of possibleContainers) {
            if (container.contains(button) || isNearElement(button, container)) {
                return container;
            }
        }

        // Strategy 3: Look for the closest element with substantial text content
        let current = button.parentElement;
        while (current && current !== document.body) {
            if (current.textContent.length > 300 && !current.querySelector('button, a')) {
                return current;
            }
            current = current.parentElement;
        }

        return null;
    }

    function isNearElement(button, container) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Check if they're vertically close (within 100px)
        return Math.abs(buttonRect.bottom - containerRect.top) < 100 || 
               Math.abs(containerRect.bottom - buttonRect.top) < 100;
    }

    function setupCollapsedState(button, textContainer) {
        const fullText = textContainer.innerHTML;
        const textContent = textContainer.textContent || textContainer.innerText;
        
        // Create truncated version (first ~300 characters)
        let truncatedText;
        if (textContent.length > 300) {
            const words = textContent.split(' ');
            let truncated = '';
            for (let word of words) {
                if ((truncated + word).length > 280) break;
                truncated += (truncated ? ' ' : '') + word;
            }
            truncatedText = truncated + '...';
        } else {
            truncatedText = textContent;
        }

        // Store full text
        textContainer.setAttribute('data-full-text', fullText);
        textContainer.setAttribute('data-truncated-text', truncatedText);
        textContainer.setAttribute('data-expanded', 'false');
        
        // Show truncated version initially
        textContainer.innerHTML = truncatedText;
    }

    function toggleTextContent(button, textContainer) {
        const isExpanded = textContainer.getAttribute('data-expanded') === 'true';
        const fullText = textContainer.getAttribute('data-full-text');
        const truncatedText = textContainer.getAttribute('data-truncated-text');

        if (isExpanded) {
            // Collapse: show truncated text
            if (truncatedText) {
                textContainer.innerHTML = truncatedText;
            }
            textContainer.setAttribute('data-expanded', 'false');
            // Change button text to "Weiterlesen"
            const newText = button.textContent.replace(/(weniger lesen|schließen|zuklappen)/i, 'Weiterlesen');
            button.textContent = newText;
        } else {
            // Store full text if not already stored
            if (!fullText) {
                textContainer.setAttribute('data-full-text', textContainer.innerHTML);
            }
            
            // Create truncated version if needed
            if (!truncatedText) {
                setupCollapsedState(button, textContainer);
                return; // setupCollapsedState will handle the initial display
            }
            
            // Expand: show full text
            textContainer.innerHTML = textContainer.getAttribute('data-full-text');
            textContainer.setAttribute('data-expanded', 'true');
            // Change button text to "Weniger lesen"  
            const newText = button.textContent.replace(/weiterlesen/i, 'Weniger lesen');
            button.textContent = newText;
        }

        // Smooth scroll to button after expansion
        if (!isExpanded) {
            setTimeout(() => {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        // Dispatch custom event
        const event = new CustomEvent('weiterlesenToggle', {
            detail: { expanded: !isExpanded, button, textContainer }
        });
        document.dispatchEvent(event);
    }

    // Initialize when DOM is ready
    function initialize() {
        initializeWeiterlesenButtons();
        
        // Re-initialize when new content is added dynamically
        const observer = new MutationObserver(function(mutations) {
            let shouldReinitialize = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldReinitialize = true;
                }
            });
            
            if (shouldReinitialize) {
                setTimeout(initializeWeiterlesenButtons, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also run on window load as fallback
    if (document.readyState !== 'complete') {
        window.addEventListener('load', initialize);
    }

})();