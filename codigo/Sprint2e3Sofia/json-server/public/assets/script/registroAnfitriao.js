const formLogin = document.querySelector('.formLogin');
const nomeInput = formLogin.querySelector('input[id="nome"]');
const emailInput = formLogin.querySelector('input[type="email"]');
const passwordInput = formLogin.querySelector('input[type="password"]');
const sobreInput = formLogin.querySelector('input[id="sobreMim"]');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const info = sobreInput.value;

    const novoUsuario = { nome, email, senha: password, info };

    try {
        const response = await fetch('http://localhost:3001/anfitrioes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            alert('Registro bem-sucedido! Faça o login.');
            window.location.href = 'login.html'; // Redireciona para a página de login
        } else {
            alert('Erro ao registrar anfitrião');
        }
    } catch (error) {
        console.error('Erro ao registrar anfitrião:', error);
        alert('Ocorreu um erro durante o registro');
    }
});
