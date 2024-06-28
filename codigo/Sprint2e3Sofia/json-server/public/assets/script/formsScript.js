function enviarDados(formId, rota) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
  
    const jsonData = {};
    for (let [key, value] of formData.entries()) {
      // Lida com checkboxes (converte em array se necessário)
      if (jsonData[key]) {
        if (!Array.isArray(jsonData[key])) {
          jsonData[key] = [jsonData[key]];
        }
        jsonData[key].push(value);
      } else {
        jsonData[key] = value;
      }
    }
  
    fetch(rota, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(response => {
      if (response.ok) {
        alert('Dados enviados com sucesso!');
        form.reset();
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
    enviarDados('voluntariadoForm', '/volunt');
  }
  
  function enviarDadosDoacao() {
    enviarDados('doacaoForm', '/doacoes');
  }
  
  function enviarDadosCFinanceira() {
    enviarDados('cfinanceiraForm', '/cfinanceira');
  }