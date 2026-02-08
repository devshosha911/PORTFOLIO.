// Ultimate Admin Panel JavaScript
// Manages ALL portfolio sections

// ========== TAB SWITCHING ==========
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tab Name + '-tab').classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'projects':
            loadProjects();
            renderProjects();
            break;
        case 'hero':
            loadHeroSection();
            break;
        case 'about':
            loadAboutSection();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'experience':
            loadExperience();
            break;
        case 'certifications':
            loadCertifications();
            break;
        case 'social':
            loadSocialLinks();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ========== PROJECTS (existing functionality) ==========
let projects = [];

function loadProjects() {
    const stored = localStorage.getItem('portfolioProjects');
    if (stored) {
        projects = JSON.parse(stored);
    } else {
        projects = getDefaultProjects();
        saveProjects();
    }
}

function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

function renderProjects() {
    const container = document.getElementById('projects-list');
    if (projects.length === 0) {
        container.innerHTML = '<p style="color: #888;">No projects yet. Click "Add New Project" to get started.</p>';
        return;
    }

    container.innerHTML = projects.map((project, index) => `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editProject(${index})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProject(${index})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openModal(id = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    form.reset();

    if (id !== null) {
        const project = projects[id];
        document.getElementById('modal-title').textContent = 'Edit Project';
        document.getElementById('edit-id').value = id;
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-image-url').value = project.image;
        document.getElementById('project-tech').value = project.techStack.join(', ');
    } else {
        document.getElementById('modal-title').textContent = 'Add New Project';
        document.getElementById('edit-id').value = '';
    }

    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('project-modal').style.display = 'none';
}

function editProject(id) {
    openModal(id);
}

function deleteProject(id) {
    if (confirm('Delete this project?')) {
        projects.splice(id, 1);
        saveProjects();
        renderProjects();
    }
}

function getDefaultProjects() {
    return [
        {
            id: 1,
            title: "Casino Game Platform",
            description: "Full-stack gambling platform with provably fair algorithms, real-time analytics, and secure payment integration.",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
            techStack: ["React", "Node.js", "MongoDB"]
        },
        {
            id: 2,
            title: "Enterprise Web Application",
            description: "Scalable business management system with custom dashboards, API integrations, and role-based access control.",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
            techStack: ["Vue.js", "Python", "PostgreSQL"]
        },
        {
            id: 3,
            title: "Multiplayer Game Engine",
            description: "Custom game engine with WebSocket real-time multiplayer, physics simulation, and 3D graphics rendering.",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
            techStack: ["Three.js", "WebGL", "Socket.io"]
        },
        {
            id: 4,
            title: "DDoS Protection Service",
            description: "Enterprise-grade DDoS mitigation solution with real-time threat detection, traffic filtering, and 24/7 monitoring.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
            techStack: ["Cloudflare", "Nginx", "Linux"]
        },
        {
            id: 5,
            title: "Cloud Infrastructure Setup",
            description: "Complete server provisioning, load balancing, automated backups, and CI/CD pipeline configuration.",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
            techStack: ["AWS", "Docker", "Kubernetes"]
        },
        {
            id: 6,
            title: "Cross-Platform Mobile App",
            description: "Hybrid mobile application with native features, push notifications, and offline-first architecture.",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
            techStack: ["React Native", "Firebase", "Redux"]
        }
    ];
}

// Project form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = document.getElementById('edit-id').value;
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const imageUrl = document.getElementById('project-image-url').value;
            const tech = document.getElementById('project-tech').value.split(',').map(t => t.trim());

            const project = { title, description, image: imageUrl, techStack: tech };

            if (id) {
                projects[id] = project;
            } else {
                projects.push(project);
            }

            saveProjects();
            renderProjects();
            closeModal();
        });
    }

    // Image type toggle
    const imageTypeRadios = document.querySelectorAll('input[name="image-type"]');
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'url') {
                document.getElementById('project-image-url').style.display = 'block';
                document.getElementById('project-image-file').style.display = 'none';
            } else {
                document.getElementById('project-image-url').style.display = 'none';
                document.getElementById('project-image-file').style.display = 'block';
            }
        });
    });

    // Load initial data
    loadProjects();
    renderProjects();
});

// ========== HERO SECTION ==========
function loadHeroSection() {
    const heroData = JSON.parse(localStorage.getItem('heroSection') || '{}');
    document.getElementById('hero-greeting').value = heroData.greeting || "Hello, I'm a";
    document.getElementById('hero-title1').value = heroData.title1 || "System Analyst";
    document.getElementById('hero-title2').value = heroData.title2 || "Creative Developer";
    document.getElementById('hero-description').value = heroData.description || "Specializing in high-performance gambling systems, casino game logic, and premium graphic design.";
    document.getElementById('stat-years').value = heroData.years || 5;
    document.getElementById('stat-projects').value = heroData.projects || 50;
    document.getElementById('stat-satisfaction').value = heroData.satisfaction || 100;
}

function saveHeroSection() {
    const heroData = {
        greeting: document.getElementById('hero-greeting').value,
        title1: document.getElementById('hero-title1').value,
        title2: document.getElementById('hero-title2').value,
        description: document.getElementById('hero-description').value,
        years: parseInt(document.getElementById('stat-years').value),
        projects: parseInt(document.getElementById('stat-projects').value),
        satisfaction: parseInt(document.getElementById('stat-satisfaction').value)
    };
    localStorage.setItem('heroSection', JSON.stringify(heroData));
    alert('Hero section saved!');
}

// ========== ABOUT & SKILLS ==========
function loadAboutSection() {
    const aboutData = JSON.parse(localStorage.getItem('aboutSection') || '{}');
    document.getElementById('about-title').value = aboutData.title || "Full Stack Developer | System Analyst | Designer";
    document.getElementById('about-text').value = aboutData.text || "I specialize in creating high-performance applications...";

    const skills = aboutData.skills || [
        { name: "Web Development (React, Node.js, Python)", level: 95 },
        { name: "Game Development & Casino Logic", level: 90 },
        { name: "Graphic Design & UI/UX", level: 85 },
        { name: "Server Management & DDoS Protection", level: 88 }
    ];

    renderSkills(skills);
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    container.innerHTML = skills.map((skill, index) => `
        <div class="skill-item">
            <input type="text" placeholder="Skill Name" value="${skill.name}" id="skill-name-${index}">
            <input type="number" min="0" max="100" placeholder="Level (0-100)" value="${skill.level}" id="skill-level-${index}">
            <div class="item-actions">
                <button class="btn-delete" onclick="removeSkill(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function addSkill() {
    const aboutData = JSON.parse(localStorage.getItem('aboutSection') || '{}');
    const skills = aboutData.skills || [];
    skills.push({ name: "New Skill", level: 50 });
    aboutData.skills = skills;
    localStorage.setItem('aboutSection', JSON.stringify(aboutData));
    renderSkills(skills);
}

function removeSkill(index) {
    const aboutData = JSON.parse(localStorage.getItem('aboutSection') || '{}');
    aboutData.skills.splice(index, 1);
    localStorage.setItem('aboutSection', JSON.stringify(aboutData));
    renderSkills(aboutData.skills);
}

function saveAboutSection() {
    const aboutData = {
        title: document.getElementById('about-title').value,
        text: document.getElementById('about-text').value,
        skills: []
    };

    document.querySelectorAll('.skill-item').forEach((item, index) => {
        const name = document.getElementById(`skill-name-${index}`).value;
        const level = parseInt(document.getElementById(`skill-level-${index}`).value);
        aboutData.skills.push({ name, level });
    });

    localStorage.setItem('aboutSection', JSON.stringify(aboutData));
    alert('About section saved!');
}

// ========== TESTIMONIALS ==========
function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
    if (testimonials.length === 0) {
        const defaultTestimonials = [
            {
                name: "John Davis",
                role: "CEO, GameHub Inc.",
                image: "https://i.pravatar.cc/150?img=1",
                text: "Outstanding work! The casino platform exceeded all expectations."
            },
            {
                name: "Sarah Chen",
                role: "CTO, Lucky Games",
                image: "https://i.pravatar.cc/150?img=5",
                text: "Incredible system analyst! Optimized our game algorithms."
            }
        ];
        localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
        renderTestimonials(defaultTestimonials);
    } else {
        renderTestimonials(testimonials);
    }
}

