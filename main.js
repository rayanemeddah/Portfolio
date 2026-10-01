/**
 * Portfolio BTS SIO SLAM
 * JavaScript principal - Version complète et optimisée
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    typingTexts: [
        'Développeur Web',
        'Étudiant BTS SIO SLAM',
        'Passionné de Code',
        'Créateur d\'Applications'
    ],
    typingSpeed: 100,
    typingDelay: 2000
};

// ==========================================
// UTILITAIRES
// ==========================================
const Utils = {
    // Throttle
    throttle(fn, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn.apply(this, args);
            }
        };
    },
    
    // Debounce
    debounce(fn, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },
    
    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Query selectors
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },
    
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }
};

// ==========================================
// LOADER
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 800);
});

// ==========================================
// NAVIGATION
// ==========================================
class Navigation {
    constructor() {
        this.navbar = Utils.$('#navbar');
        this.navToggle = Utils.$('#navToggle');
        this.navMenu = Utils.$('#navMenu');
        this.navLinks = Utils.$$('.nav-link');
        
        // Bind methods avec throttle
        this.handleScrollBound = Utils.throttle(this.handleScroll.bind(this), 100);
        this.updateActiveLinkBound = Utils.throttle(this.updateActiveLink.bind(this), 100);
        
        this.init();
    }

    init() {
        // Toggle menu mobile
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Liens de navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });

        // Scroll spy
        window.addEventListener('scroll', () => {
            this.handleScrollBound();
            this.updateActiveLinkBound();
        });

        // Fermer menu au clic extérieur
        document.addEventListener('click', (e) => {
            if (this.navbar && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // ARIA
        const isExpanded = this.navMenu.classList.contains('active');
        this.navToggle.setAttribute('aria-expanded', isExpanded);
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }

    handleLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                this.closeMenu();
                this.setActiveLink(e.currentTarget);
            }
        }
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveLink() {
        const sections = Utils.$$('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// ==========================================
// EFFET DE FRAPPE (TYPING)
// ==========================================
class TypingEffect {
    constructor(element, texts) {
        this.element = element;
        this.texts = texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = CONFIG.typingSpeed;
        
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.typingSpeed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.typingDelay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==========================================
// ANIMATIONS AU SCROLL
// ==========================================
class ScrollAnimations {
    constructor() {
        this.elements = Utils.$$(
            '.skill-category, .project-card, .contact-item, .source-card, .article-card, .tool-item, .theme-card'
        );
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => {
            observer.observe(el);
        });
    }
}

// ==========================================
// ANIMATION DES BARRES DE COMPÉTENCES
// ==========================================
class SkillsAnimation {
    constructor() {
        this.skillBars = Utils.$$('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const progress = bar.style.getPropertyValue('--progress');
                    
                    bar.style.width = '0';
                    
                    setTimeout(() => {
                        bar.style.width = progress;
                    }, 200);
                    
                    observer.unobserve(bar);
                }
            });
        }, {
            threshold: 0.5
        });

        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// ==========================================
// MODAL PROJET
// ==========================================
class ProjectModal {
    constructor() {
        this.modal = Utils.$('#projectModal');
        this.modalBody = Utils.$('#modalBody');
        this.modalClose = Utils.$('#modalClose');
        this.modalOverlay = Utils.$('.modal-overlay');
        
        this.projectsData = this.getProjectsData();
        this.previousActiveElement = null;
        
        this.init();
    }


    init() {
        // Boutons d'ouverture
        Utils.$$('.project-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project');
                this.open(projectId);
            });
        });

        // Boutons de fermeture
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.close());
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.close());
        }

        // Fermer avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(projectId) {
        const project = this.projectsData[projectId];
        
        if (!project) {
            console.error('Projet non trouvé:', projectId);
            return;
        }

        this.modalBody.innerHTML = this.generateModalContent(project);
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Gestion du focus
        this.previousActiveElement = document.activeElement;
        this.trapFocus();
        
        const firstFocusable = Utils.$('button, a', this.modal);
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    close() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        // Restaurer le focus
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
        
        // Retirer le focus trap
        if (this.focusTrapHandler) {
            this.modal.removeEventListener('keydown', this.focusTrapHandler);
        }
    }

    trapFocus() {
        const focusableElements = Utils.$$(
            'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            this.modal
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        
        this.modal.addEventListener('keydown', this.focusTrapHandler);
    }

generateModalContent(project) {
    // Échapper les données
    const title = Utils.escapeHtml(project.title);
    const context = Utils.escapeHtml(project.context);
    const objective = Utils.escapeHtml(project.objective);
    const role = Utils.escapeHtml(project.role);
    const result = Utils.escapeHtml(project.result);
    
    return `
        <h2 style="font-size: 2rem; color: var(--dark); margin-bottom: 1.5rem;">${title}</h2>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
            ${project.tags.map(tag => `<span class="project-tags" style="padding: 0.35rem 0.85rem; background: rgba(108, 99, 255, 0.1); color: var(--primary); border-radius: 20px; font-size: 0.875rem;">${Utils.escapeHtml(tag)}</span>`).join('')}
        </div>

        <img src="${project.image}" alt="${title}" style="width: 100%; border-radius: 12px; margin-bottom: 2rem;" loading="lazy">

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">Contexte</h3>
            <p style="color: var(--gray); line-height: 1.8;">${context}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">Objectif</h3>
            <p style="color: var(--gray); line-height: 1.8;">${objective}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">Mon rôle</h3>
            <p style="color: var(--gray); line-height: 1.8;">${role}</p>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;"> Technologies utilisées</h3>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${project.technologies.map(tech => `<span style="padding: 0.5rem 1rem; background: var(--light); color: var(--dark); border-radius: 8px; font-weight: 500;">${Utils.escapeHtml(tech)}</span>`).join('')}
            </div>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">✨ Fonctionnalités principales</h3>
            <ul style="list-style: none; padding: 0;">
                ${project.features.map(feature => `
                    <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: var(--gray);">
                        <i class="bi bi-check-circle-fill" style="position: absolute; left: 0; color: var(--primary);"></i>
                        ${Utils.escapeHtml(feature)}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">🎓 Compétences mobilisées</h3>
            <ul style="list-style: none; padding: 0;">
                ${project.skills.map(skill => `
                    <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative; color: var(--gray);">
                        <i class="bi bi-chevron-right" style="position: absolute; left: 0; color: var(--primary);"></i>
                        ${Utils.escapeHtml(skill)}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--dark); margin-bottom: 1rem; font-size: 1.25rem;">Résultat</h3>
            <p style="color: var(--gray); line-height: 1.8;">${result}</p>
        </div>

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    ${project.github ? `
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration: none;">
            <i class="bi bi-github"></i>
            ${project.github === '#' ? 'Code GitHub (bientôt)' : 'Voir le code'}
        </a>
    ` : ''}
    
    ${project.demo ? `
        <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="text-decoration: none;">
            <i class="bi bi-box-arrow-up-right"></i>
            Voir la démo
        </a>
    ` : ''}
    
    ${project.cahierCharges ? `
        <a href="${project.cahierCharges}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="text-decoration: none;">
            <i class="bi bi-file-earmark-text"></i>
            Cahier des charges
        </a>
    ` : ''}
    
    ${project.documentation ? `
        <a href="${project.documentation}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="text-decoration: none;">
            <i class="bi bi-diagram-3"></i>
            Diagrammes UML
        </a>
    ` : ''}
</div>
    `;
}
getProjectsData() {
    return {
        'voisinpartage': {
            title: 'VoisinPartage - Plateforme de partage d\'objets entre voisins',
            image: 'assets/images/projects/VoisinPartage.png',
            tags: ['PHP', 'MySQL', 'PDO', 'JavaScript', 'HTML5', 'CSS3', 'Sécurité Web'],
            context: 'Projet collaboratif réalisé en équipe de 4 dans le cadre du BTS SIO SLAM. L\'objectif était de créer une application web complète favorisant l\'économie collaborative et le lien social entre habitants d\'une même ville, permettant le prêt et le don d\'objets du quotidien rarement utilisés (perceuse, échelle, tondeuse, vélo, matériel de camping, jeux de société, etc.).',
            objective: 'Développer une plateforme web sécurisée et intuitive avec un système complet de gestion d\'annonces (CRUD), messagerie privée entre utilisateurs, recherche et filtrage avancés, et tableau de bord administrateur pour la modération. L\'application devait respecter les normes de sécurité web (protection contre les injections SQL, CSRF, XSS) et proposer une interface responsive moderne.',
            role: 'Développeur full-stack — Responsable de l\'architecture backend, conception et implémentation de la base de données (MCD/MLD normalisé 3NF), développement du système d\'authentification sécurisé (sessions PHP, hashage bcrypt, tokens CSRF), création du module CRUD des annonces avec gestion des statuts (Disponible/Réservé/Indisponible), et mise en place des requêtes préparées PDO pour prévenir les injections SQL.',
            technologies: [
                'PHP 8 (Backend)',
                'MySQL (Base de données)',
                'PDO (Requêtes préparées)',
                'HTML5 / CSS3',
                'JavaScript (Vanilla)',
                'WampServer',
                'Bcrypt (Hashage)',
                'Sessions PHP',
                'Protection CSRF/XSS'
            ],
            features: [
                'Système d\'authentification sécurisé (inscription, connexion, gestion de session)',
                'CRUD complet des annonces (Créer, Lire, Modifier, Supprimer)',
                'Gestion des statuts d\'annonces : Disponible, Réservé, Indisponible',
                'Messagerie privée entre utilisateurs avec interface conversationnelle',
                'Système de recherche et filtrage par mot-clé, catégorie et type (prêt/don)',
                'Gestion du profil utilisateur avec photo de profil',
                'Tableau de bord administrateur avec modération des annonces et gestion des utilisateurs',
                'Upload et affichage d\'images pour les annonces',
                'Interface responsive (mobile, tablette, desktop)',
                'Protection contre les attaques (SQL Injection, CSRF, XSS)',
                'Validation des données côté client (JavaScript) et serveur (PHP)',
                'Hashage sécurisé des mots de passe avec bcrypt'
            ],
            skills: [
                'Conception de base de données relationnelle (MCD, MLD, normalisation 3NF)',
                'Développement backend en PHP orienté objet',
                'Sécurisation des applications web (requêtes préparées PDO, tokens CSRF, échappement XSS)',
                'Gestion des sessions PHP et authentification sécurisée',
                'Hashage de mots de passe avec bcrypt (password_hash)',
                'Architecture MVC et séparation des responsabilités',
                'Création d\'interfaces utilisateur responsive (HTML5, CSS3, JavaScript)',
                'Validation de formulaires côté client et serveur',
                'Upload et traitement de fichiers (images)',
                'Travail en équipe avec répartition des tâches et suivi de planning (Gantt)',
                'Documentation technique complète (cahier des charges, diagrammes UML)',
                'Tests et débogage d\'applications web'
            ],
            result: 'Application web complète et fonctionnelle livrée dans les délais avec toutes les fonctionnalités du cahier des charges implémentées. Le projet a permis de mettre en pratique les compétences en développement full-stack PHP/MySQL, en sécurité web et en travail collaboratif. La base de données normalisée 3NF garantit l\'intégrité des données, et les mesures de sécurité (requêtes préparées, CSRF, bcrypt) protègent efficacement contre les attaques courantes. L\'interface responsive offre une expérience utilisateur optimale sur tous les appareils.',
            github: '#',
            demo: null,
            documentation: 'assets/documents/voisinpartage-diagrammes.pdf',
            cahierCharges: 'assets/documents/voisinpartage-cahier-charges.pdf',
            },
            
            '1': {
    title: 'Jeu de devinette de mots en C',
    image: 'assets/images/projects/projet1.jpg',
    tags: ['C', 'Algorithmique', 'Fichiers', 'Threads', 'Structures'],
    context: 'Projet réalisé en 1ère année préparatoire (Licence 1) à l\'Université Abderrahmane Mira de Béjaïa. Dans le cadre du cours d\'algorithmique et de programmation en langage C, j\'ai développé seul une application console complète de jeu de devinette de mots, mettant en pratique les fondamentaux de la programmation procédurale et de la gestion de fichiers.',
    objective: 'Créer un jeu interactif en C permettant à un joueur de retrouver des mots mélangés, avec un système de niveaux progressifs, un chronomètre par mot (thread POSIX), un système de score et une sauvegarde automatique de la progression. Le jeu devait être robuste, portable (Windows/Linux) et bien structuré.',
    role: 'Développeur unique — Conception de l\'architecture complète du programme, implémentation de toutes les fonctionnalités : chargement d\'un dictionnaire depuis fichier, gestion des joueurs avec sauvegarde/chargement, système de niveaux avec mots de longueur croissante, timer en thread POSIX parallèle, gestion des signaux (Ctrl+C), et compatibilité multiplateforme Windows/Linux.',
    technologies: [
        'Langage C (C99/C11)',
        'Threads POSIX (pthread)',
        'Gestion de fichiers (stdio.h)',
        'Structures de données (struct)',
        'Gestion des signaux (signal.h)',
        'Compatibilité Windows/Linux',
        'Makefile',
        'Code::Blocks (IDE)',
        'GCC (compilateur)'
    ],
    features: [
        'Chargement d\'un dictionnaire de 1000 mots depuis un fichier texte (mots.txt)',
        'Système de 5 niveaux avec mots de longueur croissante (niveau+1 lettres)',
        'Mélange aléatoire des lettres du mot à deviner (algorithme de Fisher-Yates)',
        'Timer de 30 secondes par mot géré par un thread POSIX en parallèle',
        'Compte à rebours affiché en temps réel sur la même ligne (\\r)',
        'Système de score : +10 points (bonne réponse) / -3 points (mauvaise réponse ou timeout)',
        '3 tentatives par mot avec indices progressifs (1ère lettre, puis 1ère et dernière)',
        'Sauvegarde automatique de la progression dans le dossier sauvegardes/',
        'Chargement automatique du profil existant au démarrage',
        'Gestion propre de Ctrl+C avec sauvegarde avant fermeture (SIGINT)',
        'Commande "quit" ou "q" pour quitter à tout moment',
        'Chronomètre global par niveau (minutes:secondes)',
        'Compatibilité multiplateforme Windows (_WIN32) et Linux/macOS',
        'Support des caractères accentués français (UTF-8)'
    ],
    skills: [
        'Programmation procédurale en C avec structures (struct)',
        'Gestion de la mémoire dynamique (malloc, free, strdup)',
        'Lecture/écriture de fichiers texte (fopen, fgets, fprintf)',
        'Programmation multi-thread avec POSIX pthread (pthread_create, pthread_join)',
        'Synchronisation de threads (variable partagée volatile)',
        'Gestion des signaux Unix (signal, SIGINT)',
        'Manipulation de chaînes de caractères (strcpy, strcmp, strdup)',
        'Génération de nombres aléatoires (rand, srand)',
        'Algorithme de mélange Fisher-Yates',
        'Compatibilité multiplateforme avec directives de préprocesseur (#ifdef _WIN32)',
        'Gestion des caractères accentués en UTF-8',
        'Organisation du code en fonctions modulaires et prototypes',
        'Débogage et tests en conditions réelles'
    ],
    result: 'Application console fonctionnelle et complète développée entièrement en C. Le projet m\'a permis de maîtriser les fondamentaux de la programmation système : gestion de fichiers, threads POSIX, signaux Unix et compatibilité multiplateforme. Le jeu est jouable et robuste avec une gestion correcte des cas d\'erreur (mémoire, fichiers manquants, saisie invalide). Ce projet a été un tremplin vers ma formation BTS SIO SLAM où j\'applique ces bases algorithmiques au développement web et applicatif.',
    github: 'https://github.com/rayanemeddah/jeu-devinette-c',
    demo: null,
    cahierCharges: null,
    documentation: null
},

'cliniquemanager': {
    title: 'Clinique Manager - Application web de gestion de clinique',
    image: 'assets/images/projects/clinique-manager.png',
    tags: ['Java EE', 'MySQL', 'Tomcat', 'JSP', 'Servlet', 'JDBC', 'HTML5/CSS3'],
    context: 'Projet de groupe réalisé en BTS SIO SLAM (2025). L\'objectif était de concevoir une application web complète de gestion d\'une clinique médicale, intégrant une interface web côté client, un back-end Java EE, une base de données relationnelle MySQL, une authentification sécurisée et un système de gestion des droits d\'accès selon le profil utilisateur (Administrateur, Médecin, Secrétaire).',
    objective: 'Développer une application web sécurisée et centralisée permettant à une clinique de gérer efficacement ses patients, rendez-vous, consultations et documents médicaux, tout en garantissant un accès adapté à chaque profil utilisateur. L\'application devait respecter une architecture 3 couches (Présentation, Métier, Données) et des normes de sécurité strictes.',
    role: 'Développeur full-stack — Participation à la conception de la base de données relationnelle (MCD/MLD normalisé 3NF), développement des Servlets Java EE pour la logique métier, création des pages JSP dynamiques, mise en place de l\'authentification sécurisée avec gestion des sessions, et implémentation des requêtes préparées JDBC pour prévenir les injections SQL.',
    technologies: [
        'Java EE (Servlets)',
        'JSP (JavaServer Pages)',
        'MySQL (Base de données)',
        'JDBC (PreparedStatement)',
        'Apache Tomcat (Serveur)',
        'HTML5 / CSS3',
        'JavaScript (Vanilla)',
        'PowerDesigner (MCD/MLD)',
        'IntelliJ IDEA',
        'Git / GitHub'
    ],
    features: [
        'Authentification sécurisée avec gestion des sessions Java EE et protection brute force',
        'Gestion des droits d\'accès selon 3 profils : Administrateur, Médecin, Secrétaire',
        'CRUD complet des patients (ajout, modification, consultation, suppression, recherche)',
        'Gestion des rendez-vous : prise, modification, annulation, consultation du planning',
        'Enregistrement des consultations médicales avec observations et historique patient',
        'Gestion des documents médicaux associés aux dossiers patients',
        'Gestion des spécialités médicales et association médecin/spécialité',
        'Tableau de bord adapté à chaque rôle avec statistiques (patients, RDV, consultations)',
        'Protection contre les injections SQL via PreparedStatement JDBC',
        'Validation des données côté client (JavaScript) et serveur (Java)',
        'Interface responsive, ergonomique et intuitive',
        'Base de données normalisée 3NF avec 8 entités relationnelles'
    ],
    skills: [
        'Architecture 3 couches (Présentation JSP / Métier Servlet / Données MySQL)',
        'Développement Java EE avec Servlets et JSP',
        'Connexion base de données avec JDBC et PreparedStatement',
        'Gestion des sessions Java EE et authentification sécurisée',
        'Conception de base de données relationnelle (MCD, MLD, normalisation 3NF)',
        'Sécurisation des applications web (injections SQL, brute force, accès non autorisés)',
        'Contrôle des droits d\'accès par profil utilisateur',
        'Déploiement sur serveur Apache Tomcat',
        'Modélisation UML avec PowerDesigner',
        'Travail en équipe avec Git et répartition des tâches',
        'Rédaction du cahier des charges complet',
        'Tests fonctionnels et validation des critères'
    ],
    result: 'Application web fonctionnelle et sécurisée livrée avec toutes les fonctionnalités du cahier des charges. Le projet a permis de maîtriser l\'architecture Java EE (Servlet/JSP/JDBC), la gestion des rôles et droits d\'accès, ainsi que les bonnes pratiques de sécurité web. La base de données normalisée 3NF avec 8 entités garantit l\'intégrité référentielle des données. L\'application répond aux 7 critères de validation : authentification, cloisonnement des rôles, gestion patients/RDV/consultations, stockage MySQL, interfaces ergonomiques et mesures de sécurité.',
    github: '#',
    demo: null,
    cahierCharges: 'assets/documents/clinique-manager-cahier-charges.pdf',
    documentation: 'assets/documents/clinique-manager-diagrammes.pdf'
},
        };
    }
}

// ==========================================
// GESTION DES ARTICLES DE VEILLE
// ==========================================
class VeilleManager {
    constructor() {
        this.articleLinks = Utils.$$('.article-link');
        this.init();
    }

    init() {
        this.articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openArticleInfo(e.currentTarget);
            });
        });
    }

    openArticleInfo(link) {
        const article = link.closest('.article-card');
        const title = article.querySelector('h4').textContent;
        const date = article.querySelector('.article-date span').textContent;
        
        this.showNotification(
            `📚 Article : "${title}"\n📅 Date : ${date}\n\nCette fonctionnalité sera bientôt disponible avec le contenu complet de l'article et mes notes de veille.`,
            'info'
        );
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'info' ? '#6C63FF' : '#FF6B6B'};
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            max-width: 450px;
            animation: slideIn 0.3s ease;
            white-space: pre-line;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: start;">
                <i class="bi bi-info-circle" style="font-size: 1.5rem; flex-shrink: 0;"></i>
                <span style="line-height: 1.5;">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(500px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        if (!document.querySelector('#slideInAnimation')) {
            style.id = 'slideInAnimation';
            document.head.appendChild(style);
        }

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ==========================================
// FORMULAIRE CONTACT - VERSION CORRIGÉE
// ==========================================
class ContactForm {
    constructor() {
        this.form = Utils.$('#contactForm');
        this.isRecaptchaLoaded = false;
        this.init();
    }

    init() {
        if (!this.form) return;

        // ✅ Vérifier si reCAPTCHA est chargé
        if (typeof grecaptcha !== 'undefined') {
            this.isRecaptchaLoaded = true;
        } else {
            window.addEventListener('load', () => {
                if (typeof grecaptcha !== 'undefined') {
                    this.isRecaptchaLoaded = true;
                }
            });
        }

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        try {
            // ✅ Vérifier reCAPTCHA
            if (!this.isRecaptchaLoaded) {
                this.showNotification('⏳ Chargement de la vérification...', 'info');
                return;
            }

            const recaptchaResponse = grecaptcha.getResponse();

            if (!recaptchaResponse) {
                this.showNotification(
                    '⚠️ Veuillez cocher "Je ne suis pas un robot"',
                    'error'
                );
                return;
            }

            const formData = {
                name: Utils.$('#name')?.value.trim(),
                email: Utils.$('#email')?.value.trim(),
                subject: Utils.$('#subject')?.value.trim(),
                message: Utils.$('#message')?.value.trim(),
                recaptcha: recaptchaResponse
            };

            // Validation
            if (!this.validate(formData)) {
                return;
            }

            // ✅ Désactiver le bouton pendant l'envoi
            const submitBtn = Utils.$('button[type="submit"]', this.form);
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Envoi...';

            // ✅ Envoi réel (remplacer par votre endpoint)
            await this.sendEmail(formData);

            this.showNotification(
                '✅ Message envoyé !\n\nJe vous répondrai rapidement.',
                'success'
            );

            this.form.reset();
            grecaptcha.reset();

            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            this.showNotification(
                '❌ Erreur lors de l\'envoi.\nVeuillez réessayer.',
                'error'
            );
        }
    }

    async sendEmail(data) {
        // ✅ REMPLACER PAR VOTRE API (EmailJS, FormSubmit, etc.)
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('📧 Email envoyé:', data);
                resolve();
            }, 1500);
        });
    }

    validate(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Nom : min. 2 caractères');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Email invalide');
        }

        if (!data.subject || data.subject.length < 3) {
            errors.push('Sujet : min. 3 caractères');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Message : min. 10 caractères');
        }

        if (errors.length > 0) {
            this.showNotification(
                '⚠️ Erreurs de validation :\n\n' + errors.join('\n'),
                'error'
            );
            return false;
        }

        return true;
    }

    showNotification(message, type = 'info') {
        const existing = Utils.$('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6C63FF'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            white-space: pre-line;
            font-size: 0.95rem;
            line-height: 1.5;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: start; gap: 0.75rem;">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'x-circle-fill' : 'info-circle-fill'}" 
                   style="font-size: 1.25rem; flex-shrink: 0; margin-top: 2px;"></i>
                <span>${message}</span>
            </div>
        `;

        // ✅ Animation CSS
        if (!Utils.$('#notificationAnimation')) {
            const style = document.createElement('style');
            style.id = 'notificationAnimation';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}
// ==========================================
// BOUTON RETOUR EN HAUT
// ==========================================
class ScrollToTop {
    constructor() {
        this.button = Utils.$('#scrollToTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        // Afficher/masquer le bouton au scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            this.toggleButton();
        }, 100));

        // Clic sur le bouton
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    toggleButton() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// MODAL COMPÉTENCES
// ==========================================
class SkillModal {
    constructor() {
        this.modal = Utils.$('#skillModal');
        this.modalBody = Utils.$('#skillModalBody');
        this.modalClose = Utils.$('#skillModalClose');
        this.modalOverlay = Utils.$('.modal-overlay', this.modal);
        
        this.skillsData = this.getSkillsData();
        this.previousActiveElement = null;
        
        this.init();
    }

    init() {
        // Clic sur les compétences
        Utils.$$('.skill-icon-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const skillId = item.getAttribute('data-skill');
                if (skillId) {
                    this.open(skillId);
                }
            });
        });

        // Bouton de fermeture
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.close());
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.close());
        }

        // Fermer avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(skillId) {
        const skill = this.skillsData[skillId];
        
        if (!skill) {
            console.error('Compétence non trouvée:', skillId);
            return;
        }

        this.modalBody.innerHTML = this.generateModalContent(skill);
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // Animation de la barre de progression
        setTimeout(() => {
            const progressBar = Utils.$('.skill-level-progress');
            if (progressBar) {
                progressBar.style.width = skill.level + '%';
            }
        }, 100);
        
        // Gestion du focus
        this.previousActiveElement = document.activeElement;
        const firstFocusable = Utils.$('button', this.modal);
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    close() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }
    }

generateModalContent(skill) {
    return `
        <div class="skill-modal-header">
            <div class="skill-modal-icon">
                <img src="${skill.icon}" alt="${skill.name}">
            </div>
            <div class="skill-modal-title">
                <h2>${skill.name}</h2>
                <div class="skill-modal-category">${skill.category}</div>
            </div>
        </div>

        <p class="skill-modal-description">${skill.description}</p>

        <div class="skill-level-section">
            <h3>
                <i class="bi bi-bar-chart-fill"></i>
                Niveau de maîtrise
            </h3>
            <div class="skill-level-bar">
                <div class="skill-level-progress" style="width: 0%">
                    ${skill.level}%
                </div>
            </div>
        </div>

        <h3 style="font-size: 1.25rem; color: var(--dark); margin: 2rem 0 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="bi bi-mortarboard-fill"></i>
            Ce que j'ai appris
        </h3>

        <div class="skill-experience">
            <ul>
                ${skill.learned.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
}

    getSkillsData() {
        return {
            'csharp': {
                name: 'C#',
                category: 'Langage de programmation',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
                level: 75,
                description: 'Langage orienté objet que j\'ai approfondi durant ma formation BTS SIO. Je l\'utilise principalement pour développer des applications desktop avec .NET et des applications console.',
                learned: [
                    'Programmation orientée objet (classes, héritage, polymorphisme)',
                    'Manipulation de collections (List, Dictionary, LINQ)',
                    'Gestion des exceptions et débogage',
                    'Création d\'interfaces graphiques avec Windows Forms',
                    'Connexion aux bases de données avec ADO.NET',
                    'Pattern MVC et architecture logicielle'
                ],
            },
            'python': {
                name: 'Python',
                category: 'Langage de programmation',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                level: 80,
                description: 'Mon premier langage de programmation appris en Licence 1. Je l\'utilise pour l\'automatisation, les scripts et les projets personnels.',
                learned: [
                    'Syntaxe Python et bonnes pratiques (PEP 8)',
                    'Manipulation de fichiers (CSV, JSON, TXT)',
                    'Programmation orientée objet en Python',
                    'Utilisation de bibliothèques (Pandas, Requests)',
                    'Création d\'interfaces avec Tkinter',
                    'Scripts d\'automatisation de tâches',
                    'Gestion d\'erreurs avec try/except'
                ],
            },
            'java': {
                name: 'Java',
                category: 'Langage de programmation',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
                level: 65,
                description: 'Langage étudié dans le cadre du BTS SIO pour comprendre la POO et développer des applications multiplateformes.',
                learned: [
                    'Principes fondamentaux de la POO',
                    'Collections Java (ArrayList, HashMap)',
                    'Gestion des threads et programmation concurrente',
                    'Interfaces graphiques avec Swing',
                    'Manipulation de fichiers et sérialisation',
                    'Patterns de conception (Singleton, Factory)'
                ],
            },
            'php': {
                name: 'PHP',
                category: 'Développement Web Backend',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
                level: 70,
                description: 'Langage backend utilisé pour créer des sites web dynamiques et des API. Maîtrise de PHP 8 et des bonnes pratiques modernes.',
                learned: [
                    'Syntaxe PHP et fonctions natives',
                    'Architecture MVC avec PHP',
                    'Sessions et cookies pour l\'authentification',
                    'Requêtes préparées (PDO) pour la sécurité',
                    'Upload et manipulation de fichiers',
                    'Création d\'API REST',
                    'Utilisation de Composer et autoloading'
                ],
            },
            'html5': {
                name: 'HTML5',
                category: 'Développement Web Frontend',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                level: 90,
                description: 'Langage de balisage pour structurer le contenu web. Maîtrise des balises sémantiques et des bonnes pratiques d\'accessibilité.',
                learned: [
                    'Structure sémantique HTML5',
                    'Formulaires avancés et validation',
                    'Balises multimédias (audio, video)',
                    'Accessibilité (ARIA, attributs sémantiques)',
                    'Meta tags pour le SEO',
                    'Canvas et SVG pour les graphiques',
                    'Web Storage API (localStorage, sessionStorage)'
                ],
            },
            'css3': {
                name: 'CSS3',
                category: 'Développement Web Frontend',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                level: 85,
                description: 'Feuilles de style pour créer des interfaces modernes, responsives et animées. Maîtrise de Flexbox, Grid et animations CSS.',
                learned: [
                    'Flexbox et CSS Grid pour les layouts',
                    'Responsive design et media queries',
                    'Animations et transitions CSS',
                    'Variables CSS (custom properties)',
                    'Pseudo-classes et pseudo-éléments',
                    'Méthodologie BEM pour organiser le code',
                    'Préprocesseurs (notions de SASS)'
                ],
            },
            'javascript': {
                name: 'JavaScript',
                category: 'Développement Web Frontend',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                level: 78,
                description: 'Langage de programmation pour rendre les sites web interactifs. Maîtrise du DOM, des événements et de l\'asynchrone.',
                learned: [
                    'Manipulation du DOM et événements',
                    'ES6+ (arrow functions, destructuring, modules)',
                    'Programmation asynchrone (Promises, async/await)',
                    'Fetch API et AJAX',
                    'LocalStorage et gestion de données',
                    'Programmation orientée objet en JS',
                    'Debugging avec les DevTools'
                ],
            },
            'bootstrap': {
                name: 'Bootstrap',
                category: 'Framework CSS',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
                level: 82,
                description: 'Framework CSS pour créer rapidement des interfaces responsives et modernes avec des composants préconçus.',
                learned: [
                    'Système de grille Bootstrap',
                    'Composants (navbars, cards, modals)',
                    'Utilitaires de spacing et de typographie',
                    'Personnalisation avec SASS',
                    'Responsive utilities',
                    'JavaScript plugins Bootstrap'
                ],
            },
            'mysql': {
                name: 'MySQL',
                category: 'Base de données',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                level: 75,
                description: 'Système de gestion de base de données relationnelle. Maîtrise de SQL pour créer, manipuler et optimiser des bases de données.',
                learned: [
                    'Requêtes SQL (SELECT, INSERT, UPDATE, DELETE)',
                    'Jointures (INNER, LEFT, RIGHT)',
                    'Sous-requêtes et vues',
                    'Création de tables et contraintes (clés primaires/étrangères)',
                    'Indexation et optimisation',
                    'Triggers et procédures stockées',
                    'Normalisation de bases de données'
                ],
            },
            'git': {
                name: 'Git',
                category: 'Outil de versioning',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                level: 72,
                description: 'Système de contrôle de version pour gérer le code source et collaborer efficacement en équipe.',
                learned: [
                    'Commandes de base (add, commit, push, pull)',
                    'Gestion des branches (branch, merge)',
                    'Résolution de conflits',
                    'Git Flow et bonnes pratiques',
                    'Utilisation de .gitignore',
                    'Historique et retours en arrière (reset, revert)',
                    'Collaboration avec GitHub/GitLab'
                ],
            },
            'github': {
                name: 'GitHub',
                category: 'Plateforme de développement',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
                level: 75,
                description: 'Plateforme de collaboration et d\'hébergement de code. Utilisation pour mes projets personnels et collaboratifs.',
                learned: [
                    'Création et gestion de repositories',
                    'Pull requests et code review',
                    'Issues et project management',
                    'GitHub Actions pour CI/CD',
                    'GitHub Pages pour hébergement',
                    'README et documentation',
                    'Gestion des releases et tags'
                ],
            },
            'vscode': {
                name: 'VS Code',
                category: 'Éditeur de code',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                level: 88,
                description: 'Mon éditeur de code principal. Maîtrise des extensions et raccourcis pour un développement efficace.',
                learned: [
                    'Raccourcis clavier pour productivité',
                    'Extensions essentielles (Prettier, ESLint, Live Server)',
                    'Debugging intégré',
                    'Snippets personnalisés',
                    'Terminal intégré',
                    'Multi-curseurs et édition avancée',
                    'Git integration'
                ],
            },
            'linux': {
                name: 'Linux',
                category: 'Système d\'exploitation',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
                level: 68,
                description: 'Système d\'exploitation open source. Utilisation quotidienne d\'Ubuntu pour le développement et l\'administration système.',
                learned: [
                    'Navigation en ligne de commande (bash)',
                    'Gestion des fichiers et permissions',
                    'Installation de packages (apt, snap)',
                    'Configuration de serveurs',
                    'Scripts shell pour automatisation',
                    'Gestion des processus et services',
                    'SSH et connexion à distance'
                ],
            },
            'mongodb': {
                name: 'MongoDB',
                category: 'Base de données NoSQL',
                icon: 'https://cdn.simpleicons.org/mongodb/47A248',
                level: 60,
                description: 'Base de données NoSQL orientée documents. En cours d\'apprentissage pour les applications modernes.',
                learned: [
                    'Concepts de bases NoSQL',
                    'CRUD operations avec MongoDB',
                    'Requêtes et filtres',
                    'Agrégation de données',
                    'Mongoose avec Node.js',
                    'Indexation pour performance'
                ],
            },
            'phpmyadmin': {
            name: 'phpMyAdmin',
            category: 'Outil de gestion de base de données',
            icon: 'https://cdn.simpleicons.org/phpmyadmin/6C78AF',
            level: 80,
            description: 'Interface web pour administrer facilement les bases de données MySQL. Outil essentiel pour la gestion de bases de données dans mes projets web.',
            learned: [
                'Gestion complète de bases de données MySQL',
                'Création et modification de tables',
                'Import/Export de données (SQL, CSV)',
                'Exécution de requêtes SQL complexes',
                'Gestion des utilisateurs et permissions',
                'Optimisation de tables et index',
                'Sauvegarde et restauration de bases'
            ],
            },

            'powerdesigner': {
    name: 'PowerDesigner',
    category: 'Outil de modélisation',
    icon: 'https://cdn.simpleicons.org/sap/0FAAFF',
    level: 72,
    description: 'Outil professionnel de SAP pour la modélisation de bases de données et la conception de systèmes d\'information. Utilisé dans le cadre du BTS SIO pour créer des MCD, MLD et MPD normalisés.',
    learned: [
        'Création de Modèles Conceptuels de Données (MCD)',
        'Transformation MCD vers MLD (Modèle Logique)',
        'Génération automatique de MPD (Modèle Physique)',
        'Normalisation de bases de données (1NF, 2NF, 3NF)',
        'Définition des cardinalités et dépendances',
        'Génération de scripts SQL pour différents SGBD',
        'Reverse engineering de bases existantes',
        'Diagrammes UML (classes, cas d\'utilisation)',
        'Documentation automatique de projets',
        'Export de diagrammes en PDF/image'
    ],
    projects: []
    },

            'codeblocks': {
            name: 'Code::Blocks',
            category: 'IDE pour C/C++',
            icon: 'assets/images/icons/codeblocks.png',
            level: 70,
            description: 'Environnement de développement intégré utilisé en Licence 1 pour apprendre la programmation en C. Premier contact avec un IDE.',
            learned: [
                'Compilation et exécution de programmes C',
                'Débogage avec points d\'arrêt',
                'Gestion de projets multi-fichiers',
                'Configuration du compilateur GCC',
                'Détection d\'erreurs de syntaxe',
                'Organisation du code en projets'
            ],
            },
        
            'postman': {
            name: 'Postman',
            category: 'Test d\'API',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
            level: 72,
            description: 'Outil de test et documentation d\'API REST. Indispensable pour le développement et le débogage d\'API.',
            learned: [
                'Envoi de requêtes HTTP (GET, POST, PUT, DELETE)',
                'Tests de réponses et assertions',
                'Gestion des variables d\'environnement',
                'Authentification (Bearer Token, API Key)',
                'Collections et organisation des requêtes',
                'Documentation automatique d\'API',
                'Tests automatisés avec scripts'
            ],
            },
        
            'eclipse': {
            name: 'Eclipse',
            category: 'IDE Java',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-plain.svg',
            level: 68,
            description: 'IDE utilisé pour le développement Java dans le cadre du BTS SIO. Maîtrise des fonctionnalités essentielles pour la POO.',
            learned: [
                'Création de projets Java',
                'Débogage avancé avec Eclipse',
                'Refactoring automatique',
                'Gestion des packages',
                'Génération de getters/setters',
                'Tests unitaires avec JUnit',
                'Auto-complétion et raccourcis'
            ],
            },
            
            'intellij': {
    name: 'IntelliJ IDEA',
    category: 'IDE',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg',
    level: 70,
    description: 'IDE professionnel de JetBrains pour le développement Java, Kotlin et autres langages JVM. Puissant avec des fonctionnalités avancées de refactoring et debugging.',
    learned: [
        'Développement Java avec IntelliJ',
        'Refactoring automatique intelligent',
        'Débogage avancé avec breakpoints',
        'Intégration Git native',
        'Gestion de projets Maven/Gradle',
        'Auto-complétion intelligente',
        'Raccourcis clavier pour productivité',
        'Plugins et personnalisation',
        'Tests unitaires avec JUnit',
        'Analyse de code et suggestions'
    ],
    projects: ['Projets Java', 'Applications JVM']
},

        'virtualbox': {
            name: 'VirtualBox',
            category: 'Virtualisation',
            icon: 'https://cdn.simpleicons.org/virtualbox/183A61',
            level: 75,
            description: 'Logiciel de virtualisation pour créer et gérer des machines virtuelles. Utilisé pour tester différents systèmes et environnements.',
            learned: [
                'Création de machines virtuelles',
                'Configuration réseau (NAT, Bridge)',
                'Installation de systèmes d\'exploitation',
                'Snapshots et restauration',
                'Partage de fichiers hôte/invité',
                'Gestion de disques virtuels',
                'Optimisation des performances VM'
            ],
            },
        
        'jira': {
            name: 'Jira',
            category: 'Gestion de projet',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
            level: 65,
            description: 'Outil de gestion de projets agile utilisé en entreprise. Découvert lors de mon stage pour suivre l\'avancement des tâches.',
            learned: [
                'Création et suivi de tickets',
                'Utilisation de tableaux Kanban/Scrum',
                'Gestion des sprints',
                'Attribution et priorisation des tâches',
                'Workflows et statuts',
                'Rapports et statistiques',
                'Collaboration en équipe'
            ],
            },
        
        'ubuntu': {
            name: 'Ubuntu',
            category: 'Distribution Linux',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg',
            level: 70,
            description: 'Distribution Linux que j\'utilise pour le développement. Système stable et parfait pour l\'apprentissage de Linux.',
            learned: [
                'Installation et configuration d\'Ubuntu',
                'Ligne de commande Bash',
                'Gestion des paquets avec apt',
                'Configuration de serveurs web (Apache, Nginx)',
                'Scripts shell d\'automatisation',
                'Gestion des permissions fichiers',
                'Configuration réseau et SSH'
            ],
            },
        
        'windows': {
            name: 'Windows',
            category: 'Système d\'exploitation',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg',
            level: 85,
            description: 'Système d\'exploitation que j\'utilise depuis toujours. Maîtrise complète pour le développement et l\'administration.',
            learned: [
                'Navigation et gestion de fichiers',
                'Invite de commandes et PowerShell',
                'Installation et configuration logiciels',
                'Gestion du Registre Windows',
                'Configuration réseau',
                'Résolution de problèmes système',
                'Optimisation des performances'
            ],
            },
        
        'shell': {
            name: 'Shell',
            category: 'Scripting système',
            icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
            level: 68,
            description: 'Langage de script pour automatiser des tâches système sous Linux. Utilisé pour créer des scripts d\'administration.',
            learned: [
                'Syntaxe Bash et commandes Unix',
                'Variables et conditions',
                'Boucles (for, while)',
                'Manipulation de fichiers et texte',
                'Pipes et redirections',
                'Fonctions et scripts modulaires',
                'Automatisation de tâches répétitives'
            ],
            },
        
        'uml': {
            name: 'UML',
            category: 'Modélisation',
            icon: 'assets/images/icons/UML.jpg',
            level: 73,
            description: 'Langage de modélisation unifié pour concevoir des applications. Essentiel pour la phase de conception de projets.',
            learned: [
                'Diagrammes de cas d\'utilisation',
                'Diagrammes de classes',
                'Diagrammes de séquence',
                'Diagrammes d\'activités',
                'MCD/MLD pour bases de données',
                'Analyse des besoins fonctionnels',
                'Documentation de projets'
            ],
            },

        'latex': {
            name: 'LaTeX',
            category: 'Rédaction de documents',
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg",
            level: 60,
            description: 'Système de composition de documents pour créer des rapports professionnels. Utilisé pour la documentation technique.',
            learned: [
                'Syntaxe de base LaTeX',
                'Structuration de documents',
                'Insertion d\'images et tableaux',
                'Gestion de bibliographies',
                'Formules mathématiques',
                'Templates professionnels',
                'Export PDF de qualité'
            ],
            },


'chatgpt': {
    name: 'ChatGPT',
    category: 'Intelligence Artificielle',
    icon: 'https://cdn.simpleicons.org/openai/412991',
    level: 85,
    description: 'Assistant IA d\'OpenAI que j\'utilise quotidiennement pour la génération de code, le debugging, l\'explication de concepts complexes et la rédaction de documentation.',
    learned: [
        'Prompt engineering pour obtenir des réponses précises',
        'Génération et optimisation de code',
        'Débogage et résolution d\'erreurs',
        'Explication de concepts techniques',
        'Rédaction de documentation',
        'Brainstorming d\'architecture logicielle',
        'Apprentissage de nouvelles technologies'
    ],
},

'github-copilot': {
    name: 'GitHub Copilot',
    category: 'Intelligence Artificielle',
    icon: 'https://cdn.simpleicons.org/githubcopilot/000000',
    level: 78,
    description: 'Assistant de code IA intégré à VS Code. Accélère considérablement mon développement avec des suggestions contextuelles intelligentes.',
    learned: [
        'Auto-complétion de code intelligente',
        'Génération de fonctions complètes',
        'Suggestions de tests unitaires',
        'Refactoring de code',
        'Commentaires et documentation automatiques',
        'Conversion de code entre langages',
        'Productivité accrue en développement'
    ],
},

'claude': {
    name: 'Claude AI',
    category: 'Intelligence Artificielle',
    icon: 'https://cdn.simpleicons.org/anthropic/191919',
    level: 80,
    description: 'IA d\'Anthropic spécialisée dans les tâches complexes et l\'analyse de code. Excellente pour la revue de code et l\'architecture.',
    learned: [
        'Analyse approfondie de code',
        'Revue de code et suggestions d\'amélioration',
        'Architecture logicielle',
        'Raisonnement sur des problèmes complexes',
        'Manipulation de gros fichiers de code',
        'Documentation technique détaillée',
        'Respect des bonnes pratiques'
    ],
},

'gemini': {
    name: 'Google Gemini',
    category: 'Intelligence Artificielle',
    icon: 'https://cdn.simpleicons.org/googlegemini/4285F4',
    level: 72,
    description: 'IA multimodale de Google pour la recherche, génération de code et analyse de données. Intégration avec l\'écosystème Google.',
    learned: [
        'Recherche et veille technologique',
        'Génération de code Python et JavaScript',
        'Analyse de données et statistiques',
        'Multimodalité (texte, images, code)',
        'Intégration avec Google Workspace',
        'Brainstorming créatif',
        'Résumés de documentation technique'
    ],
},

'pandas': {
    name: 'Pandas',
    category: 'Bibliothèque Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
    level: 65,
    description: 'Bibliothèque Python pour la manipulation et l\'analyse de données. Outil essentiel pour le traitement de datasets et la préparation de données pour le machine learning.',
    learned: [
        'DataFrames et Series',
        'Nettoyage et transformation de données',
        'Fusion et jointure de datasets',
        'Groupement et agrégation',
        'Gestion des données manquantes',
        'Import/Export (CSV, Excel, SQL)',
        'Analyse statistique de base'
    ]
},

'numpy': {
    name: 'NumPy',
    category: 'Bibliothèque Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
    level: 68,
    description: 'Bibliothèque fondamentale pour le calcul scientifique en Python. Manipulation efficace de tableaux multidimensionnels et opérations mathématiques avancées.',
    learned: [
        'Arrays et matrices multidimensionnelles',
        'Opérations vectorisées',
        'Broadcasting',
        'Algèbre linéaire',
        'Statistiques et probabilités',
        'Génération de nombres aléatoires',
        'Optimisation de performance'
    ]
},

'scikit-learn': {
    name: 'scikit-learn',
    category: 'Framework Machine Learning',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
    level: 55,
    description: 'Bibliothèque Python de référence pour le machine learning. Algorithmes classiques de classification, régression et clustering.',
    learned: [
        'Algorithmes de classification',
        'Régression linéaire et logistique',
        'Clustering (K-means, DBSCAN)',
        'Prétraitement de données',
        'Feature engineering',
        'Validation croisée',
        'Évaluation de modèles'
    ]
},

'tensorflow': {
    name: 'TensorFlow',
    category: 'Framework Deep Learning',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    level: 50,
    description: 'Framework de deep learning développé par Google. Création et entraînement de réseaux de neurones pour des tâches complexes.',
    learned: [
        'Notions de base de TensorFlow',
        'Création de modèles séquentiels',
        'Réseaux de neurones profonds',
        'Optimiseurs et fonctions de perte',
        'TensorBoard pour visualisation',
        'Sauvegarde et chargement de modèles',
        'Transfer learning (concepts)'
    ]
},

'pytorch': {
    name: 'PyTorch',
    category: 'Framework Deep Learning',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
    level: 48,
    description: 'Framework de deep learning développé par Meta/Facebook. Alternative moderne à TensorFlow avec approche plus pythonique.',
    learned: [
        'Tenseurs PyTorch',
        'Autograd et backpropagation',
        'Construction de modèles avec nn.Module',
        'DataLoaders et Datasets',
        'Entraînement de réseaux de neurones',
        'GPU acceleration (CUDA)',
        'Debugging de modèles'
    ]
},

'jupyter': {
    name: 'Jupyter',
    category: 'Environnement de développement',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
    level: 72,
    description: 'Environnement interactif pour la data science et le machine learning. Notebooks combinant code, visualisations et documentation.',
    learned: [
        'Création et gestion de notebooks',
        'Cellules code et markdown',
        'Visualisations inline',
        'Magic commands',
        'Partage de notebooks',
        'Extensions Jupyter',
        'JupyterLab vs Jupyter Notebook'
    ]
},

'nlp': {
    name: 'NLP',
    category: 'Traitement du langage naturel',
    icon: 'https://cdn.simpleicons.org/spacy/09A3D5',
    level: 52,
    description: 'Natural Language Processing - Traitement automatique du langage naturel. Analyse, compréhension et génération de texte.',
    learned: [
        'Tokenisation et preprocessing',
        'Bag of Words et TF-IDF',
        'Word embeddings (Word2Vec)',
        'Analyse de sentiment',
        'Named Entity Recognition (NER)',
        'Librairies : NLTK, spaCy',
        'Concepts de base des transformers'
    ]
},

'data-analysis': {
    name: 'Analyse de données',
    category: 'Data Science',
    icon: 'https://cdn.simpleicons.org/plotly/3F4F75',
    level: 63,
    description: 'Compétences en exploration, visualisation et interprétation de données. Extraction d\'insights et prise de décision basée sur les données.',
    learned: [
        'Analyse exploratoire de données (EDA)',
        'Visualisation avec Matplotlib/Seaborn',
        'Statistiques descriptives',
        'Corrélations et relations',
        'Détection d\'outliers',
        'Dashboards interactifs',
        'Storytelling avec les données'
    ]
},


            'wordpress': {
                name: 'WordPress',
                category: 'CMS',
                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
                level: 45,
                description: 'CMS populaire pour créer des sites web. En cours d\'apprentissage pour la création de sites vitrine.',
                learned: [
                    'Installation et configuration',
                    'Gestion de thèmes',
                    'Plugins essentiels',
                    'Personnalisation basique',
                    'SEO avec WordPress',
                    'Sécurité de base'
                ],
            }

            

            
        };
    }
}

// ==========================================
// SMOOTH SCROLL POUR LES LIENS
// ==========================================
function initSmoothScroll() {
    Utils.$$('a[href^="#"]').forEach(anchor => {
        // Éviter de dupliquer avec Navigation
        if (anchor.classList.contains('nav-link')) return;
        
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.length <= 1) {
                return;
            }
            
            const target = Utils.$(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// IMAGES PAR DÉFAUT (SI MANQUANTES)
// ==========================================
function handleMissingImages() {
    Utils.$$('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23999"%3EImage non disponible%3C/text%3E%3C/svg%3E';
        });
    });
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
            }, 0);
        });
    }
}
// ==========================================
// FILTRAGE DES PROJETS
// ==========================================
class ProjectFilter {
    constructor() {
        this.filterBtns = Utils.$$('.filter-btn');
        this.projectCards = Utils.$$('.project-card');
        this.projectsGrid = Utils.$('#projectsGrid');
        this.projectCount = Utils.$('#projectCount');
        this.noProjects = Utils.$('#noProjects');
        
        this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.currentTarget);
            });
        });
        
        // Compte initial
        this.updateCount('all');
    }

    handleFilter(btn) {
        const filter = btn.getAttribute('data-filter');
        
        // Mettre à jour les boutons actifs
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrer les projets
        this.filterProjects(filter);
        
        // Mettre à jour le compteur
        this.updateCount(filter);
    }

    filterProjects(filter) {
        let visibleCount = 0;
        
        this.projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hide');
                card.classList.add('show');
                
                // Animation décalée
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 100);
                
                visibleCount++;
            } else {
                card.classList.add('hide');
                card.classList.remove('show');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
            }
        });
        
        // Afficher message si aucun projet
        if (visibleCount === 0) {
            this.noProjects.style.display = 'block';
        } else {
            this.noProjects.style.display = 'none';
        }
    }

    updateCount(filter) {
        let count = 0;
        
        if (filter === 'all') {
            count = this.projectCards.length;
        } else {
            this.projectCards.forEach(card => {
                if (card.getAttribute('data-category') === filter) {
                    count++;
                }
            });
        }
        
        this.projectCount.textContent = count;
    }
}
// ==========================================
// FILTRAGE DES COMPÉTENCES
// ==========================================
class SkillsFilter {
    constructor() {
        this.filterBtns = Utils.$$('.skill-filter-btn');
        this.skillSections = Utils.$$('.skill-section');
        this.skillsCount = Utils.$('#skillsCount');
        
        this.init();
    }

    init() {
        // Initialiser toutes les sections comme visibles
        this.skillSections.forEach(section => {
            section.classList.add('show');
        });
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.currentTarget);
            });
        });
        
        // Compte initial
        this.updateCount('all');
    }

    handleFilter(btn) {
        const filter = btn.getAttribute('data-skill-filter');
        
        // Mettre à jour les boutons actifs
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filtrer les compétences
        this.filterSkills(filter);
        
        // Mettre à jour le compteur
        this.updateCount(filter);
    }

    filterSkills(filter) {
        let delay = 0;
        
        this.skillSections.forEach((section) => {
            const category = section.getAttribute('data-skill-category');
            
            if (filter === 'all' || category === filter) {
                // Afficher la section
                section.classList.remove('hide');
                
                setTimeout(() => {
                    section.classList.add('show');
                }, delay);
                
                delay += 100;
            } else {
                // Masquer la section
                section.classList.remove('show');
                section.classList.add('hide');
            }
        });
    }

    updateCount(filter) {
        let totalSkills = 0;
        
        this.skillSections.forEach(section => {
            const category = section.getAttribute('data-skill-category');
            
            if (filter === 'all' || category === filter) {
                const skillItems = Utils.$$('.skill-icon-item', section);
                totalSkills += skillItems.length;
            }
        });
        
        this.skillsCount.textContent = totalSkills;
    }
}


// ==========================================
// INITIALISATION PRINCIPALE
// ==========================================
function init() {
    console.log('🚀 Initialisation du portfolio...');

    // Initialiser tous les composants
    new Navigation();
    new ScrollAnimations();
    new SkillsAnimation();
    new SkillsFilter();
    new ProjectModal();
    new ContactForm();
    new VeilleManager();
    new ProjectFilter();
    new ScrollToTop();
    new SkillModal(); // ✅ AJOUT DE LA MODAL COMPÉTENCES 

    // Effet de frappe
    const typingElement = Utils.$('#typed-text');
    if (typingElement) {
        new TypingEffect(typingElement, CONFIG.typingTexts);
    }

    // Autres initialisations
    initSmoothScroll();
    handleMissingImages();
    monitorPerformance();

    console.log('✅ Portfolio initialisé avec succès !');
}

// ==========================================
// DÉMARRAGE
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
