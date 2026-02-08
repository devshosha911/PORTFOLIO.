// Custom AI Assistant - Portfolio Chatbot
// Knows everything about your portfolio and answers visitor questions!

class PortfolioAI {
    constructor() {
        this.isOpen = false;
        this.knowledgeBase = this.initKnowledgeBase();
        this.conversationHistory = [];

        // xAI (Grok) Configuration
        this.ollamaConfig = {
            enabled: true,
            apiKey: 'xai-tUG9mUB40mrLqmDrsb62GNHxDAXh6MadzmzjWJa5nu87Il2Px6dkv5qdVimmmboIZBlEa9kNZ6oXfWG6',
            endpoint: 'https://api.x.ai/v1/chat/completions', // xAI Endpoint
            model: 'grok-beta', // Using standard grok-beta model
            fallbackToLocal: true,
            failed: false
        };

        this.init();
    }

    initKnowledgeBase() {
        // AI knows about your portfolio
        return {
            about: {
                name: "Portfolio Owner",
                role: "System Analyst & Creative Developer",
                specialties: ["Gambling Systems", "Casino Game Logic", "Full Stack Development", "Graphic Design", "DDoS Protection"],
                experience: "5+ years",
                satisfaction: "100%"
            },
            projects: [
                {
                    name: "Casino Game Platform",
                    description: "Full-stack gambling platform with provably fair algorithms, real-time analytics, and secure payment integration",
                    tech: ["React", "Node.js", "MongoDB"],
                    category: "gambling"
                },
                {
                    name: "Enterprise Web Application",
                    description: "Scalable business management system with custom dashboards, API integrations, and role-based access control",
                    tech: ["Vue.js", "Python", "PostgreSQL"],
                    category: "web"
                },
                {
                    name: "Multiplayer Game Engine",
                    description: "Custom game engine with WebSocket real-time multiplayer, physics simulation, and 3D graphics rendering",
                    tech: ["Three.js", "WebGL", "Socket.io"],
                    category: "game"
                },
                {
                    name: "DDoS Protection Service",
                    description: "Enterprise-grade DDoS mitigation solution with real-time threat detection, traffic filtering, and 24/7 monitoring",
                    tech: ["Cloudflare", "Nginx", "Linux"],
                    category: "security"
                },
                {
                    name: "Cloud Infrastructure Setup",
                    description: "Complete server provisioning, load balancing, automated backups, and CI/CD pipeline configuration",
                    tech: ["AWS", "Docker", "Kubernetes"],
                    category: "cloud"
                }
            ],
            skills: [
                { name: "Web Development", level: 95, keywords: ["react", "vue", "node", "javascript", "html", "css"] },
                { name: "Game Development", level: 90, keywords: ["game", "engine", "multiplayer", "casino"] },
                { name: "Graphic Design", level: 85, keywords: ["design", "ui", "ux", "graphics"] },
                { name: "Server Management", level: 88, keywords: ["server", "cloud", "aws", "docker", "deployment"] }
            ],
            services: [
                "Custom Web Development",
                "Casino & Gambling Systems",
                "Premium Graphic Design",
                "DDoS Protection & Security",
                "Cloud Hosting Solutions",
                "Mobile App Development"
            ],
            contact: {
                whatsapp: "+20 1016522629",
                facebook: "Available",
                discord: "silentcoderx1"
            }
        };
    }

    init() {
        this.checkApiKey();
        this.createChatWidget();
        this.attachEventListeners();
    }

    checkApiKey() {
        // Disabled: Key is provided by user (xAI)
        this.needsKey = false;
    }

