// Main JavaScript for Kamel Landing Page

// Current language state
let currentLang = localStorage.getItem('kamelLang') || 'en';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    initializeMobileMenu();
    initializeFAQ();
    initializeSmoothScroll();
    initializeContactForm();
    initializeStickyHeader();
    initializeBackToTop();
    initializeVideoModal();
    initializeFeatureModals();
    initializeScrollProgress();
    initializeAnimatedStats();
    initializeFAQSearch();
    updateLanguageToggleButtons();
});

// ========================================
// Language Switching Functionality
// ========================================

function initializeLanguage() {
    // Apply saved language on load
    setLanguage(currentLang);
    
    // Desktop language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    
    // Mobile language toggle
    const langToggleMobile = document.getElementById('langToggleMobile');
    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', toggleLanguage);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(currentLang);
    localStorage.setItem('kamelLang', currentLang);
}

function setLanguage(lang) {
    const html = document.documentElement;
    const body = document.body;
    
    // Set language and direction
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update font families based on language
    if (lang === 'ar') {
        body.classList.remove('font-en-body');
        body.classList.add('font-ar-body');
    } else {
        body.classList.remove('font-ar-body');
        body.classList.add('font-en-body');
    }
    
    // Update all text content
    updateTextContent(lang);
    
    // Update language toggle buttons
    updateLanguageToggleButtons();
}

function updateLanguageToggleButtons() {
    const langText = document.getElementById('langText');
    const langTextMobile = document.getElementById('langTextMobile');
    
    // Show the opposite language (what you'll switch TO)
    const displayLang = currentLang === 'en' ? 'AR' : 'EN';
    
    if (langText) langText.textContent = displayLang;
    if (langTextMobile) langTextMobile.textContent = displayLang;
}

function updateTextContent(lang) {
    // Get content for the selected language
    const langContent = content[lang];
    
    if (!langContent) {
        console.error('Language content not found for:', lang);
        return;
    }
    
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedProperty(langContent, key);
        
        if (value) {
            // Check if element is an input with placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Don't update the content, only labels are updated via data-i18n
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update placeholders separately
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const value = getNestedProperty(langContent, key);
        
        if (value) {
            element.setAttribute('placeholder', value);
        }
    });
}

// Helper function to get nested object property by string path
function getNestedProperty(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

// ========================================
// Mobile Menu Functionality
// ========================================

function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    // Open menu
    mobileMenuToggle.addEventListener('click', function() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            // Open menu
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    });
    
    // Close button
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// FAQ Accordion Functionality
// ========================================

function initializeFAQ() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Check if this FAQ is currently open
            const isOpen = !content.classList.contains('hidden');
            
            // Close all FAQs
            document.querySelectorAll('.faq-content').forEach(c => {
                c.classList.add('hidden');
            });
            
            // Reset all icons
            document.querySelectorAll('.faq-icon').forEach(i => {
                i.classList.remove('rotate-180');
            });
            
            // If it wasn't open, open it
            if (!isOpen) {
                content.classList.remove('hidden');
                icon.classList.add('rotate-180');
            }
        });
    });
}

// ========================================
// Smooth Scrolling
// ========================================

function initializeSmoothScroll() {
    // Get all anchor links with # href
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just #
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate position
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Sticky Header
// ========================================

function initializeStickyHeader() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
            header.classList.add('shadow-md');
        }
    });
}

// ========================================
// Contact Form Handling
// ========================================

// ========================================
// Contact Form Handling - Slack Integration
// ========================================
// This form sends submissions directly to Slack via webhook

