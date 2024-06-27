const formLogin = document.querySelector('.formLogin');
const emailInput = formLogin.querySelector('input[type="email"]');
const passwordInput = formLogin.querySelector('input[type="password"]');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const usuarios = await response.json();
        const usuario = usuarios.find(u => u.email === email && u.senha === password);

        const resposta = await fetch('http://localhost:3000/anfitrioes');
        const anfitrioes = await resposta.json();
        const anfitriao = anfitrioes.find(a => a.email === email && a.senha === password);

        if (usuario) {
            // Login bem-sucedido: armazene o ID do usuário (ou outras informações)
            // em localStorage ou sessionStorage e redirecione para index-logado.html
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            window.location.href = 'index.html';
        } else if (anfitriao) 
        {
            // Login bem-sucedido: armazene o ID do usuário (ou outras informações)
            // em localStorage ou sessionStorage e redirecione para index-logado.html
            localStorage.setItem('anfitriaoLogado', JSON.stringify(anfitriao));
            window.location.href = 'index.html';
        }
        else
        {
            alert('Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Ocorreu um erro durante o login');
    }
});
