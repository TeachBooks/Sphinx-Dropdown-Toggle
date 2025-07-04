document.addEventListener("DOMContentLoaded", () => {
    const toggleButtonId = "toggle-dropdown-button";
    const rootDropdownState = "dropdowns-opened";

    // Check for dropdowns
    const article = document.querySelector('article.bd-article');
    const dropdowns = article ? article.querySelectorAll('details.dropdown, div.dropdown, .sd-dropdown') : [];
    if (dropdowns.length === 0) {
        return; // Exit if no dropdowns found
    }

    // Function to check current state of all dropdowns
    function checkDropdownState() {
        const details = document.querySelectorAll('details.dropdown, details.sd-dropdown');
        const divs = document.querySelectorAll('div.dropdown');
        
        let allOpen = true;
        let allClosed = true;
        let hasToggleableDropdowns = false;
        
        console.log('Checking dropdown state...');
        
        // Check details elements
        details.forEach((detail, index) => {
            console.log(`Details ${index}:`, detail.open);
            hasToggleableDropdowns = true;
            if (detail.open) {
                allClosed = false;
            } else {
                allOpen = false;
            }
        });
        
        // Check div dropdowns - only check ones that actually have toggle buttons
        divs.forEach((div, index) => {
            const classes = Array.from(div.classList);
            console.log(`Div ${index} classes:`, classes);
            
            // Only check dropdowns that have toggle buttons (these are the toggleable ones)
            const button = div.querySelector('button.toggle-button');
            if (button) {
                hasToggleableDropdowns = true;
                const buttonClasses = Array.from(button.classList);
                console.log(`Div ${index} button classes:`, buttonClasses);
                
                // Check if the dropdown is closed (has toggle-hidden class)
                if (div.classList.contains('toggle-hidden')) {
                    allOpen = false;
                    console.log(`Div ${index} is closed (has toggle-hidden)`);
                } else {
                    allClosed = false;
                    console.log(`Div ${index} is open (no toggle-hidden)`);
                }
            } else {
                // Skip dropdowns without toggle buttons - they're not part of our toggle system
                console.log(`Div ${index} has no toggle button, skipping from state check`);
            }
        });
        
        // If no toggleable dropdowns found, default to "all closed"
        if (!hasToggleableDropdowns) {
            allOpen = false;
            allClosed = true;
        }
        
        console.log('State check result:', { allOpen, allClosed, hasToggleableDropdowns });
        return { allOpen, allClosed };
    }
    
    // Function to update toggle button based on dropdown state
    function updateToggleButton() {
        const { allOpen, allClosed } = checkDropdownState();
        const button = document.getElementById(toggleButtonId);
        
        console.log('updateToggleButton called:', { allOpen, allClosed });
        
        if (!button) {
            console.log('Toggle button not found');
            return;
        }
        
        if (allOpen) {
            console.log('Setting to "close all" state');
            document.body.classList.add(rootDropdownState);
            button.innerHTML = '<i class="fa-solid fa-angles-up"></i>';
            button.title = "Close all dropdowns";
        } else if (allClosed) {
            console.log('Setting to "open all" state');
            document.body.classList.remove(rootDropdownState);
            button.innerHTML = '<i class="fa-solid fa-angles-down"></i>';
            button.title = "Open all dropdowns";
        } else {
            console.log('Mixed state - keeping current button state');
        }
        // If some are open and some are closed, keep current state
    }
    
    // Function to set up observers for dropdown changes
    function setupDropdownWatchers() {
        console.log('Setting up dropdown watchers...');
        
        // Watch for changes to details elements
        const details = document.querySelectorAll('details.dropdown, details.sd-dropdown');
        console.log('Found', details.length, 'details dropdowns');
        details.forEach(detail => {
            detail.addEventListener('toggle', () => {
                console.log('Details dropdown toggled:', detail.open);
                updateToggleButton();
            });
        });
        
        // Watch for class changes on div dropdowns using MutationObserver
        // Only watch dropdowns that have toggle buttons
        const divs = document.querySelectorAll('div.dropdown');
        const toggleableDivs = Array.from(divs).filter(div => div.querySelector('button.toggle-button'));
        console.log('Found', divs.length, 'total div dropdowns,', toggleableDivs.length, 'are toggleable');
        
        if (toggleableDivs.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        console.log('Toggleable div dropdown class changed:', mutation.target.className);
                        updateToggleButton();
                    }
                });
            });
            
            toggleableDivs.forEach(div => {
                observer.observe(div, { attributes: true, attributeFilter: ['class'] });
            });
        }
        
        // Hook into togglebutton click events more directly
        // Add click listeners to admonition titles and toggle buttons
        const admonitionTitles = document.querySelectorAll('.admonition-title');
        const toggleButtons = document.querySelectorAll('button.toggle-button');
        
        console.log('Found', admonitionTitles.length, 'admonition titles');
        console.log('Found', toggleButtons.length, 'toggle buttons');
        
        // Listen for clicks on admonition titles (which trigger toggles)
        admonitionTitles.forEach(title => {
            title.addEventListener('click', () => {
                console.log('Admonition title clicked, updating toggle state...');
                // Use a small delay to let the togglebutton script finish its work
                setTimeout(updateToggleButton, 10);
            });
        });
        
        // Listen for clicks on toggle buttons directly
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Toggle button clicked, updating toggle state...');
                // Use a small delay to let the togglebutton script finish its work
                setTimeout(updateToggleButton, 10);
            });
        });
    }

    const headerEnd = document.querySelector(".article-header-buttons");
    if (headerEnd) {
        const button = document.createElement("button");
        button.id = toggleButtonId;
        button.className = "btn btn-sm nav-link pst-navbar-icon pst-js-only";
        button.title = "Open all dropdowns";
        button.innerHTML = '<i class="fa-solid fa-angles-down"></i>';

        headerEnd.prepend(button);
    }
    
    // Function to initialize watchers and state
    function initializeToggleSystem() {
        console.log('Initializing toggle system...');
        setupDropdownWatchers();
        updateToggleButton();
    }
    
    // Hook into the same system that togglebutton.js uses
    const sphinxToggleRunWhenDOMLoaded = cb => {
        if (document.readyState != 'loading') {
            cb()
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', cb)
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState == 'complete') cb()
            })
        }
    }
    
    // Initialize our system after togglebutton.js has done its work
    // We use a small delay to ensure togglebutton.js has finished
    sphinxToggleRunWhenDOMLoaded(() => {
        // Give togglebutton.js a moment to finish adding buttons
        setTimeout(() => {
            console.log('DOM loaded, initializing toggle synchronization...');
            initializeToggleSystem();
        }, 10);
    });

    document.getElementById(toggleButtonId)?.addEventListener("click", () => {
        if (document.body.classList.contains(rootDropdownState)) {
            closeDropdowns();
        } else {
            openDropdowns();
        }
    });

    function openDropdowns() {
        document.body.classList.add(rootDropdownState);
        const button = document.getElementById(toggleButtonId);
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-angles-up"></i>';
            button.title = "Close all dropdowns";
        }
        const details = document.querySelectorAll('details.dropdown, details.sd-dropdown');
        details.forEach(detail => {
            if (!detail.open) {
                detail.open = true;
            }
        });
        const divs = document.querySelectorAll('div.dropdown');
        divs.forEach(div => {
            div.classList.remove('toggle-hidden');
        });
        const buttons = document.querySelectorAll('button.toggle-button');
        buttons.forEach(button => {
            button.classList.remove('toggle-button-hidden');
        });

        console.log("Dropdowns opened");
    }

    function closeDropdowns() {
        document.body.classList.remove(rootDropdownState);
        const button = document.getElementById(toggleButtonId);
        if (button) {
            button.innerHTML = '<i class="fa-solid fa-angles-down"></i>';
            button.title = "Open all dropdowns";
        }
        const details = document.querySelectorAll('details.dropdown, details.sd-dropdown');
        details.forEach(detail => {
            if (detail.open) {
                detail.open = false;
            }
        });
        const divs = document.querySelectorAll('div.dropdown');
        divs.forEach(div => {
            div.classList.add('toggle-hidden');
        });
        const buttons = document.querySelectorAll('button.toggle-button');
        buttons.forEach(button => {
            button.classList.add('toggle-button-hidden');
        });

        console.log("Dropdowns closed");
    }
});
