/**
 * Fichier : modal.js
 * Description : Gestion des modales pour les projets
 * Auteur : Zaid EL FILALI
 * Date : 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    initProjectModals();
});

/**
 * Initialise les fonctionnalités des modales de projets
 */
function initProjectModals() {
    // Éléments DOM
    const projectCards = document.querySelectorAll('.project-card');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Ouvrir la modal au clic sur une carte projet
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Empêcher l'ouverture si on clique sur le lien "Voir les détails"
            if (e.target.closest('.project-link')) {
                return;
            }
            
            const projectId = this.getAttribute('data-project');
            openModal(projectId);
        });
        
        // Gestion spécifique du bouton "Voir les détails"
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            projectLink.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectId = card.getAttribute('data-project');
                openModal(projectId);
            });
        }
    });
    
    // Fermer la modal avec le bouton de fermeture
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeCurrentModal();
        });
    });
    
    // Fermer la modal en cliquant à l'extérieur
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCurrentModal();
            }
        });
    });
    
    // Fermer la modal avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCurrentModal();
        }
    });
    
    // Empêcher la propagation des clics dans le contenu de la modal
    modals.forEach(modal => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
}

/**
 * Ouvre une modal de projet spécifique
 */
function openModal(projectId) {
    const modal = document.getElementById(`project-modal-${projectId}`);
    
    if (modal) {
        // Fermer toute modal ouverte
        closeCurrentModal();
        
        // Ouvrir la nouvelle modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
        
        // Animation d'entrée
        animateModalIn(modal);
        
        // Mettre à jour l'URL
        history.pushState(null, null, `#project-${projectId}`);
        
        console.log(`Modal ouverte : Projet ${projectId}`);
    }
}

/**
 * Ferme la modal actuellement ouverte
 */
function closeCurrentModal() {
    const activeModal = document.querySelector('.modal.active');
    
    if (activeModal) {
        // Animation de sortie
        animateModalOut(activeModal);
        
        // Retirer la classe active après l'animation
        setTimeout(() => {
            activeModal.classList.remove('active');
            document.body.style.overflow = ''; // Rétablir le défilement
        }, 300);
        
        // Mettre à jour l'URL
        if (history.state) {
            history.back();
        } else {
            history.replaceState(null, null, ' ');
        }
        
        console.log('Modal fermée');
    }
}

/**
 * Animation d'entrée de la modal
 */
function animateModalIn(modal) {
    const modalContent = modal.querySelector('.modal-content');
    
    // Réinitialiser les transformations
    modalContent.style.transform = 'scale(0.7) translateY(50px)';
    modalContent.style.opacity = '0';
    
    // Appliquer l'animation
    setTimeout(() => {
        modalContent.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        modalContent.style.transform = 'scale(1) translateY(0)';
        modalContent.style.opacity = '1';
    }, 10);
}

/**
 * Animation de sortie de la modal
 */
function animateModalOut(modal) {
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transition = 'all 0.3s ease';
    modalContent.style.transform = 'scale(0.8) translateY(50px)';
    modalContent.style.opacity = '0';
}

/**
 * Fonction pour précharger les images des modales
 */
function preloadModalImages() {
    const modalImages = document.querySelectorAll('.modal-image img');
    
    modalImages.forEach(img => {
        if (img.src && !img.complete) {
            const preloadImage = new Image();
            preloadImage.src = img.src;
        }
    });
}

/**
 * Navigation au clavier dans les modales
 */
function initModalKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const activeModal = document.querySelector('.modal.active');
        
        if (!activeModal) return;
        
        // Tab navigation
        if (e.key === 'Tab') {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Initialiser la navigation au clavier
initModalKeyboardNavigation();

// Précharger les images des modales
window.addEventListener('load', preloadModalImages);

/**
 * Fonction utilitaire pour créer une modal dynamiquement
 * (Peut être utilisée pour ajouter de nouveaux projets)
 */
function createModal(projectData) {
    const {
        id,
        title,
        date,
        image,
        description,
        technologies,
        links
    } = projectData;
    
    const modalHTML = `
        <div class="modal" id="project-modal-${id}">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h2 class="modal-title">${title}</h2>
                        <div class="project-date">
                            <i class="far fa-calendar"></i>
                            ${date}
                        </div>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${image}" alt="${title}" onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\"fas fa-project-diagram\"></i>';">
                    </div>
                    <p class="modal-description">${description}</p>
                    <div class="modal-tech">
                        ${technologies.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="modal-links">
                        ${links.map(link => `
                            <a href="${link.url}" class="modal-link" target="_blank">
                                <i class="${link.icon}"></i>
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter la modal au DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Réinitialiser les écouteurs d'événements
    initProjectModals();
}