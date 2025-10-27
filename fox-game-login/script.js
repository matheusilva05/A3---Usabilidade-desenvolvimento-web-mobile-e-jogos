// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const foxCharacter = document.querySelector('.fox-character');
const loginBox = document.querySelector('.login-box');
const pupils = document.querySelectorAll('.pupil');

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

// Animação da raposa quando o usuário está digitando
let typingTimeout;
usernameInput.addEventListener('input', () => {
    foxCharacter.style.transform = 'scale(1.05)';
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        foxCharacter.style.transform = 'scale(1)';
    }, 200);
});

passwordInput.addEventListener('input', () => {
    foxCharacter.style.transform = 'scale(1.05)';
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        foxCharacter.style.transform = 'scale(1)';
    }, 200);
});

// Raposa "cobre os olhos" quando o campo de senha está em foco
passwordInput.addEventListener('focus', () => {
    document.querySelectorAll('.eye').forEach(eye => {
        eye.style.transform = 'scaleY(0.1)';
    });
});

passwordInput.addEventListener('blur', () => {
    document.querySelectorAll('.eye').forEach(eye => {
        eye.style.transform = 'scaleY(1)';
    });
});

// Validação do formulário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validações básicas
    if (username.length < 3) {
        showError('O nome de usuário deve ter pelo menos 3 caracteres');
        return;
    }

    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    // Simulação de login (aqui você conectaria com seu backend)
    simulateLogin(username, password);
});

// Função para simular login
function simulateLogin(username, password) {
    // Adiciona classe de carregamento
    const btnLogin = document.querySelector('.btn-login');
    const originalText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<span>Entrando...</span>';
    btnLogin.disabled = true;

    // Simula requisição ao servidor
    setTimeout(() => {
        // Simula login bem-sucedido
        // Em produção, você verificaria as credenciais no servidor
        if (username && password) {
            showSuccess();
            
            // Salvar preferência "Lembrar-me"
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('username', username);
            }

            // Redirecionar após 2 segundos
            setTimeout(() => {
                // Aqui você redirecionaria para o jogo
                console.log('Redirecionando para o jogo...');
                alert(`Bem-vindo ao Fox Adventure, ${username}! 🦊`);
                // window.location.href = '/game.html';
            }, 2000);
        } else {
            showError('Credenciais inválidas');
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }
    }, 1500);
}

// Função para mostrar erro
function showError(message) {
    loginBox.classList.add('error');
    
    // Cria elemento de mensagem de erro
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ff4444;
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        font-size: 14px;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    loginForm.appendChild(errorDiv);

    // Remove a animação e a mensagem após 3 segundos
    setTimeout(() => {
        loginBox.classList.remove('error');
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Função para mostrar sucesso
function showSuccess() {
    foxCharacter.classList.add('success');
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #44ff44;
        color: #1a3409;
        padding: 12px;
        border-radius: 8px;
        margin-top: 15px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = '✓ Login realizado com sucesso!';
    loginForm.appendChild(successDiv);
}

// Animações CSS adicionais
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Carregar preferências salvas
window.addEventListener('load', () => {
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameInput.value = savedUsername;
            rememberMeCheckbox.checked = true;
        }
    }
});

// Botões de login social (simulação)
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = btn.classList.contains('google') ? 'Google' : 'Discord';
        alert(`Login com ${platform} será implementado em breve! 🦊`);
    });
});

// Link "Esqueceu a senha?"
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha será implementada em breve! 🦊');
});

// Link "Registre-se agora"
const registerLink = document.querySelector('.register-link a');
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Página de registro será implementada em breve! 🦊');
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

console.log('🦊 Fox Adventure Login - Sistema carregado com sucesso!');
console.log('Desenvolvido com HTML, CSS e JavaScript puro');

