// Dynamic Content Loader - Loads all sections from localStorage
// This makes the entire portfolio dynamic and manageable from admin panel

document.addEventListener('DOMContentLoaded', () => {
    loadAllDynamicContent();
    applyCustomColors();
    loadSocialLinks();
    initializeGitHubStats();
});

// ========== LOAD ALL DYNAMIC CONTENT ==========
function loadAllDynamicContent() {
    loadDynamicHero();
    loadDynamicAbout();
    loadDynamicTestimonials();
    loadDynamicExperience();
    loadDynamicCertifications();
}

// ========== HERO SECTION ==========
function loadDynamicHero() {
    const heroData = JSON.parse(localStorage.getItem('heroSection') || '{}');

    if (Object.keys(heroData).length === 0) return; // Use default HTML

    // Update greeting
    const greeting = document.querySelector('.greeting');
    if (greeting && heroData.greeting) {
        greeting.textContent = heroData.greeting;
    }

    // Update title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && (heroData.title1 || heroData.title2)) {
        heroTitle.innerHTML = `${heroData.title1 || 'System Analyst'} <span class="highlight">&</span> <br>${heroData.title2 || 'Creative Developer'}`;
    }

    // Update description
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc && heroData.description) {
        heroDesc.textContent = heroData.description;
    }

    // Update stats
    const statBoxes = document.querySelectorAll('.stat-box h3');
    if (statBoxes.length >= 3) {
        if (heroData.years) {
            statBoxes[0].textContent = heroData.years + '+';
            statBoxes[0].dataset.target = heroData.years;
        }
        if (heroData.projects) {
            statBoxes[1].textContent = heroData.projects + '+';
            statBoxes[1].dataset.target = heroData.projects;
        }
        if (heroData.satisfaction) {
            statBoxes[2].textContent = heroData.satisfaction + '%';
            statBoxes[2].dataset.target = heroData.satisfaction;
        }
    }
}

// ========== ABOUT SECTION ==========
function loadDynamicAbout() {
    const aboutData = JSON.parse(localStorage.getItem('aboutSection') || '{}');

    if (Object.keys(aboutData).length === 0) return;

    // Update title
    const aboutTitle = document.querySelector('.about-content h3');
    if (aboutTitle && aboutData.title) {
        aboutTitle.textContent = aboutData.title;
    }

    // Update text
    const aboutText = document.querySelector('.about-content > p');
    if (aboutText && aboutData.text) {
        aboutText.textContent = aboutData.text;
    }

    // Update skills
    if (aboutData.skills && aboutData.skills.length > 0) {
        const skillBars = document.querySelector('.skill-bars');
        if (skillBars) {
            skillBars.innerHTML = aboutData.skills.map(skill => `
                <div class="skill">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// ========== TESTIMONIALS ==========
function loadDynamicTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');

    if (testimonials.length === 0) return;

    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    // Update testimonial cards
    const cardsContainer = slider.querySelector('.testimonial-card')?.parentElement;
    if (cardsContainer) {
        cardsContainer.innerHTML = testimonials.map((t, index) => `
            <div class="testimonial-card ${index === 0 ? 'active' : ''}">
                <img src="${t.image}" alt="${t.name}" class="testimonial-img">
                <p class="testimonial-text">"${t.text}"</p>
                <h4 class="testimonial-author">${t.name}</h4>
                <p class="testimonial-role">${t.role}</p>
            </div>
        `).join('');

        // Update navigation dots
        const nav = document.querySelector('.testimonial-nav');
        if (nav) {
            nav.innerHTML = testimonials.map((_, index) =>
                `<button class="${index === 0 ? 'active' : ''}"></button>`
            ).join('');
        }
    }
}

// ========== EXPERIENCE TIMELINE ==========
function loadDynamicExperience() {
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');

    if (experience.length === 0) return;

    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    timeline.innerHTML = experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3 class="timeline-year">${exp.year}</h3>
                <h4 class="timeline-title">${exp.title}</h4>
                <p class="timeline-company">${exp.company}</p>
                <p class="timeline-desc">${exp.description}</p>
            </div>
        </div>
    `).join('');
}

// ========== CERTIFICATIONS ==========
function loadDynamicCertifications() {
    const certs = JSON.parse(localStorage.getItem('certifications') || '[]');

    if (certs.length === 0) return;

    const certGrid = document.querySelector('.cert-grid');
    if (!certGrid) return;

    certGrid.innerHTML = certs.map(cert => `
        <div class="cert-card">
            <div class="cert-icon"><i class="${cert.icon}"></i></div>
            <h3>${cert.name}</h3>
            <p class="cert-issuer">${cert.issuer}</p>
            <p class="cert-year">${cert.year}</p>
        </div>
    `).join('');
}

// ========== CUSTOM COLORS ==========
function applyCustomColors() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    if (Object.keys(settings).length === 0) return;

    const root = document.documentElement;
    if (settings.primaryColor) root.style.setProperty('--main-color', settings.primaryColor);
    if (settings.bgColor) root.style.setProperty('--bg-color', settings.bgColor);
    if (settings.secondBgColor) root.style.setProperty('--second-bg-color', settings.secondBgColor);
}

// ========== SOCIAL LINKS ==========
function loadSocialLinks() {
    const social = JSON.parse(localStorage.getItem('socialLinks') || '{}');

    if (Object.keys(social).length === 0) return;

    // Update social links in footer
    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length >= 4) {
        if (social.github) socialLinks[0].href = social.github;
        if (social.linkedin) socialLinks[1].href = social.linkedin;
        if (social.twitter) socialLinks[2].href = social.twitter;
        if (social.discord) socialLinks[3].href = social.discord;
    }

    // Update WhatsApp button
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton && social.whatsapp) {
        whatsappButton.href = `https://wa.me/${social.whatsapp}`;
    }
}

// ========== GITHUB STATS (LIVE API) ==========
async function initializeGitHubStats() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    if (!settings.githubUsername) return; // Use static stats

    try {
        const response = await fetch(`https://api.github.com/users/${settings.githubUsername}`);
        const data = await response.json();

        // Update stats with real data
        const statCards = document.querySelectorAll('.github-stats .stat-number');
        if (statCards.length >= 4) {
            statCards[0].textContent = data.public_repos + '+';
            statCards[0].dataset.target = data.public_repos;

            // For contributions, we'd need a more complex API call
            // For now, keep the default or add a placeholder

            statCards[3].textContent = data.followers + '+';
            statCards[3].dataset.target = data.followers;
        }
    } catch (error) {
        console.log('Using static GitHub stats');
    }
}

// ========== GOOGLE ANALYTICS ==========
function initializeAnalytics() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    if (!settings.analyticsId) return;

    // Add Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', settings.analyticsId);
}

// Initialize analytics
initializeAnalytics();
