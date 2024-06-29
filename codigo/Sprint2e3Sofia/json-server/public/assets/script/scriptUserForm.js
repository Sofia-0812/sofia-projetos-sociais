document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado || !usuarioLogado.id) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('nome').value = usuarioLogado.nome;
  document.getElementById('email').value = usuarioLogado.email;

  // Lidar com o envio do formulário
  document.getElementById('profile-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value
    };

    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const senhaAtual = document.getElementById('senha-atual').value;

    if (novaSenha || confirmarSenha) {
      if (senhaAtual !== usuarioLogado.senha) {
        alert('A senha atual está incorreta.');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        alert('As novas senhas não coincidem.');
        return;
      }

      dados.senha = novaSenha;
    } else {
      dados.senha = usuarioLogado.senha; 
    }

    
    fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error || 'Erro ao atualizar dados no servidor.') }); 
      }
      return response.json();
    })
    .then(data => {
      alert('Dados atualizados com sucesso!');
      localStorage.setItem('usuarioLogado', JSON.stringify({
        ...usuarioLogado,
        ...dados
      }));
      window.location.href = 'index.html';
    })
    .catch(error => {
      alert(error.message);
    });
  });
});