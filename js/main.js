/* =========================================================
   VANUELLA.COM - JavaScript
   Navigation, Animations, Countdown & Interactions
   ========================================================= */

// ======================================
// 1. MOBILE NAVIGATION
// ======================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate toggle button
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ======================================
// 2. NAVBAR SCROLL EFFECT
// ======================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ======================================
// 3. SMOOTH SCROLL FOR ANCHOR LINKS
// ======================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just #
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ======================================
// 4. FADE IN ON SCROLL ANIMATION
// ======================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
const fadeElements = document.querySelectorAll('.release-card, .platform-card, .about-content, .event-featured');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ======================================
// 6. PARALLAX EFFECT FOR HERO
// ======================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const heroGlow = document.querySelector('.hero-glow');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }

    if (heroGlow && scrolled < window.innerHeight) {
        heroGlow.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.001})`;
    }
});

// ======================================
// 7. STREAM BUTTON TRACKING
// ======================================

const streamButtons = document.querySelectorAll('a[href*="spotify.com/album/1Yd0plQkyxrnweFQPnnRSb"], a[href*="angel-presave"]');

streamButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Track click in localStorage
        const clicks = parseInt(localStorage.getItem('angel_stream_clicks') || '0');
        localStorage.setItem('angel_stream_clicks', clicks + 1);

        // Google Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'stream_click', {
                'event_category': 'engagement',
                'event_label': 'angel_stream',
                'value': 1
            });
        }

        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    });
});

// ======================================
// 8. NEWSLETTER FORM HANDLING
// ======================================

const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;
        const button = newsletterForm.querySelector('button');
        const originalText = button.textContent;

        // Show loading state
        button.textContent = 'Subscribing...';
        button.disabled = true;
        button.classList.add('loading');

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            button.textContent = '✓ Subscribed!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            // Store subscription in localStorage
            localStorage.setItem('newsletter_subscribed', 'true');
            localStorage.setItem('newsletter_email', email);

            // Reset form
            newsletterForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('loading');
                button.style.background = '';
            }, 3000);

            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    'event_category': 'engagement',
                    'event_label': 'footer_newsletter'
                });
            }
        }, 1500);
    });
}

// ======================================
// 9. PLATFORM CARD CLICK TRACKING
// ======================================

const platformCards = document.querySelectorAll('.platform-card');

platformCards.forEach(card => {
    card.addEventListener('click', function() {
        const platform = this.querySelector('h3').textContent;

        // Track platform clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'platform_click', {
                'event_category': 'social',
                'event_label': platform.toLowerCase()
            });
        }
    });
});

// ======================================
// 10. RELEASE CARD PLAY BUTTON
// ======================================

const playButtons = document.querySelectorAll('.play-btn');

playButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Open link in new tab after animation
        setTimeout(() => {
            window.open(this.href, '_blank');
        }, 300);
    });
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ======================================
// 11. PERFORMANCE OPTIMIZATION - LAZY LOAD IMAGES
// ======================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ======================================
// 12. EXTERNAL LINK TRACKING
// ======================================

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const url = this.href;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'external_link_click', {
                'event_category': 'outbound',
                'event_label': url
            });
        }
    });
});

// ======================================
// 13. SCROLL PROGRESS INDICATOR (optional)
// ======================================

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    // Store scroll percentage (can be used for UI element)
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent);
}

window.addEventListener('scroll', updateScrollProgress);

// ======================================
// 14. DISABLE RIGHT-CLICK ON IMAGES (optional - artist protection)
// ======================================

// Uncomment if you want to protect images
/*
document.querySelectorAll('.release-artwork img, .about-image img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});
*/

// ======================================
// 15. PRELOAD CRITICAL ASSETS
// ======================================

function preloadCriticalAssets() {
    const criticalImages = [
        // Add paths to critical images that should load immediately
        // 'images/angel-artwork.jpg',
        // 'images/vanuella-portrait.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', preloadCriticalAssets);

// ======================================
// 16. CONSOLE MESSAGE (easter egg)
// ======================================

console.log('%c♪ VANUELLA WATT ♪', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #ff4081, #9c27b0); -webkit-background-clip: text; color: transparent;');
console.log('%cSoul from the Pacific 🌴', 'font-size: 14px; color: #ff4081;');
console.log('%cANGEL - Out Now', 'font-size: 12px; color: #FFD700;');
console.log('%cStream: https://open.spotify.com/album/1Yd0plQkyxrnweFQPnnRSb', 'font-size: 11px; color: #f3b6d6;');

// ======================================
// INITIALIZATION
// ======================================

console.log('✓ Vanuella.com initialized');
console.log('✓ Countdown active');
console.log('✓ Analytics tracking ready');
console.log('✓ Smooth scroll enabled');
console.log('✓ Animations loaded');