function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonials-list');
    container.innerHTML = testimonials.map((t, index) => `
        <div class="testimonial-item-admin">
            <input type="text" placeholder="Client Name" value="${t.name}" id="test-name-${index}">
            <input type="text" placeholder="Role/Company" value="${t.role}" id="test-role-${index}">
            <input type="url" placeholder="Image URL" value="${t.image}" id="test-image-${index}">
            <textarea placeholder="Testimonial Text" id="test-text-${index}">${t.text}</textarea>
            <div class="item-actions">
                <button class="btn-delete" onclick="removeTestimonial(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function addTestimonial() {
    const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
    testimonials.push({
        name: "Client Name",
        role: "Position, Company",
        image: "https://i.pravatar.cc/150?img=12",
        text: "Your testimonial here..."
    });
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    renderTestimonials(testimonials);
}

function removeTestimonial(index) {
    const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
    testimonials.splice(index, 1);
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    renderTestimonials(testimonials);
}

function saveTestimonials() {
    const testimonials = [];
    document.querySelectorAll('.testimonial-item-admin').forEach((item, index) => {
        testimonials.push({
            name: document.getElementById(`test-name-${index}`).value,
            role: document.getElementById(`test-role-${index}`).value,
            image: document.getElementById(`test-image-${index}`).value,
            text: document.getElementById(`test-text-${index}`).value
        });
    });
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
    alert('Testimonials saved!');
}

// ========== EXPERIENCE ==========
function loadExperience() {
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    if (experience.length === 0) {
        const defaultExperience = [
            {
                year: "2024 - Present",
                title: "Senior Full Stack Developer & System Analyst",
                company: "Freelance",
                description: "Specializing in gambling systems and enterprise security."
            }
        ];
        localStorage.setItem('experience', JSON.stringify(defaultExperience));
        renderExperience(defaultExperience);
    } else {
        renderExperience(experience);
    }
}

function renderExperience(experience) {
    const container = document.getElementById('experience-list');
    container.innerHTML = experience.map((exp, index) => `
        <div class="timeline-item-admin">
            <input type="text" placeholder="Year Range" value="${exp.year}" id="exp-year-${index}">
            <input type="text" placeholder="Job Title" value="${exp.title}" id="exp-title-${index}">
            <input type="text" placeholder="Company" value="${exp.company}" id="exp-company-${index}">
            <textarea placeholder="Description" id="exp-desc-${index}">${exp.description}</textarea>
            <div class="item-actions">
                <button class="btn-delete" onclick="removeExperience(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function addExperience() {
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    experience.push({
        year: "20XX - 20XX",
        title: "Job Title",
        company: "Company Name",
        description: "Description of your role..."
    });
    localStorage.setItem('experience', JSON.stringify(experience));
    renderExperience(experience);
}

