// Elemntos do DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email'); // CORRIGIDO
const passwordInput = document.getElementById('password'); // CORRIGIDO
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
if (emailInput) { // Adicionada verificação
    emailInput.addEventListener('input', () => {
        foxCharacter.style.transform = 'scale(1.05)';
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            foxCharacter.style.transform = 'scale(1)';
        }, 200);
    });
}

if (passwordInput) { // Adicionada verificação
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
}


// ==========================================================
// FUNÇÃO DE LOGIN REAL (CHAMA A API)
// ==========================================================
async function loginReal(email, password) {
    // Adiciona classe de carregamento
    const btnLogin = document.querySelector('.btn-login');
    const originalText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<span>Entrando...</span>';
    btnLogin.disabled = true;

    // 1. Monta o JSON que a API espera
    const dadosLogin = {
        email: email,
        password: password
    };

    try {
        // 2. Chama a API Spring Boot (que está em http://localhost:8080/api/login)
        const resposta = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
        });

        // 3. Pega a resposta da API (seja sucesso ou erro)
        const resultado = await resposta.json();

        if (resposta.ok) { // Se a API retornou 200 OK
            showSuccess(resultado.message || 'Login realizado com sucesso!'); // Mostra a mensagem de sucesso da API

            // Salvar preferência "Lembrar-me"
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('email', email); // Salva o email
            }
            
            // ** IMPORTANTE: Salva o ID do jogador **
            // Você VAI PRECISAR disso no jogo (Unity) para salvar a pontuação
            localStorage.setItem('playerId', resultado.playerId);

            // Redirecionar após 2 segundos
            setTimeout(() => {
                console.log('Redirecionando para o jogo...');
                // Redireciona para a URL do jogo
                window.location.href = 'https://jogo-web-pc.vercel.app/'; // <<< ESSA É A LINHA QUE MUDAMOS!
            }, 2000);

        } else { // Se a API retornou um erro (401, 404, etc)
            showError(resultado.error); // Mostra a mensagem de erro da API
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }

    } catch (erro) {
        // Isso acontece se a API (Spring Boot) estiver offline
        console.error('Erro de conexão:', erro);
        showError('Não foi possível conectar ao servidor. O backend está rodando?');
        btnLogin.innerHTML = originalText;
        btnLogin.disabled = false;
    }
}

// ==========================================================
// VALIDAÇÃO E ENVIO DO FORMULÁRIO (CORRIGIDO)
// ==========================================================
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validações básicas
        if (!email.includes('@')) {
            showError('Por favor, insira um email válido');
            return;
        }

        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Chama a função de login REAL
        loginReal(email, password);
    });
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
  Dê um nome para a sua animação, como **`Plataforma_Sobe_Desce`**, e salve-a dentro da sua pasta `Assets/Animation`.   errorDiv.style.cssText = `
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
function showSuccess(message) { // Aceita uma mensagem
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
    successDiv.textContent = message; // Usa a mensagem
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
section
        }
    }
    @keyframes errorShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
    .login-box.error { animation: errorShake 0.5s ease-in-out; }
    
    @keyframes successShake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
    .fox-character.success { animation: successShake 0.5s ease-in-out; }
`;
document.head.appendChild(style);

// Carregar preferências salvas
window.addEventListener('load', () => {
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('email'); // CORRIGIDO
        if (savedEmail) {
            emailInput.value = savedEmail; // CORRIGIDO
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
if(registerLink && registerLink.href.includes('#')) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Redirecionando para o registro...');
section
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
x
            alert('🦊 Você encontrou a raposa mágica! Ela te deseja boa sorte na aventura!');
            clickCount = 0;
            
            // Efeito especial
section
            particles.forEach(particle => {
                particle.style.animation = 'none';
                setTimeout(() => {
                    particle.style.animation = 'float 6s infinite ease-in-out';
A Unity vai "forçar" a janela a parar de mostrar o editor de assets e, em vez disso, mostrar a página de configurações do pacote. Nela, você encontrará o dropdown **`Update Mode`**.             }, 10);
            });
        }
    });
}

console.log('🦊 Fox Adventure Login - Sistema carregado com sucesso!');
