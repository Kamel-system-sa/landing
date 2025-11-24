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
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            // Open menu
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    });
    
    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
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

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            message: formData.get('message'),
            // Add Web3Forms access key (user needs to replace this)
            access_key: 'YOUR_WEB3FORMS_ACCESS_KEY' // User should replace this
        };
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        
        try {
            // Send to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showFormMessage('success', content[currentLang].contact.successMessage);
                form.reset();
            } else {
                showFormMessage('error', content[currentLang].contact.errorMessage);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('error', content[currentLang].contact.errorMessage);
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
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
// Scroll Animation (subtle fade-in effect)
// ========================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const animatedElements = document.querySelectorAll('section');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

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

