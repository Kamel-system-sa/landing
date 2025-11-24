// Exit Intent Popup - Lead Capture
// Detects when user is about to leave and shows a popup

(function() {
    'use strict';
    
    // Configuration
    const EXIT_INTENT_DELAY = 1000; // Delay after detecting exit intent (ms)
    const COOKIE_EXPIRY_DAYS = 7; // Days before showing popup again
    const SCROLL_THRESHOLD = 40; // Minimum scroll percentage before showing popup
    
    // State
    let hasScrolledEnough = false;
    let exitIntentShown = false;
    let mouseLeaveTimer = null;
    
    // Check if popup has been dismissed recently
    function hasBeenDismissed() {
        const dismissed = localStorage.getItem('exitIntentDismissed');
        if (!dismissed) return false;
        
        const dismissedDate = new Date(dismissed);
        const now = new Date();
        const daysDiff = (now - dismissedDate) / (1000 * 60 * 60 * 24);
        
        return daysDiff < COOKIE_EXPIRY_DAYS;
    }
    
    // Check scroll depth
    function checkScrollDepth() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= SCROLL_THRESHOLD) {
            hasScrolledEnough = true;
        }
    }
    
    // Show popup
    function showExitIntentPopup() {
        if (exitIntentShown || hasBeenDismissed() || !hasScrolledEnough) return;
        
        const popup = document.getElementById('exitIntentPopup');
        if (!popup) return;
        
        exitIntentShown = true;
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Track event (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_shown');
        }
    }
    
    // Close popup
    function closeExitIntentPopup(dismissed = false) {
        const popup = document.getElementById('exitIntentPopup');
        if (!popup) return;
        
        popup.classList.add('hidden');
        popup.classList.remove('flex');
        document.body.style.overflow = '';
        
        if (dismissed) {
            localStorage.setItem('exitIntentDismissed', new Date().toISOString());
        }
    }
    
    // Handle mouse leave event
    function handleMouseLeave(e) {
        // Only trigger if mouse is leaving from top of viewport
        if (e.clientY <= 0) {
            if (mouseLeaveTimer) clearTimeout(mouseLeaveTimer);
            
            mouseLeaveTimer = setTimeout(() => {
                showExitIntentPopup();
            }, EXIT_INTENT_DELAY);
        }
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[name="email"]').value;
        
        if (!email) return;
        
        // Show success message
        const formContainer = document.getElementById('exitIntentForm');
        const successMessage = document.getElementById('exitIntentSuccess');
        
        if (formContainer && successMessage) {
            formContainer.classList.add('hidden');
            successMessage.classList.remove('hidden');
        }
        
        // Here you would typically send to your email service
        console.log('Exit intent email captured:', email);
        
        // Track conversion (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_conversion', {
                'event_category': 'lead',
                'event_label': 'email_capture'
            });
        }
        
        // Close popup after delay
        setTimeout(() => {
            closeExitIntentPopup(true);
        }, 3000);
    }
    
    // Initialize
    function init() {
        // Don't show on mobile devices
        if (window.innerWidth < 768) return;
        
        // Check if already dismissed
        if (hasBeenDismissed()) return;
        
        // Track scroll depth
        window.addEventListener('scroll', checkScrollDepth);
        
        // Detect exit intent
        document.addEventListener('mouseleave', handleMouseLeave);
        
        // Setup close buttons
        const closeButtons = document.querySelectorAll('.close-exit-intent');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => closeExitIntentPopup(true));
        });
        
        // Handle form submission
        const form = document.getElementById('exitIntentFormElement');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeExitIntentPopup(true);
            }
        });
        
        // Close on backdrop click
        const popup = document.getElementById('exitIntentPopup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    closeExitIntentPopup(true);
                }
            });
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

