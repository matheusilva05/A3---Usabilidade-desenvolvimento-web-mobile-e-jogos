// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const foxCharacter = document.querySelector('.fox-character');
const loginBox = document.querySelector('.login-box');
const pupils = document.querySelectorAll('.pupil');

// Movimento dos olhos da raposa seguindo o cursor
document.addEventListener('mousemove', (e) => {
    if (!foxCharacter) return;
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
if (emailInput) {
    emailInput.addEventListener('input', () => {
        foxCharacter.style.transform = 'scale(1.05)';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            foxCharacter.style.transform = 'scale(1)';
        }, 200);
    });
}

if (passwordInput) {
    passwordInput.addEventListener('input', () => {
        foxCharacter.style.transform = 'scale(1.05)';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            foxCharacter.style.transform = 'scale(1)';
        }, 200);
    });

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
}


// ==========================================================
// FUNÇÃO DE LOGIN REAL (CHAMA A API)
// ==========================================================
async function loginReal(email, password) {
    const btnLogin = document.querySelector('.btn-login');
    const originalText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<span>Entrando...</span>';
    btnLogin.disabled = true;

    const dadosLogin = {
        email: email,
        password: password
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            showSuccess(resultado.message || 'Login realizado com sucesso!');

            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('email', email);
            }
            
            // ATENÇÃO: Não vamos mais usar o localStorage para o ID
            // localStorage.setItem('playerId', resultado.playerId);

            // ==========================================================
            // MUDANÇA PRINCIPAL: Redirecionar para o jogo na Vercel
            // ==========================================================
            setTimeout(() => {
                console.log('Redirecionando para o jogo com ID:', resultado.playerId);
                
                // Nós passamos o ID do jogador como um "parâmetro de query" na URL
                window.location.href = `https://jogo-web-pc.vercel.app/?playerId=${resultado.playerId}`;
                
            }, 2000);

        } else {
            showError(resultado.error);
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }

    } catch (erro) {
        console.error('Erro de conexão:', erro);
        showError('Não foi possível conectar ao servidor. O backend está rodando?');
        btnLogin.innerHTML = originalText;
        btnLogin.disabled = false;
    }
}

// ==========================================================
// VALIDAÇÃO E ENVIO DO FORMULÁRIO
// ==========================================================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email.includes('@')) {
            showError('Por favor, insira um email válido');
            return;
        }

        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        loginReal(email, password);
    });
}

// Função para mostrar erro
function showError(message) {
    if (!loginBox) return;
    loginBox.classList.add('error');
    
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #ff4444; color: white; padding: 12px; border-radius: 8px;
        margin-top: 15px; text-align: center; font-size: 14px; animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    loginForm.appendChild(errorDiv);

    setTimeout(() => {
        loginBox.classList.remove('error');
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Função para mostrar sucesso
function showSuccess(message) {
    if (!foxCharacter) return;
    foxCharacter.classList.add('success');
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #44ff44; color: #1a3409; padding: 12px; border-radius: 8px;
        margin-top: 15px; text-align: center; font-size: 14px; font-weight: bold;
        animation: slideDown 0.3s ease;
    `;
    successDiv.textContent = message;
    loginForm.appendChild(successDiv);
}

// Animações CSS adicionais
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
    @keyframes errorShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
    .login-box.error { animation: errorShake 0.5s ease-in-out; }
    @keyframes successShake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
    .fox-character.success { animation: successShake 0.5s ease-in-out; }
`;
document.head.appendChild(style);

// Carregar preferências salvas
window.addEventListener('load', () => {
    if (localStorage.getItem('rememberMe') === 'true' && emailInput) {
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            emailInput.value = savedEmail;
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
if(forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de recuperação de senha será implementada em breve! 🦊');
    });
}

// Link "Registre-se agora" 
const registerLink = document.querySelector('.register-link a');
if(registerLink && !registerLink.href.includes('register.html')) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'register.html';
    });
}

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
if (foxCharacter) {
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
}

console.log('🦊 Fox Adventure Login - Sistema carregado com sucesso!');