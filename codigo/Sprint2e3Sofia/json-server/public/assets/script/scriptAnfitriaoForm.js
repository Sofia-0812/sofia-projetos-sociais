document.addEventListener('DOMContentLoaded', () => {
  const anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));
  console.log(anfitriaoLogado);

  if (!anfitriaoLogado || !anfitriaoLogado.id) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('nome').value = anfitriaoLogado.nome;
  document.getElementById('email').value = anfitriaoLogado.email;
  document.getElementById('info').value = anfitriaoLogado.info;

  // Lidar com o envio do formulário
  document.getElementById('profile-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const dados = {
      ...anfitriaoLogado,  // Mantém todos os campos do objeto original
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      info: document.getElementById('info').value
    };

    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const senhaAtual = document.getElementById('senha-atual').value;

    if (novaSenha || confirmarSenha) {
      if (senhaAtual !== anfitriaoLogado.senha) {
        alert('A senha atual está incorreta.');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        alert('As novas senhas não coincidem.');
        return;
      }

      dados.senha = novaSenha;
    } else {
      dados.senha = anfitriaoLogado.senha;
    }

    fetch(`http://localhost:3001/anfitrioes/${anfitriaoLogado.id}`, {
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
      localStorage.setItem('anfitriaoLogado', JSON.stringify(dados)); // Atualiza o objeto no localStorage
      console.log(dados);
      window.location.href = 'index.html';
    })
    .catch(error => {
      alert(error.message);
    });
  });
});