    promptForApiKey() {
        if (document.getElementById('ai-key-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'ai-key-modal';
        modal.className = 'ai-key-modal';
        modal.innerHTML = `
            <div class="ai-key-content">
                <h3>🚀 Activate Real AI (Free)</h3>
                <p>To use the advanced Llama 3 AI, you need a free API key from Groq.<br>
                It takes 10 seconds and creates a super-fast real AI experience!</p>
                <div style="margin-bottom: 1rem;">
                    <a href="https://console.groq.com/keys" target="_blank" style="color: var(--main-color); text-decoration: underline;">1. Get Free Key Here</a>
                </div>
                <input type="password" id="groq-key-input" class="ai-key-input" placeholder="Paste your gsk_... key here">
                <button onclick="portfolioAI.saveApiKey()" class="ai-key-btn">Activate AI</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveApiKey() {
        const input = document.getElementById('groq-key-input');
        const key = input.value.trim();
        if (key.startsWith('gsk_')) {
            localStorage.setItem('groq_api_key', key);
            this.ollamaConfig.apiKey = key;
            this.needsKey = false;
            document.getElementById('ai-key-modal').remove();

            // Send welcome message
            this.addMessage("✅ AI Activated! Ask me anything!", 'bot');
        } else {
            alert('Please enter a valid Groq API key (starts with gsk_)');
        }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const widget = document.getElementById('ai-chat-widget');
        const toggle = document.getElementById('ai-toggle');

        if (this.isOpen) {
            widget.classList.add('open');
            toggle.style.display = 'none';

            if (this.needsKey) {
                setTimeout(() => this.promptForApiKey(), 500);
            }
        } else {
            widget.classList.remove('open');
            toggle.style.display = 'flex';
        }
    }

    createChatWidget() {
        const chatHTML = `
            <div class="ai-chat-widget" id="ai-chat-widget">
                <div class="ai-chat-header">
                    <div class="header-info">
                        <div class="status-dot"></div>
                        <span>Grok AI Assistant</span>
                    </div>
                    <div class="header-controls">
                        <button onclick="portfolioAI.toggleChat()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <div class="message bot-message">
                        Hello! 👋 I'm Grok. Ask me anything about this portfolio, or use valid commands:
                        <br><b>/roast</b> - Roast this portfolio
                        <br><b>/code</b> - Technical mode
                    </div>
                </div>
                <div class="ai-chat-input">
                    <input type="text" id="ai-user-input" placeholder="Type a message or /command...">
                    <button onclick="portfolioAI.sendMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="ai-chat-toggle" id="ai-toggle" onclick="portfolioAI.toggleChat()">
                <i class="fa-solid fa-robot"></i>
                <span class="pulse-ring"></span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const widget = document.getElementById('ai-chat-widget');
        const toggle = document.getElementById('ai-toggle');

        if (this.isOpen) {
            widget.classList.add('open');
            toggle.style.display = 'none';
        } else {
            widget.classList.remove('open');
            toggle.style.display = 'flex';
        }
    }

    attachEventListeners() {
        const input = document.getElementById('ai-user-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    sendMessage() {
        const input = document.getElementById('ai-user-input');
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Use Ollama if enabled, otherwise use local AI
        if (this.ollamaConfig.enabled) {
            this.getOllamaResponse(message);
        } else {
            setTimeout(() => {
                const response = this.generateResponse(message);
                this.hideTyping();
                this.addMessage(response, 'bot');
            }, 800);
        }
    }

    async getOllamaResponse(userMessage) {
        try {
            if (this.ollamaConfig.failed) {
                throw new Error('Ollama previously failed');
            }

            // Build context for Ollama (Pass message for command detection)
            const systemPrompt = this.buildSystemPrompt(userMessage);
            // Pass userMessage to buildSystemPrompt
            // Detect Modes
            let mood = 'helpful and professional';
            let extraInstruction = '';

            if (userMessage.startsWith('/roast')) {
                mood = 'sarcastic, funny, and critical (Roast Mode)';
                extraInstruction = 'Roast the portfolio or the user\'s question. Be funny but harsh in a Grok way.';
            } else if (userMessage.startsWith('/code')) {
                mood = 'strictly technical';
                extraInstruction = 'Provide only code or technical explanations. No fluff.';
            } else if (userMessage.startsWith('/truth')) {
                mood = 'unfiltered truth (TruthGPT)';
                extraInstruction = 'Speak raw truth without sugarcoating. Be direct.';
            }

            // Send to our Local Python Proxy
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Send config to proxy so it knows where to forward
                    apiKey: this.ollamaConfig.apiKey,
                    endpoint: this.ollamaConfig.endpoint,

                    // Actual LLM Payload (Ollama Chat Format)
                    model: this.ollamaConfig.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Proxy Error: ${response.status}`);
            }

            const data = await response.json();

            // Handle different response formats (Ollama vs OpenAI style)
            let aiResponse = '';
            if (data.message && data.message.content) {
                aiResponse = data.message.content; // Ollama format
            } else if (data.choices && data.choices[0] && data.choices[0].message) {
                aiResponse = data.choices[0].message.content; // OpenAI format
            } else {
                aiResponse = 'Verify your API Key or Model Name.';
            }

            this.hideTyping();
            this.addMessage(aiResponse, 'bot');

        } catch (error) {
            console.warn('Proxy/AI Error:', error);
            this.ollamaConfig.failed = true;

            // Fallback
            if (this.ollamaConfig.fallbackToLocal) {
                const response = this.generateResponse(userMessage);
                this.hideTyping();
                this.addMessage(response, 'bot');
            } else {
                this.hideTyping();
                this.addMessage('⚠️ AI disconnected. Falling back to simple mode.', 'bot');
            }
        }
    }

    buildSystemPrompt() {
        // Build detailed context for Ollama
        return `You are an AI assistant for a professional portfolio website. Here's what you know:

ABOUT THE DEVELOPER:
- Role: ${this.knowledgeBase.about.role}
- Experience: ${this.knowledgeBase.about.experience}
- Specialties: ${this.knowledgeBase.about.specialties.join(', ')}
- Client Satisfaction: ${this.knowledgeBase.about.satisfaction}

PROJECTS:
${this.knowledgeBase.projects.map(p =>
            `- ${p.name}: ${p.description} (Tech: ${p.tech.join(', ')})`
        ).join('\n')}

SKILLS:
${this.knowledgeBase.skills.map(s =>
            `- ${s.name}: ${s.level}% proficiency`
        ).join('\n')}

SERVICES OFFERED:
${this.knowledgeBase.services.map(s => `- ${s}`).join('\n')}

CONTACT INFO:
- WhatsApp: ${this.knowledgeBase.contact.whatsapp}
- Discord: ${this.knowledgeBase.contact.discord}
- Facebook: Available in footer

INSTRUCTIONS:
- Be professional, friendly, and helpful
- Answer questions about projects, skills, experience, and services
- Encourage potential clients to get in touch
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly for personality
- If asked about pricing, mention it's custom-based and suggest contacting directly`;
    }

    askQuestion(question) {
        document.getElementById('ai-user-input').value = question;
        this.sendMessage();
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.conversationHistory.push({ sender, text });
    }

    showTyping() {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message ai-message-bot ai-typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    generateResponse(question) {
        const q = question.toLowerCase().trim();

        // Advanced NLP - Extract intent and entities
        const intent = this.detectIntent(q);
        const entities = this.extractEntities(q);

        // Context-aware responses
        switch (intent) {
            case 'greeting':
                return this.handleGreeting();

            case 'skills':
                return this.handleSkillsQuery(entities);

            case 'projects':
                return this.handleProjectsQuery(entities);

            case 'experience':
                return this.handleExperienceQuery();

            case 'contact':
                return this.handleContactQuery();

            case 'services':
                return this.handleServicesQuery();

            case 'pricing':
                return this.handlePricingQuery();

            case 'technology':
                return this.handleTechnologyQuery(entities);

            case 'availability':
                return this.handleAvailabilityQuery();

            case 'portfolio':
                return this.handlePortfolioQuery();

            default:
                return this.handleIntelligentFallback(q);
        }
    }

    detectIntent(query) {
        // Advanced intent detection with priority scoring
        const intents = {
            greeting: /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))/i,
            skills: /(skill|ability|expertise|proficient|good at|know|master|expert|capable|competent)/i,
            projects: /(project|work|portfolio|built|created|made|developed|case study|example)/i,
            experience: /(experience|years|how long|background|history|career)/i,
            contact: /(contact|hire|reach|email|phone|whatsapp|message|talk|discuss)/i,
            services: /(service|offer|provide|do|help|can you|available for)/i,
            pricing: /(price|cost|rate|budget|fee|charge|expensive|affordable)/i,
            technology: /(tech|framework|language|tool|library|use|work with)/i,
            availability: /(available|free|busy|schedule|time|when)/i,
            portfolio: /(about|who|what do you|tell me|describe|info|information)/i
        };

        let bestMatch = 'unknown';
        let highestScore = 0;

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(query)) {
                const matches = query.match(pattern);
                const score = matches ? matches[0].length : 0;
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = intent;
                }
            }
        }

        return bestMatch;
    }

