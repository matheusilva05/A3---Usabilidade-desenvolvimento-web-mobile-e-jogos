// Espera o HTML carregar
document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBox = document.querySelector('.login-box');
    const btnLogin = document.querySelector('.btn-login');

    // "Ouve" o envio do formulário
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // 1. Pega os valores dos campos
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 2. Validações simples no frontend
        if (username.length < 3) {
            showError('O nome de usuário deve ter pelo menos 3 caracteres.');
            return;
        }
        if (!email.includes('@')) {
            showError('Por favor, insira um email válido.');
            return;
        }
        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // Desabilita o botão para evitar cliques duplos
        const originalText = btnLogin.innerHTML;
        btnLogin.innerHTML = '<span>Criando...</span>';
        btnLogin.disabled = true;

        // 3. Monta o JSON que a API espera
        const dadosRegistro = {
            username: username,
            email: email,
            password: password
        };

        // 4. Faz a chamada (fetch) para a API Spring Boot
        try {
            const resposta = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosRegistro)
            });

            const resultado = await resposta.json();

            if (resposta.status === 201) { // 201 Created (Sucesso!)
                showSuccess('Conta criada! Redirecionando para o login...');
                
                // Redireciona para o login após 2 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } else { // Erro (Ex: 409 Conflict - email/username já existe)
                showError(resultado.error);
                btnLogin.innerHTML = originalText;
                btnLogin.disabled = false;
            }

        } catch (erro) {
            // Erro de rede (API offline)
            console.error('Erro de conexão:', erro);
            showError('Não foi possível conectar ao servidor.');
            btnLogin.innerHTML = originalText;
            btnLogin.disabled = false;
        }
    });

    // Funções de feedback (copiadas do seu script.js)
    function showError(message) {
        loginBox.classList.add('error');
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `background: #ff4444; color: white; padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; font-size: 14px; animation: slideDown 0.3s ease;`;
        errorDiv.textContent = message;
        registerForm.appendChild(errorDiv);

        setTimeout(() => {
            loginBox.classList.remove('error');
            errorDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    function showSuccess(message) {
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `background: #44ff44; color: #1a3409; padding: 12px; border-radius: 8px; margin-top: 15px; text-align: center; font-size: 14px; font-weight: bold; animation: slideDown 0.3s ease;`;
        successDiv.textContent = message;
        registerForm.appendChild(successDiv);
    }

    // Adiciona as animações CSS (copiadas do seu script.js)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
        @keyframes errorShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .login-box.error { animation: errorShake 0.5s ease-in-out; }
    `;
    document.head.appendChild(style);

    // Bônus: Linkar o script.js original para as animações da raposa
    const foxScript = document.createElement('script');
    foxScript.src = 'script.js';
    // Remove o event listener de submit do script.js para não duplicar
    foxScript.onload = () => {
        const loginFormOriginal = document.getElementById('loginForm');
        if(loginFormOriginal) {
            // Isso é um truque para evitar que o script.js tente
            // adicionar um evento de 'submit' em uma página que não o tem
            loginFormOriginal.id = 'form-desativado'; 
        }
    };
    document.body.appendChild(foxScript);
});