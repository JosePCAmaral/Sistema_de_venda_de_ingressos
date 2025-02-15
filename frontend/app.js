document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend carregado!');

    // Verifica se o usuário está autenticado
    checkAuth();

    // Adiciona eventos de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Função para verificar autenticação
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login') {
        window.location.href = '/login'; // Redireciona se não estiver logado
    }
}

// Função para processar login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/historico';
    } else {
        alert('Login falhou! Verifique suas credenciais.');
    }
}