function removeExperience(index) {
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    experience.splice(index, 1);
    localStorage.setItem('experience', JSON.stringify(experience));
    renderExperience(experience);
}

function saveExperience() {
    const experience = [];
    document.querySelectorAll('.timeline-item-admin').forEach((item, index) => {
        experience.push({
            year: document.getElementById(`exp-year-${index}`).value,
            title: document.getElementById(`exp-title-${index}`).value,
            company: document.getElementById(`exp-company-${index}`).value,
            description: document.getElementById(`exp-desc-${index}`).value
        });
    });
    localStorage.setItem('experience', JSON.stringify(experience));
    alert('Experience saved!');
}

// ========== CERTIFICATIONS ==========
function loadCertifications() {
    const certs = JSON.parse(localStorage.getItem('certifications') || '[]');
    if (certs.length === 0) {
        const defaultCerts = [
            { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", icon: "fa-brands fa-aws" }
        ];
        localStorage.setItem('certifications', JSON.stringify(defaultCerts));
        renderCertifications(defaultCerts);
    } else {
        renderCertifications(certs);
    }
}

function renderCertifications(certs) {
    const container = document.getElementById('certifications-list');
    container.innerHTML = certs.map((cert, index) => `
        <div class="cert-item-admin">
            <input type="text" placeholder="Certification Name" value="${cert.name}" id="cert-name-${index}">
            <input type="text" placeholder="Issuer" value="${cert.issuer}" id="cert-issuer-${index}">
            <input type="text" placeholder="Year" value="${cert.year}" id="cert-year-${index}">
            <input type="text" placeholder="Icon (Font Awesome class)" value="${cert.icon}" id="cert-icon-${index}">
            <div class="item-actions">
                <button class="btn-delete" onclick="removeCertification(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function addCertification() {
    const certs = JSON.parse(localStorage.getItem('certifications') || '[]');
    certs.push({
        name: "Certification Name",
        issuer: "Issuing Organization",
        year: "2024",
        icon: "fa-solid fa-certificate"
    });
    localStorage.setItem('certifications', JSON.stringify(certs));
    renderCertifications(certs);
}

function removeCertification(index) {
    const certs = JSON.parse(localStorage.getItem('certifications') || '[]');
    certs.splice(index, 1);
    localStorage.setItem('certifications', JSON.stringify(certs));
    renderCertifications(certs);
}

function saveCertifications() {
    const certs = [];
    document.querySelectorAll('.cert-item-admin').forEach((item, index) => {
        certs.push({
            name: document.getElementById(`cert-name-${index}`).value,
            issuer: document.getElementById(`cert-issuer-${index}`).value,
            year: document.getElementById(`cert-year-${index}`).value,
            icon: document.getElementById(`cert-icon-${index}`).value
        });
    });
    localStorage.setItem('certifications', JSON.stringify(certs));
    alert('Certifications saved!');
}

// ========== SOCIAL LINKS ==========
function loadSocialLinks() {
    const social = JSON.parse(localStorage.getItem('socialLinks') || '{}');
    document.getElementById('social-github').value = social.github || '';
    document.getElementById('social-linkedin').value = social.linkedin || '';
    document.getElementById('social-twitter').value = social.twitter || '';
    document.getElementById('social-discord').value = social.discord || '';
    document.getElementById('social-whatsapp').value = social.whatsapp || '1234567890';
}

function saveSocialLinks() {
    const social = {
        github: document.getElementById('social-github').value,
        linkedin: document.getElementById('social-linkedin').value,
        twitter: document.getElementById('social-twitter').value,
        discord: document.getElementById('social-discord').value,
        whatsapp: document.getElementById('social-whatsapp').value
    };
    localStorage.setItem('socialLinks', JSON.stringify(social));
    alert('Social links saved!');
}

// ========== SETTINGS ==========
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    document.getElementById('color-primary').value = settings.primaryColor || '#d4af37';
    document.getElementById('color-bg').value = settings.bgColor || '#0f0f13';
    document.getElementById('color-second-bg').value = settings.secondBgColor || '#1a1a20';
    document.getElementById('github-username').value = settings.githubUsername || '';
    document.getElementById('analytics-id').value = settings.analyticsId || '';

    // Update text fields
    document.getElementById('color-primary-text').value = settings.primaryColor || '#d4af37';
    document.getElementById('color-bg-text').value = settings.bgColor || '#0f0f13';
    document.getElementById('color-second-bg-text').value = settings.secondBgColor || '#1a1a20';
}

function saveSettings() {
    const settings = {
        primaryColor: document.getElementById('color-primary').value,
        bgColor: document.getElementById('color-bg').value,
        secondBgColor: document.getElementById('color-second-bg').value,
        githubUsername: document.getElementById('github-username').value,
        analyticsId: document.getElementById('analytics-id').value
    };
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Settings saved! Refresh the main site to see color changes.');
}

// Color picker sync
document.addEventListener('DOMContentLoaded', () => {
    ['primary', 'bg', 'second-bg'].forEach(color => {
        const picker = document.getElementById(`color-${color}`);
        const text = document.getElementById(`color-${color}-text`);
        if (picker && text) {
            picker.addEventListener('input', () => {
                text.value = picker.value;
            });
        }
    });
});

// ========== SAVE ALL ==========
function saveAllSections() {
    const currentTab = document.querySelector('.tab-content.active').id.replace('-tab', '');

    switch (currentTab) {
        case 'projects':
            saveProjects();
            break;
        case 'hero':
            saveHeroSection();
            break;
        case 'about':
            saveAboutSection();
            break;
        case 'testimonials':
            saveTestimonials();
            break;
        case 'experience':
            saveExperience();
            break;
        case 'certifications':
            saveCertifications();
            break;
        case 'social':
            saveSocialLinks();
            break;
        case 'settings':
            saveSettings();
            break;
    }

    alert('All changes saved!');
}

 / /   = = = = = = = = = =   B L O G   M A N A G E M E N T   = = = = = = = = = = 
 f u n c t i o n   l o a d B l o g ( )   { 
         c o n s t   p o s t s   =   J S O N . p a r s e ( l o c a l S t o r a g e . g e t I t e m ( ' b l o g P o s t s ' )   | |   ' [ ] ' ) ; 
         c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' b l o g - l i s t - a d m i n ' ) ; 
         i f   ( ! c o n t a i n e r )   r e t u r n ; 
         
         c o n t a i n e r . i n n e r H T M L   =   p o s t s . m a p ( ( p o s t ,   i n d e x )   = >   
                 < d i v   c l a s s = ' t e s t i m o n i a l - i t e m - a d m i n ' > 
                         < i n p u t   t y p e = ' t e x t '   p l a c e h o l d e r = ' T i t l e '   v a l u e = ' '   i d = ' b l o g - t i t l e - ' > 
                         < i n p u t   t y p e = ' t e x t '   p l a c e h o l d e r = ' I m a g e   U R L '   v a l u e = ' '   i d = ' b l o g - i m a g e - ' > 
                         < t e x t a r e a   p l a c e h o l d e r = ' E x c e r p t   ( s h o r t   d e s c r i p t i o n ) '   i d = ' b l o g - e x c e r p t - ' > < / t e x t a r e a > 
                         < t e x t a r e a   p l a c e h o l d e r = ' F u l l   C o n t e n t   ( M a r k d o w n   s u p p o r t e d ) '   r o w s = ' 1 0 '   i d = ' b l o g - c o n t e n t - ' > < / t e x t a r e a > 
                         < i n p u t   t y p e = ' t e x t '   p l a c e h o l d e r = ' T a g s   ( c o m m a - s e p a r a t e d ) '   v a l u e = ' '   i d = ' b l o g - t a g s - ' > 
                         < i n p u t   t y p e = ' t e x t '   p l a c e h o l d e r = ' R e a d   T i m e   ( m i n u t e s ) '   v a l u e = ' '   i d = ' b l o g - t i m e - ' > 
                         < d i v   c l a s s = ' i t e m - a c t i o n s ' > 
                                 < b u t t o n   c l a s s = ' b t n - d e l e t e '   o n c l i c k = ' r e m o v e B l o g P o s t ( ) ' > R e m o v e < / b u t t o n > 
                         < / d i v > 
                 < / d i v > 
         ) . j o i n ( ' ' ) ; 
 } 
 
 f u n c t i o n   a d d B l o g P o s t ( )   { 
         c o n s t   p o s t s   =   J S O N . p a r s e ( l o c a l S t o r a g e . g e t I t e m ( ' b l o g P o s t s ' )   | |   ' [ ] ' ) ; 
         p o s t s . p u s h ( { 
                 i d :   D a t e . n o w ( ) , 
                 t i t l e :   ' N e w   B l o g   P o s t ' , 
                 e x c e r p t :   ' S h o r t   d e s c r i p t i o n . . . ' , 
                 c o n t e n t :   ' #   Y o u r   C o n t e n t   H e r e \ n \ n W r i t e   y o u r   b l o g   p o s t   i n   * * M a r k d o w n * * ! ' , 
                 i m a g e :   ' ' , 
                 d a t e :   n e w   D a t e ( ) . t o L o c a l e D a t e S t r i n g ( ) , 
                 t a g s :   [ ' t u t o r i a l ' ] , 
                 r e a d T i m e :   5 , 
                 a u t h o r :   ' A d m i n ' 
         } ) ; 
         l o c a l S t o r a g e . s e t I t e m ( ' b l o g P o s t s ' ,   J S O N . s t r i n g i f y ( p o s t s ) ) ; 
         l o a d B l o g ( ) ; 
 } 
 
 f u n c t i o n   r e m o v e B l o g P o s t ( i n d e x )   { 
         c o n s t   p o s t s   =   J S O N . p a r s e ( l o c a l S t o r a g e . g e t I t e m ( ' b l o g P o s t s ' )   | |   ' [ ] ' ) ; 
         p o s t s . s p l i c e ( i n d e x ,   1 ) ; 
         l o c a l S t o r a g e . s e t I t e m ( ' b l o g P o s t s ' ,   J S O N . s t r i n g i f y ( p o s t s ) ) ; 
         l o a d B l o g ( ) ; 
 } 
 
 f u n c t i o n   s a v e B l o g ( )   { 
         c o n s t   p o s t s   =   [ ] ; 
         d o c u m e n t . q u e r y S e l e c t o r A l l ( ' # b l o g - l i s t - a d m i n   . t e s t i m o n i a l - i t e m - a d m i n ' ) . f o r E a c h ( ( i t e m ,   i n d e x )   = >   { 
                 p o s t s . p u s h ( { 
                         i d :   D a t e . n o w ( )   +   i n d e x , 
                         t i t l e :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - t i t l e - \ \ ) . v a l u e , 
                         i m a g e :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - i m a g e - \ \ ) . v a l u e , 
                         e x c e r p t :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - e x c e r p t - \ \ ) . v a l u e , 
                         c o n t e n t :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - c o n t e n t - \ \ ) . v a l u e , 
                         t a g s :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - t a g s - \ \ ) . v a l u e . s p l i t ( ' , ' ) . m a p ( t   = >   t . t r i m ( ) ) , 
                         r e a d T i m e :   d o c u m e n t . g e t E l e m e n t B y I d ( \  l o g - t i m e - \ \ ) . v a l u e , 
                         d a t e :   n e w   D a t e ( ) . t o L o c a l e D a t e S t r i n g ( ) , 
                         a u t h o r :   ' A d m i n ' 
                 } ) ; 
         } ) ; 
         l o c a l S t o r a g e . s e t I t e m ( ' b l o g P o s t s ' ,   J S O N . s t r i n g i f y ( p o s t s ) ) ; 
         a l e r t ( ' B l o g   p o s t s   s a v e d ! ' ) ; 
 } 
  
 