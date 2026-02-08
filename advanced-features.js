// Advanced Features - Typing Animation, Scroll Effects, and More!

// ========== TYPING ANIMATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initScrollReveal();

    const perf = window.__perf || {};
    if (!perf.lowPower) {
        initCursorTrail();
    }
});

function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const texts = [
        'System Analyst & <span class="highlight">Creative Developer</span>',
        'Full Stack Developer & <span class="highlight">Designer</span>',
        'Casino Systems Expert & <span class="highlight">Analyst</span>'
    ];

    const perf = window.__perf || {};
    if (perf.lowPower) {
        heroTitle.innerHTML = texts[0];
        return;
    }

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        const fullText = texts[textIndex];

        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }

        // Strip HTML tags for character counting but keep them for display
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentText;
        const textContent = tempDiv.textContent || tempDiv.innerText;

        heroTitle.innerHTML = currentText + '<span class="cursor-blink">|</span>';

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === fullText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing after 500ms
    setTimeout(type, 500);
}

// ========== CURSOR TRAIL EFFECT ==========
function initCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = ['#d4af37', '#b8941f', '#c9a961', '#f0d878'];

    // Create cursor trail circles
    for (let i = 0; i < 12; i++) {
        const circle = document.createElement('div');
        circle.className = 'cursor-trail';
        circle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            mix-blend-mode: screen;
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(circle);
        circles.push(circle);
    }

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    }, { passive: true });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.background = colors[index % colors.length];
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
            circle.style.opacity = (circles.length - index) / circles.length * 0.5;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.offsetLeft - x) * 0.3;
            y += (nextCircle.offsetTop - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// ========== SCROLL REVEAL ANIMATIONS ==========
function initScrollReveal() {
    const perf = window.__perf || {};
    if (perf.lowPower) return;

    const revealElements = document.querySelectorAll('.portfolio-box, .service-box, .skill-bars, .testimonial-card, .timeline-item, .cert-card');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealOnScroll.observe(el);
    });
}

// ========== ENHANCED SKILLS VISUALIZER ==========
function initSkillsVisualizer() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const perf = window.__perf || {};
    if (perf.lowPower) {
        // ensure bars stay at their inline width but without animation
        skillBars.forEach(bar => {
            bar.style.transition = 'none';
        });
        return;
    }

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        bar.style.transition = 'width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        skillObserver.observe(bar);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSkillsVisualizer();
});

// ========== VIDEO BACKGROUND TOGGLE ==========
let videoEnabled = false;

function toggleVideoBackground() {
    const particlesContainer = document.getElementById('particles-js');
    const heroSection = document.querySelector('.hero');

    if (!videoEnabled) {
        // Create video element
        const video = document.createElement('video');
        video.id = 'hero-video-bg';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            z-index: 0;
        `;

        // Add video source - user can replace with their own
        video.innerHTML = '<source src="hero-background.mp4" type="video/mp4">';

        heroSection.insertBefore(video, heroSection.firstChild);
        particlesContainer.style.display = 'none';
        videoEnabled = true;
    } else {
        // Remove video, show particles
        const video = document.getElementById('hero-video-bg');
        if (video) video.remove();
        particlesContainer.style.display = 'block';
        videoEnabled = false;
    }
}

// ========== LIVE CHAT INTEGRATION (Tawk.to placeholder) ==========
function initLiveChat() {
    // Tawk.to integration - replace with your Property ID
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/YOUR_TAWK_ID/default';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
}

// Uncomment to enable live chat
// initLiveChat();

// ========== SMOOTH PARALLAX EFFECT ==========
const perfAF = window.__perf || {};
if (!perfAF.lowPower) {
    let parallaxRAF = null;
    window.addEventListener('scroll', () => {
        if (parallaxRAF) return;
        parallaxRAF = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-icon');

            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.1;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
            parallaxRAF = null;
        });
    }, { passive: true });
}

// ========== PAGE TRANSITION EFFECT ==========
function createPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #d4af37, #b8941f);
        z-index: 999999;
        transform: translateY(-100%);
        transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
    `;
    document.body.appendChild(transition);

    return transition;
}

// ========== FLOATING ACTION BUTTON ==========
function createFloatingMenu() {
    const menu = document.createElement('div');
    menu.className = 'floating-menu';
    menu.innerHTML = `
        <button class="fab-main" title="Quick Actions">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div class="fab-options">
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Back to Top">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button onclick="toggleVideoBackground()" title="Toggle Video BG">
                <i class="fa-solid fa-video"></i>
            </button>
            <button onclick="window.print()" title="Print Page">
                <i class="fa-solid fa-print"></i>
            </button>
        </div>
    `;

    menu.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 9999;
    `;

    document.body.appendChild(menu);

    // Toggle menu
    const fabMain = menu.querySelector('.fab-main');
    const fabOptions = menu.querySelector('.fab-options');

    fabMain.addEventListener('click', () => {
        fabOptions.classList.toggle('active');
    });
}

// Initialize floating menu only on high/perf mode
if (!perf.lowPower) {
    document.addEventListener('DOMContentLoaded', createFloatingMenu);
}
