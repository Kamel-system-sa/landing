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
    
    // Send exit intent lead to Slack
    async function sendExitIntentToSlack(email) {
        const timestamp = new Date().toLocaleString('en-US', { 
            timeZone: 'Asia/Riyadh',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
        
        const message = {
            text: `🔥 EXIT INTENT LEAD: ${email}`,
            attachments: [
                {
                    color: "#D4AF37",
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*🔥 EXIT INTENT LEAD*\n\n*Email:* <mailto:${email}|${email}>\n\n_${timestamp} (Riyadh)_`
                            }
                        }
                    ]
                }
            ]
        };
        
        try {
            const response = await fetch(CONFIG.SLACK_WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Slack webhooks to avoid CORS errors
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            });
            
            // Note: With 'no-cors' mode, we can't read the response
            // But the webhook will still work and send to Slack
            console.log('✅ Exit intent message sent to Slack');
            return true;
        } catch (error) {
            console.error('❌ Error sending to Slack:', error);
            return false;
        }
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[name="email"]').value;
        
        if (!email) return;
        
        // Send to Slack
        sendExitIntentToSlack(email)
            .then(() => {
                console.log('✅ Exit intent email sent to Slack successfully');
            })
            .catch(error => {
                console.error('❌ Error sending to Slack:', error);
            });
        
        // Show success message
        const formContainer = document.getElementById('exitIntentForm');
        const successMessage = document.getElementById('exitIntentSuccess');
        
        if (formContainer && successMessage) {
            formContainer.classList.add('hidden');
            successMessage.classList.remove('hidden');
        }
        
        // Track conversion (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_conversion', {
                'event_category': 'lead',
                'event_label': 'email_capture'
            });
        }
        
        console.log('Exit intent email captured:', email);
        
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

