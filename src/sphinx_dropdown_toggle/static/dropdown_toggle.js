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
        
        // Check details elements
        details.forEach(detail => {
            if (detail.open) {
                allClosed = false;
            } else {
                allOpen = false;
            }
        });
        
        // Check div dropdowns (they're closed if they have toggle-hidden class)
        divs.forEach(div => {
            if (div.classList.contains('toggle-hidden')) {
                allOpen = false;
            } else {
                allClosed = false;
            }
        });
        
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
        const divs = document.querySelectorAll('div.dropdown');
        console.log('Found', divs.length, 'div dropdowns');
        if (divs.length > 0) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        console.log('Div dropdown class changed:', mutation.target.className);
                        updateToggleButton();
                    }
                });
            });
            
            divs.forEach(div => {
                observer.observe(div, { attributes: true, attributeFilter: ['class'] });
            });
        }
        
        // Also watch for toggle-button changes
        const buttons = document.querySelectorAll('button.toggle-button');
        console.log('Found', buttons.length, 'toggle buttons');
        if (buttons.length > 0) {
            const buttonObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        console.log('Toggle button class changed:', mutation.target.className);
                        updateToggleButton();
                    }
                });
            });
            
            buttons.forEach(button => {
                buttonObserver.observe(button, { attributes: true, attributeFilter: ['class'] });
            });
        }
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
    
    // Set up watchers for dropdown state changes
    setupDropdownWatchers();
    
    // Initial state check
    updateToggleButton();

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