async function sendToSlack(formType, data) {
    const timestamp = new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Riyadh',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
    
    const companyText = data.company ? `*Company:* ${data.company}` : '';
    const messageText = data.message ? `\n\n*Message:*\n> ${data.message}` : '';
    
    const message = {
        text: `🎯 NEW DEMO REQUEST from ${data.name}`,
        attachments: [
            {
                color: "#006B6D",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*🎯 NEW DEMO REQUEST*\n\n*Name:* ${data.name}\n*Email:* <mailto:${data.email}|${data.email}>\n${companyText}${messageText}\n\n_${timestamp} (Riyadh)_`
                        }
                    }
                ]
            }
        ]
    };
    
    try {
        debugger;
        const response = await fetch('https://hooks.slack.com/services/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', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        
        // Check response status
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error('❌ Slack webhook returned error:', response.status, errorText);
            throw new Error(`Slack webhook failed: ${response.status}`);
        }
        
        // Verify Slack received the message (Slack returns "ok" for successful webhooks)
        const responseText = await response.text();
        if (responseText === 'ok') {
            console.log('✅ Message sent to Slack successfully');
            return true;
        } else {
            console.warn('⚠️ Unexpected response from Slack:', responseText);
            // Still return true as the message might have been received
            return true;
        }
    } catch (error) {
        // Check if it's a CORS error
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('❌ CORS error: Slack webhook blocked by browser. Consider using a backend proxy.');
            // Try fallback: send with no-cors mode (won't verify success but might work)
            // Note: no-cors mode doesn't allow custom headers, so Content-Type will be missing
            try {
                await fetch('https://hooks.slack.com/services/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', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(message)
                });
                console.log('⚠️ Sent with no-cors fallback (cannot verify success)');
                return true; // Assume success since we can't verify
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
                throw new Error('Unable to send message to Slack. Please contact support directly.');
            }
        }
        console.error('❌ Error sending to Slack:', error);
        throw error;
    }
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check privacy checkbox
        const privacyCheckbox = form.querySelector('#privacy');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            showFormMessage('error', 
                currentLang === 'ar' 
                    ? 'يرجى الموافقة على سياسة الخصوصية'
                    : 'Please agree to the Privacy Policy'
            );
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        
        try {
            // Send to Slack
            await sendToSlack('Contact Form', data);
            debugger;
            // Show success message
            showFormMessage('success', content[currentLang].contact.successMessage);
            
            // Reset form
            form.reset();
            
            // Track conversion if you have analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('error', content[currentLang].contact.errorMessage);
        } finally {
            // Restore button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

function showFormMessage(type, message) {
    const messageDiv = document.getElementById('formMessage');
    
    if (!messageDiv) return;
    
    // Reset classes
    messageDiv.className = 'p-4 rounded-lg text-center font-semibold';
    
    // Add appropriate styling
    if (type === 'success') {
        messageDiv.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-300');
    } else {
        messageDiv.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
    }
    
    // Set message and show
    messageDiv.textContent = message;
    messageDiv.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// ========================================
// Form Validation Enhancement
// ========================================

// Add real-time validation feedback
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            if (this.classList.contains('border-red-500')) {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-300');
            }
        });
    });
});

function validateInput(input) {
    if (!input.value.trim()) {
        input.classList.remove('border-gray-300');
        input.classList.add('border-red-500');
        return false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
        input.classList.remove('border-gray-300');
        input.classList.add('border-red-500');
        return false;
    } else {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
        return true;
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========================================
// Lazy Loading for Images (if needed)
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Enhanced Scroll Animation System
// ========================================

function initializeScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately for users who prefer reduced motion
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('animated');
            el.style.opacity = '1';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animated class and trigger animation
                entry.target.classList.add('animated');
                
                // Get animation type from data attribute
                const animationType = entry.target.dataset.animation || 'fade-up';
                const animationDelay = entry.target.dataset.delay || '0';
                
                // Apply animation
                setTimeout(() => {
                    entry.target.classList.add(`animate-${animationType}`);
                }, parseInt(animationDelay));
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
    
    // Handle staggered animations for groups
    const staggerGroups = document.querySelectorAll('[data-stagger-group]');
    staggerGroups.forEach(group => {
        const children = group.querySelectorAll('[data-stagger-item]');
        children.forEach((child, index) => {
            child.dataset.delay = (index * 150).toString(); // 150ms between items
            observer.observe(child);
        });
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// ========================================
// Parallax Effect for Background Elements
// ========================================

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize parallax on load
document.addEventListener('DOMContentLoaded', initializeParallax);

// ========================================
// Back to Top Button
// ========================================

function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Feature Detail Modals
// ========================================

function initializeFeatureModals() {
    const featureButtons = document.querySelectorAll('.feature-detail-btn, a[href="#"]');
    const featureModal = document.getElementById('featureModal');
    const closeModalBtn = document.getElementById('closeFeatureModal');
    
    if (!featureModal) return;
    
    // Feature detail content (could be moved to content.js for i18n)
    const featureDetails = {
        1: {
            title: "Operations Hub - Complete Control",
            description: "Your central command center for all Hajj operations, providing real-time visibility and control over every aspect of your service delivery.",
            features: [
                "Real-time dashboard with customizable widgets",
                "Automated workflow management and task assignment",
                "Multi-location support with synchronized data",
                "Role-based access control for team members",
                "Comprehensive audit trails and activity logs",
                "Integration with existing systems via API"
            ]
        }
        // Add more features as needed
    };
    
    featureButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            featureModal.classList.remove('hidden');
            featureModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    });
    
    function closeModal() {
        featureModal.classList.add('hidden');
        featureModal.classList.remove('flex');
        document.body.style.overflow = '';
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    featureModal.addEventListener('click', function(e) {
        if (e.target === featureModal) closeModal();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !featureModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ========================================
// Scroll Progress Indicator
// ========================================

function initializeScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-teal to-brand-gold z-[60] transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
    });
}

// ========================================
// Animated Stats Counter
// ========================================

function initializeAnimatedStats() {
    const stats = document.querySelectorAll('[data-stat-value]');
    
    if (stats.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateValue(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element) {
    const targetValue = element.getAttribute('data-stat-value');
    const duration = 2000; // 2 seconds
    const start = 0;
    const end = parseInt(targetValue.replace(/\D/g, ''));
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = targetValue.includes('+') ? current + '+' : current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(update);
}

// ========================================
// FAQ Search
// ========================================

function initializeFAQSearch() {
    // Create search input (will be added via HTML in advanced enhancements)
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-toggle').textContent.toLowerCase();
            const answer = item.querySelector('.faq-content').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ========================================
// Video Modal
// ========================================

function initializeVideoModal() {
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const videoModal = document.getElementById('videoModal');
    const closeVideoModal = document.getElementById('closeVideoModal');
    
    if (!videoPlaceholder || !videoModal) return;
    
    // Open modal
    videoPlaceholder.addEventListener('click', function() {
        videoModal.classList.remove('hidden');
        videoModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // If you have a real video embed, you can start playing here
        // Example: document.querySelector('#videoEmbed iframe').contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    });
    
    // Close modal
    function closeModal() {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        document.body.style.overflow = '';
        
        // Stop video if playing
        // Example: document.querySelector('#videoEmbed iframe').contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
    
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', closeModal);
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Close on backdrop click
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeModal();
        }
    });
}

