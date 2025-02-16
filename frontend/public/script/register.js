document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Erro ao cadastrar usuário.");
                }

                alert("Cadastro realizado com sucesso!");
                window.location.href = "/login";

            } catch (error) {
                alert(error.message);
            }
        });
    }
});