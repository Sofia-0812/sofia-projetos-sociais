const formLogin = document.querySelector('.formLogin');
const nomeInput = formLogin.querySelector('input[type="text"]');
const emailInput = formLogin.querySelector('input[type="email"]');
const passwordInput = formLogin.querySelector('input[type="password"]');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const novoUsuario = { nome, email, senha: password };

    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            alert('Registro bem-sucedido! Faça o login.');
            window.location.href = 'login.html'; // Redireciona para a página de login
        } else {
            alert('Erro ao registrar usuário');
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Ocorreu um erro durante o registro');
    }
});
