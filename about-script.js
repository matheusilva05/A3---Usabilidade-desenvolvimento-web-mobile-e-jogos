// Elementos do DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const foxCharacterLarge = document.querySelector('.fox-character-large');
const pupilsLarge = document.querySelectorAll('.pupil-large');
const navLinks = document.querySelectorAll('.nav-menu a');

// Toggle menu mobile
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animação do hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Movimento dos olhos da raposa seguindo o cursor
document.addEventListener('mousemove', (e) => {
    if (!foxCharacterLarge) return;
    
    const foxRect = foxCharacterLarge.getBoundingClientRect();
    const foxCenterX = foxRect.left + foxRect.width / 2;
    const foxCenterY = foxRect.top + foxRect.height / 2;

    const angle = Math.atan2(e.clientY - foxCenterY, e.clientX - foxCenterX);
    const distance = Math.min(4, Math.hypot(e.clientX - foxCenterX, e.clientY - foxCenterY) / 150);

    pupilsLarge.forEach(pupil => {
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
});

// Smooth scroll para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar transparente no topo
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Esconder/mostrar navbar ao rolar
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    // Adicionar sombra ao navbar ao rolar
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// Animação de fade-in ao rolar
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Adicionar classe fade-in aos elementos
const animateElements = document.querySelectorAll('.content-card, .feature-card, .character-card, .gallery-item');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Efeito parallax suave no fundo
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const stars = document.querySelector('.stars');
    const forestLayer = document.querySelector('.forest-layer');
    
    if (stars) {
        stars.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    if (forestLayer) {
        forestLayer.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Interação com cards de personagens
const characterCards = document.querySelectorAll('.character-card');
characterCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const avatar = card.querySelector('.character-avatar');
        avatar.style.transform = 'scale(1.1) rotate(5deg)';
        avatar.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
        const avatar = card.querySelector('.character-avatar');
        avatar.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Efeito de hover nas imagens da galeria
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Simula abertura de modal (pode ser expandido)
        const overlay = item.querySelector('.gallery-overlay p');
        const locationName = overlay.textContent;
        
        // Efeito de pulso
        item.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            item.style.animation = 'none';
        }, 500);

        console.log(`Galeria: ${locationName} clicada`);
    });
});

// Animação de pulso
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Easter egg: clique múltiplo na raposa
let foxClickCount = 0;
let foxClickTimer;

if (foxCharacterLarge) {
    foxCharacterLarge.addEventListener('click', () => {
        foxClickCount++;
        
        // Reset após 2 segundos sem cliques
        clearTimeout(foxClickTimer);
        foxClickTimer = setTimeout(() => {
            foxClickCount = 0;
        }, 2000);

        // Efeito visual no clique
        foxCharacterLarge.style.transform = 'scale(1.1)';
        setTimeout(() => {
            foxCharacterLarge.style.transform = 'scale(1)';
        }, 200);

        // Easter egg após 7 cliques
        if (foxClickCount === 7) {
            activateEasterEgg();
            foxClickCount = 0;
        }
    });
}

// Função do Easter Egg
function activateEasterEgg() {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
        color: white;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        animation: slideDown 0.5s ease;
    `;
    message.textContent = '🦊 Você encontrou o segredo da raposa! 🦊';

    const subMessage = document.createElement('div');
    subMessage.style.cssText = `
        color: #FF8C42;
        font-size: 18px;
        text-align: center;
        margin-bottom: 30px;
    `;
    subMessage.textContent = 'Ember te concede o poder do fogo ancestral!';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Continuar Aventura';
    closeBtn.style.cssText = `
        background: linear-gradient(135deg, #FF6B35, #FF8C42);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 500);
    });

    overlay.appendChild(message);
    overlay.appendChild(subMessage);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // Efeito especial nas partículas
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.background = 'rgba(255, 107, 53, 0.8)';
        particle.style.boxShadow = '0 0 20px rgba(255, 107, 53, 1)';
        particle.style.width = '10px';
        particle.style.height = '10px';
    });

    setTimeout(() => {
        particles.forEach(particle => {
            particle.style.background = 'rgba(255, 200, 100, 0.6)';
            particle.style.boxShadow = '0 0 10px rgba(255, 200, 100, 0.8)';
            particle.style.width = '6px';
            particle.style.height = '6px';
        });
    }, 3000);
}

// Adicionar animações CSS para o Easter Egg
const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(easterEggStyle);

// Contador de visitantes (simulado - localStorage)
if (!localStorage.getItem('foxAdventureVisits')) {
    localStorage.setItem('foxAdventureVisits', '1');
    console.log('🦊 Primeira visita! Bem-vindo ao Fox Adventure!');
} else {
    let visits = parseInt(localStorage.getItem('foxAdventureVisits'));
    visits++;
    localStorage.setItem('foxAdventureVisits', visits.toString());
    console.log(`🦊 Visita número ${visits}! Obrigado por voltar!`);
}

// Adicionar transição suave ao navbar
navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

// Efeito de digitação no título hero (opcional)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && window.innerWidth > 768) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Iniciar após um pequeno delay
    setTimeout(typeWriter, 500);
}

// Log de inicialização
console.log('🦊 Fox Adventure - Página Sobre o Jogo carregada com sucesso!');
console.log('🎮 Desenvolvido com HTML, CSS e JavaScript puro');
console.log('✨ Easter egg disponível - tente clicar 7 vezes na raposa!');

// Prevenir scroll horizontal
document.body.style.overflowX = 'hidden';

