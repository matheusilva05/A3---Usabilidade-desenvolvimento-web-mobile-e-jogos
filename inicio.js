// Movimento dos olhos da raposa seguindo o cursor
document.addEventListener('mousemove', (e) => {
    const foxRect = foxCharacter.getBoundingClientRect();
    const foxCenterX = foxRect.left + foxRect.width / 2;
    const foxCenterY = foxRect.top + foxRect.height / 2;

    const angle = Math.atan2(e.clientY - foxCenterY, e.clientX - foxCenterX);
    const distance = Math.min(3, Math.hypot(e.clientX - foxCenterX, e.clientY - foxCenterY) / 100);

    pupils.forEach(pupil => {
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
});


// Efeito de partículas interativas
const particles = document.querySelectorAll('.particle');
particles.forEach((particle, index) => {
    particle.addEventListener('mouseenter', () => {
        particle.style.transform = 'scale(2)';
        particle.style.transition = 'transform 0.3s ease';
    });

    particle.addEventListener('mouseleave', () => {
        particle.style.transform = 'scale(1)';
    });
});


// Easter egg: clique na raposa
let clickCount = 0;
foxCharacter.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount === 1) {
        foxCharacter.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            foxCharacter.style.animation = 'bounce 2s ease-in-out infinite';
        }, 500);
    }
    
    if (clickCount === 5) {
        alert('🦊 Você encontrou a raposa mágica! Ela te deseja boa sorte na aventura!');
        clickCount = 0;
        
        // Efeito especial
        particles.forEach(particle => {
            particle.style.animation = 'none';
            setTimeout(() => {
                particle.style.animation = 'float 6s infinite ease-in-out';
            }, 10);
        });
    }
});