    extractEntities(query) {
        // Extract mentioned technologies, skills, project types
        const entities = {
            technologies: [],
            skillCategories: [],
            projectTypes: []
        };

        // Extract technologies
        const allTech = ['react', 'vue', 'node', 'nodejs', 'mongodb', 'python', 'postgresql',
            'three.js', 'webgl', 'socket.io', 'cloudflare', 'nginx', 'linux',
            'aws', 'docker', 'kubernetes', 'javascript', 'html', 'css'];

        allTech.forEach(tech => {
            if (query.includes(tech)) {
                entities.technologies.push(tech);
            }
        });

        // Extract skill categories
        if (query.match(/web|frontend|backend|full.?stack/i)) entities.skillCategories.push('web');
        if (query.match(/game|gaming|3d|graphics/i)) entities.skillCategories.push('game');
        if (query.match(/design|ui|ux|graphic/i)) entities.skillCategories.push('design');
        if (query.match(/server|cloud|devops|infrastructure/i)) entities.skillCategories.push('cloud');
        if (query.match(/casino|gambling|betting/i)) entities.skillCategories.push('casino');

        return entities;
    }

    handleGreeting() {
        const greetings = [
            "Hey there! 👋 I'm your AI assistant. I know everything about this portfolio - ask me anything!",
            "Hello! 🎯 Ready to help you learn about the projects, skills, and services. What interests you?",
            "Hi! 🚀 I'm here to answer all your questions about this portfolio. Fire away!"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    handleSkillsQuery(entities) {
        let response = "<strong>💪 Core Skills & Expertise:</strong><br><br>";

        if (entities.skillCategories.length > 0) {
            // Specific skill category asked
            const category = entities.skillCategories[0];
            const relevantSkills = this.knowledgeBase.skills.filter(s =>
                s.keywords.some(k => category.includes(k))
            );

            if (relevantSkills.length > 0) {
                response += `<strong>${category.toUpperCase()} Development:</strong><br>`;
                relevantSkills.forEach(skill => {
                    response += `• <strong>${skill.name}</strong> - ${skill.level}% proficiency<br>`;
                });
            }
        } else {
            // General skills overview
            this.knowledgeBase.skills.forEach((skill, index) => {
                const bar = '█'.repeat(Math.floor(skill.level / 10)) + '░'.repeat(10 - Math.floor(skill.level / 10));
                response += `${index + 1}. <strong>${skill.name}</strong><br>`;
                response += `   ${bar} ${skill.level}%<br>`;
            });
        }

        response += `<br>💡 <em>Want details on a specific skill? Just ask!</em>`;
        return response;
    }

    handleProjectsQuery(entities) {
        let response = "<strong>🚀 Featured Projects:</strong><br><br>";

        if (entities.skillCategories.length > 0 || entities.technologies.length > 0) {
            // Filter projects by category or tech
            let filtered = this.knowledgeBase.projects;

            if (entities.skillCategories.length > 0) {
                filtered = filtered.filter(p =>
                    entities.skillCategories.includes(p.category)
                );
            }

            if (entities.technologies.length > 0) {
                filtered = filtered.filter(p =>
                    p.tech.some(t => entities.technologies.includes(t.toLowerCase()))
                );
            }

            if (filtered.length > 0) {
                filtered.forEach((project, i) => {
                    response += `<strong>${i + 1}. ${project.name}</strong><br>`;
                    response += `   ${project.description}<br>`;
                    response += `   <em>Tech: ${project.tech.join(', ')}</em><br><br>`;
                });
            } else {
                response = "I don't have projects matching those criteria, but here are all the projects:<br><br>";
                this.knowledgeBase.projects.forEach((project, i) => {
                    response += `<strong>${i + 1}. ${project.name}</strong><br>`;
                    response += `   📝 ${project.description}<br>`;
                    response += `   🛠️ <em>${project.tech.join(', ')}</em><br><br>`;
                });
            }
        } else {
            // All projects
            this.knowledgeBase.projects.forEach((project, i) => {
                response += `<strong>${i + 1}. ${project.name}</strong><br>`;
                response += `   📝 ${project.description}<br>`;
                response += `   🛠️ <em>${project.tech.join(', ')}</em><br><br>`;
            });
        }

        response += `💬 <em>Want to know more about a specific project? Just ask!</em>`;
        return response;
    }

    handleExperienceQuery() {
        return `<strong>📊 Professional Experience:</strong><br><br>
                ⏱️ <strong>${this.knowledgeBase.about.experience}</strong> of hands-on development<br>
                🎯 Client Satisfaction: <strong>${this.knowledgeBase.about.satisfaction}</strong><br><br>
                <strong>Specializations:</strong><br>
                ${this.knowledgeBase.about.specialties.map(s => `• ${s}`).join('<br>')}<br><br>
                💼 <em>Proven track record in building enterprise-grade solutions!</em>`;
    }

    handleContactQuery() {
        return `<strong>📞 Let's Connect!</strong><br><br>
                📱 <strong>WhatsApp:</strong> ${this.knowledgeBase.contact.whatsapp}<br>
                💬 <strong>Discord:</strong> ${this.knowledgeBase.contact.discord}<br>
                📘 <strong>Facebook:</strong> Check footer for link<br><br>
                📧 <strong>Or use the contact form</strong> on this page!<br><br>
                🚀 <em>Available for projects - let's discuss your needs!</em>`;
    }

    handleServicesQuery() {
        return `<strong>🎯 Services Offered:</strong><br><br>
                ${this.knowledgeBase.services.map((s, i) =>
            `${i + 1}. ✅ ${s}`
        ).join('<br>')}<br><br>
                💡 <em>Custom solutions tailored to your needs!</em><br>
                📞 <em>Get in touch to discuss your project!</em>`;
    }

    handlePricingQuery() {
        return `<strong>💰 Pricing Information:</strong><br><br>
                Every project is unique, so pricing is customized based on:<br>
                • 📊 Project scope & complexity<br>
                • ⏱️ Timeline requirements<br>
                • 🎯 Specific features needed<br>
                • 🔄 Ongoing support level<br><br>
                💬 <strong>Contact via WhatsApp</strong> for a personalized quote!<br>
                📱 ${this.knowledgeBase.contact.whatsapp}<br><br>
                ⚡ <em>Competitive rates, premium quality!</em>`;
    }

    handleTechnologyQuery(entities) {
        if (entities.technologies.length > 0) {
            const tech = entities.technologies[0];
            const projects = this.knowledgeBase.projects.filter(p =>
                p.tech.some(t => t.toLowerCase() === tech)
            );

            if (projects.length > 0) {
                return `<strong>✅ Yes! Expert in ${tech.toUpperCase()}</strong><br><br>
                        Used in these projects:<br>
                        ${projects.map(p => `• ${p.name}`).join('<br>')}<br><br>
                        💪 <em>Can build anything with ${tech}!</em>`;
            }
        }

        return this.handleSkillsQuery(entities);
    }

    handleAvailabilityQuery() {
        return `<strong>📅 Availability:</strong><br><br>
                ✅ Currently accepting new projects!<br>
                ⚡ Fast response time (usually within 24 hours)<br>
                🌍 Work with clients globally<br><br>
                📱 <strong>Contact Now:</strong> ${this.knowledgeBase.contact.whatsapp}<br><br>
                🚀 <em>Let's start building your project today!</em>`;
    }

    handlePortfolioQuery() {
        return `<strong>👤 About This Portfolio:</strong><br><br>
                ${this.knowledgeBase.about.role}<br><br>
                <strong>What I Do:</strong><br>
                Build cutting-edge web applications, casino systems, and enterprise solutions
                with modern technologies and best practices.<br><br>
                📊 <strong>${this.knowledgeBase.about.experience}</strong> experience<br>
                ⭐ <strong>${this.knowledgeBase.about.satisfaction}</strong> client satisfaction<br><br>
                💬 <em>Ask me about projects, skills, or services!</em>`;
    }

    handleIntelligentFallback(query) {
        // Smart fallback - try to find relevant keywords
        const keywords = query.split(' ').filter(w => w.length > 3);
        let suggestions = [];

        // Search in projects
        const relevantProjects = this.knowledgeBase.projects.filter(p =>
            keywords.some(k =>
                p.name.toLowerCase().includes(k) ||
                p.description.toLowerCase().includes(k)
            )
        );

        if (relevantProjects.length > 0) {
            return `<strong>Found relevant projects:</strong><br><br>
                    ${relevantProjects.map(p =>
                `• <strong>${p.name}</strong>: ${p.description}`
            ).join('<br><br>')}<br><br>
                    💬 <em>Want to know more? Just ask!</em>`;
        }

        // Suggest popular questions
        return `<strong>🤔 I can help you with:</strong><br><br>
                • "What are your skills?" - See all technical abilities<br>
                • "Show me your projects" - View portfolio work<br>
                • "What services do you offer?" - See what's available<br>
                • "How can I contact you?" - Get contact info<br>
                • "Do you know [technology]?" - Ask about specific tech<br><br>
                💡 <em>Try asking something more specific!</em>`;
    }


    findMentionedTech(question) {
        const allTech = new Set();
        this.knowledgeBase.projects.forEach(p => {
            p.tech.forEach(t => allTech.add(t.toLowerCase()));
        });

        return Array.from(allTech).filter(tech =>
            question.includes(tech.toLowerCase())
        );
    }
}

// Initialize AI Assistant
let portfolioAI;
document.addEventListener('DOMContentLoaded', () => {
    portfolioAI = new PortfolioAI();
});
