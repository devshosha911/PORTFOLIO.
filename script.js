// Performance profile (used by other scripts too)
function getPerformanceProfile() {
    const DEFAULT_PERF_MODE = 'auto'; // auto | low | high
    let perfMode = localStorage.getItem('perfMode');
    if (!perfMode) {
        perfMode = DEFAULT_PERF_MODE;
        localStorage.setItem('perfMode', perfMode);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = !!(connection && connection.saveData);
    const effectiveType = connection && connection.effectiveType ? connection.effectiveType : '';
    const lowBandwidth = /2g/.test(effectiveType);
    const autoLow = reduceMotion || coarsePointer || saveData || lowBandwidth;
    const lowPower = perfMode === 'low' ? true : perfMode === 'high' ? false : autoLow;

    return {
        reduceMotion,
        coarsePointer,
        saveData,
        effectiveType,
        lowBandwidth,
        lowPower,
        perfMode
    };
}

const perf = getPerformanceProfile();
window.__perf = perf;

if (perf.lowPower) {
    document.documentElement.classList.add('perf-low');

    document.querySelectorAll('[data-perf="optional"]').forEach((el) => {
        el.style.display = 'none';
    });
} else {
    // Load Lottie only when effects are enabled
    const lottieScript = document.createElement('script');
    lottieScript.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    lottieScript.defer = true;
    document.head.appendChild(lottieScript);
}

// Custom Cursor (disabled on low power or touch devices)
const cursorDot = document.querySelector("#cursor-dot");
const cursorOutline = document.querySelector("#cursor-outline");

if (cursorDot && cursorOutline && !perf.lowPower) {
    let cursorRAF = null;
    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener("mousemove", (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;

        if (cursorRAF) return;
        cursorRAF = requestAnimationFrame(() => {
            cursorDot.style.left = `${cursorX}px`;
            cursorDot.style.top = `${cursorY}px`;

            cursorOutline.style.left = `${cursorX}px`;
            cursorOutline.style.top = `${cursorY}px`;
            cursorRAF = null;
        });
    }, { passive: true });
}

// Menu Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

let scrollRAF = null;
window.addEventListener('scroll', () => {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
        const top = window.scrollY;

        sections.forEach(sec => {
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                });
                const activeLink = document.querySelector('header nav a[href*=' + id + ']');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });

        // Sticky Header
        let header = document.querySelector('header');
        header.classList.toggle('sticky', top > 100);

        // Remove toggle icon and navbar when click navbar link (scroll)
        menuIcon.classList.remove('fa-xmark');
        navbar.classList.remove('active');

        scrollRAF = null;
    });
}, { passive: true });

// Load Portfolio Projects from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolioProjects();
});

function loadPortfolioProjects() {
    const stored = localStorage.getItem('portfolioProjects');
    if (!stored) return; // Use default HTML if no data in localStorage

    const projects = JSON.parse(stored);
    const portfolioContainer = document.querySelector('.portfolio-container');

    if (!portfolioContainer) return;

    portfolioContainer.innerHTML = projects.map(project => `
        <div class="portfolio-box">
            <img src="${project.image}" alt="${project.title}">
            <div class="portfolio-layer">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

