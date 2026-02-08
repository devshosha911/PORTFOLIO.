// Admin Panel JavaScript
let projects = [];
let editingProjectId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    renderProjects();
    initializeEventListeners();
});

// Load projects from localStorage
function loadProjects() {
    const stored = localStorage.getItem('portfolioProjects');
    if (stored) {
        projects = JSON.parse(stored);
    } else {
        // Initialize with default projects
        projects = [
            {
                id: Date.now() + 1,
                title: "Casino Game Platform",
                description: "Full-stack gambling platform with provably fair algorithms, real-time analytics, and secure payment integration.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Casino+System",
                techStack: ["React", "Node.js", "MongoDB"]
            },
            {
                id: Date.now() + 2,
                title: "Enterprise Web Application",
                description: "Scalable business management system with custom dashboards, API integrations, and role-based access control.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Web+App",
                techStack: ["Vue.js", "Python", "PostgreSQL"]
            },
            {
                id: Date.now() + 3,
                title: "Multiplayer Game Engine",
                description: "Custom game engine with WebSocket real-time multiplayer, physics simulation, and 3D graphics rendering.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Game+Design",
                techStack: ["Three.js", "WebGL", "Socket.io"]
            },
            {
                id: Date.now() + 4,
                title: "DDoS Protection Service",
                description: "Enterprise-grade DDoS mitigation solution with real-time threat detection, traffic filtering, and 24/7 monitoring.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Security",
                techStack: ["Cloudflare", "Nginx", "Linux"]
            },
            {
                id: Date.now() + 5,
                title: "Cloud Infrastructure Setup",
                description: "Complete server provisioning, load balancing, automated backups, and CI/CD pipeline configuration.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Hosting",
                techStack: ["AWS", "Docker", "Kubernetes"]
            },
            {
                id: Date.now() + 6,
                title: "Cross-Platform Mobile App",
                description: "Hybrid mobile application with native features, push notifications, and offline-first architecture.",
                image: "https://via.placeholder.com/400x300/1a1a20/d4af37?text=Mobile+App",
                techStack: ["React Native", "Firebase", "Redux"]
            }
        ];
        saveProjects();
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Render projects list
function renderProjects() {
    const container = document.getElementById('projectsList');

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <h3>No Projects Yet</h3>
                <p>Click "Add New Project" to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <img src="${project.image}" alt="${project.title}" class="project-card-img">
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn-edit" onclick="editProject(${project.id})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize event listeners
function initializeEventListeners() {
    const addBtn = document.getElementById('addProjectBtn');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('projectForm');
    const imageTypeRadios = document.querySelectorAll('input[name="imageType"]');
    const imageUrlInput = document.getElementById('projectImageUrl');
    const imageFileInput = document.getElementById('projectImageFile');

    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    form.addEventListener('submit', handleSubmit);

    // Handle image type switching
    imageTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'url') {
                imageUrlInput.style.display = 'block';
                imageFileInput.style.display = 'none';
            } else {
                imageUrlInput.style.display = 'none';
                imageFileInput.style.display = 'block';
            }
        });
    });

    // Handle image URL input
    imageUrlInput.addEventListener('input', (e) => {
        if (e.target.value) {
            showImagePreview(e.target.value);
        }
    });

    // Handle file upload
    imageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                showImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Show image preview
function showImagePreview(src) {
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = src;
    preview.classList.add('active');
}

// Open add modal
function openAddModal() {
    editingProjectId = null;
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('imagePreview').classList.remove('active');
    document.querySelector('input[name="imageType"][value="url"]').checked = true;
    document.getElementById('projectImageUrl').style.display = 'block';
    document.getElementById('projectImageFile').style.display = 'none';
    openModal();
}

// Edit project
function editProject(id) {
    editingProjectId = id;
    const project = projects.find(p => p.id === id);

    if (!project) return;

    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectImageUrl').value = project.image;
    document.getElementById('techStack').value = project.techStack.join(', ');

    showImagePreview(project.image);
    openModal();
}

// Delete project
function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        renderProjects();
    }
}

// Handle form submit
function handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const techStackInput = document.getElementById('techStack').value;
    const techStack = techStackInput.split(',').map(tech => tech.trim()).filter(tech => tech);

    // Get image
    const imageType = document.querySelector('input[name="imageType"]:checked').value;
    let image;

    if (imageType === 'url') {
        image = document.getElementById('projectImageUrl').value || 'https://via.placeholder.com/400x300/1a1a20/d4af37?text=Project';
    } else {
        const previewImg = document.getElementById('previewImg');
        image = previewImg.src || 'https://via.placeholder.com/400x300/1a1a20/d4af37?text=Project';
    }

    if (editingProjectId) {
        // Edit existing project
        const index = projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                title,
                description,
                image,
                techStack
            };
        }
    } else {
        // Add new project
        projects.push({
            id: Date.now(),
            title,
            description,
            image,
            techStack
        });
    }

    saveProjects();
    renderProjects();
    closeModal();
}

// Open modal
function openModal() {
    document.getElementById('projectModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('projectModal').classList.remove('active');
    editingProjectId = null;
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeModal();
    }
});
