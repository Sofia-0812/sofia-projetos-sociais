function enviarDados(formId, rota) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  // Obter o nome do anfitrião logado do localStorage
  const anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado')).nome;
  const anfitriaoLogadoId = JSON.parse(localStorage.getItem('anfitriaoLogado')).id;

  // Adicionar o nome do anfitrião ao FormData
  formData.append('anfitriao', anfitriaoLogado);
  formData.append('anfitriaoId', anfitriaoLogadoId);


  fetch(rota, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert('Dados enviados com sucesso!');
      form.reset();
      window.location.href = 'novoProjeto.html';
    } else {
      alert('Erro ao enviar dados. Por favor, tente novamente.');
    }
  })
  .catch(error => {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao enviar dados. Por favor, tente novamente.');
  });
}

function enviarDadosVoluntariado() {
  enviarDados('voluntariadoForm', '/projeto-voluntariado'); 
}

function enviarDadosDoacao() {
  enviarDados('doacaoForm', '/doacao');
}

function enviarDadosCFinanceira() {
  enviarDados('cfinanceiraForm', '/cfinanceira');
}