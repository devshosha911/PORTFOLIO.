/* Professional Professional Upgrades Integration */

document.addEventListener('DOMContentLoaded', () => {
    initTiltEffect();
    initScrollProgressBar();
    enhanceButtons();
});

// 1. 3D Tilt Effect
function initTiltEffect() {
    const cards = document.querySelectorAll('.portfolio-box, .service-box, .testimonial-card');

    cards.forEach(card => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// 2. Scroll Progress Bar
function initScrollProgressBar() {
    // Create element
    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.appendChild(container); // Add to top of body

    // Update on scroll
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    });
}

// 3. Button Ripple Effect
function enhanceButtons() {
    const buttons = document.querySelectorAll('.btn, .social-icon, .ai-chat-toggle');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.style.cssText = `
                position: absolute;
                background: #fff;
                transform: translate(-50%, -50%);
                pointer-events: none;
                border-radius: 50%;
                animation: animate 1s linear infinite;
                width: 0px;
                height: 0px;
                opacity: 0.5;
            `;

            // Add keyframes dynamically if not exists
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.innerHTML = `
                    @keyframes animate {
                        0% { width: 0px; height: 0px; opacity: 0.5; }
                        100% { width: 500px; height: 500px; opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });
}
