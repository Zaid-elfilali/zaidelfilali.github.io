/**
 * Fichier : main.js
 * Description : Fonctionnalités principales du portfolio
 * Auteur : Zaid EL FILALI
 * Date : 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des fonctionnalités
    initNavigation();
    initBackToTop();
    initSmoothScrolling();
    initActiveSection();
    initContactForm();
    
    console.log('Portfolio Zaid EL FILALI - Chargé avec succès');
});

/**
 * Initialise la navigation sticky et les liens actifs
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navHeight = nav.offsetHeight;
    
    // Navigation sticky
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.backgroundColor = 'white';
            nav.style.backdropFilter = 'none';
        }
    });
}

/**
 * Initialise le bouton "Retour en haut"
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialise le défilement fluide pour les liens d'ancrage
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL sans recharger la page
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Met à jour la section active dans la navigation
 */
function initActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Initialise le formulaire de contact
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(this);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Validation basique
            if (validateForm(formDataObj)) {
                // Simulation d'envoi (à remplacer par l'appel PHP)
                showFormMessage('Message envoyé avec succès!', 'success');
                this.reset();
                
                // En production, décommentez cette ligne :
                // submitFormToPHP(formDataObj);
            }
        });
    }
}

/**
 * Valide les données du formulaire
 */
function validateForm(data) {
    const { name, email, subject, message } = data;
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        showFormMessage('Veuillez remplir tous les champs.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showFormMessage('Veuillez entrer une adresse email valide.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Vérifie si l'email est valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affiche un message de statut du formulaire
 */
function showFormMessage(message, type) {
    // Supprimer les messages existants
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
        text-align: center;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

/**
 * Envoie les données du formulaire au serveur PHP
 * (À utiliser en production)
 */
function submitFormToPHP(formData) {
    fetch('php/contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showFormMessage('Message envoyé avec succès!', 'success');
        } else {
            showFormMessage('Erreur lors de l\'envoi du message.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFormMessage('Erreur de connexion.', 'error');
    });
}

/**
 * Fonction utilitaire pour formater les dates
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

/**
 * Fonction pour le chargement paresseux des images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialiser le chargement paresseux
initLazyLoading();