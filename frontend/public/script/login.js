document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend carregado!');

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao fazer login.');
        }

        document.cookie = `token=${data.token}; path=/; Secure; SameSite=Strict`;
        window.location.href = '/home';

    } catch (error) {
        console.error(error.message);

        const errorMessage = document.querySelector('.error-message');
        if (!errorMessage) {
            const form = document.getElementById('login-form');
            const errorElement = document.createElement('p');
            errorElement.classList.add('error-message');
            errorElement.textContent = error.message;
            form.insertAdjacentElement('beforebegin', errorElement);
        } else {
            errorMessage.textContent = error.message;
        }
    }
}