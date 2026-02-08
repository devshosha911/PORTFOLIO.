// Enhanced Portfolio JavaScript - Additional Features

// ========== LOADING SCREEN ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
    }, 1000);
});

// ========== SCROLL PROGRESS BAR ==========
let scrollProgressRAF = null;
window.addEventListener('scroll', () => {
    if (scrollProgressRAF) return;
    scrollProgressRAF = requestAnimationFrame(() => {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) {
            scrollProgressRAF = null;
            return;
        }
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        scrollProgress.style.width = scrolled + '%';
        scrollProgressRAF = null;
    });
}, { passive: true });

// ========== THEME (FORCED DARK) ==========
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const themeIcon = themeToggle?.querySelector('i');

// Always dark: clear saved theme, remove light class, hide toggle
localStorage.removeItem('theme');
body.classList.remove('light-theme');
if (themeToggle) themeToggle.style.display = 'none';
if (themeIcon) {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

// ========== ANIMATED COUNTERS ==========
const perfCounter = window.__perf || {};
function animateCounter(element, target, duration = 2000) {
    if (perfCounter.lowPower) {
        element.textContent = target + (element.dataset.suffix || '');
        return;
    }

    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Intersection Observer for Counters
if (!perfCounter.lowPower) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });
} else {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        animateCounter(counter, target);
    });
}

// ========== TESTIMONIALS SLIDER ==========
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-nav button');

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

// Auto-rotate testimonials (skip on low power or single card)
const perfEnh = window.__perf || {};
let testimonialInterval = null;
if (!perfEnh.lowPower && testimonialCards.length > 1) {
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Manual navigation
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// ========== WHATSAPP CLICK ==========
document.querySelector('.whatsapp-float')?.addEventListener('click', () => {
    // Replace with your WhatsApp number
    window.open('https://wa.me/1234567890?text=Hello!%20I%20saw%20your%20portfolio', '_blank');
});

// ========== CONTACT FORM - EMAILJS ==========
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('input[type="submit"]');
        const originalText = submitBtn.value;
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;

        // EmailJS configuration (you need to set this up at emailjs.com)
        // Uncomment and configure when ready:
        /*
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
            .then(() => {
                submitBtn.value = 'Message Sent! ✓';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.value = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, () => {
                submitBtn.value = 'Error! Try again';
                setTimeout(() => {
                    submitBtn.value = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        */

        // Temporary simulation
        setTimeout(() => {
            alert('Form submitted! (Connect EmailJS to receive actual emails)');
            submitBtn.value = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
        }, 1500);
    });
}

// ========== PARTICLES.JS INITIALIZATION ==========
const particlesContainer = document.getElementById('particles-js');
if (perfEnh.lowPower && particlesContainer) {
    particlesContainer.style.display = 'none';
}

if (!perfEnh.lowPower && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 45,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#d4af37'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#d4af37',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: false,
                    mode: 'grab'
                },
                onclick: {
                    enable: false,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== SCROLL ANIMATIONS ==========
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.service-box, .portfolio-box, .cert-card, .timeline-item').forEach(el => {
    scrollObserver.observe(el);
});
