let parametros = new URLSearchParams(location.search);
let id = parametros.get("id");
console.log(id);

fetch("http://localhost:3001/volunt")
  .then(res => res.json())
  .then(data => {
    let voluntariado = data.find(elem => elem.id == id);
    if (voluntariado) {
      document.getElementById('titulo').innerHTML = voluntariado.nome;
      document.getElementById('imagem').src = voluntariado.imagem;
      document.getElementById('anfitriao').innerHTML = `<strong>Anfitrião: </strong>` + voluntariado.anfitriao;
      document.getElementById('descricao').innerHTML = `<strong>Descrição do Projeto: </strong>` + voluntariado.resumo;
      document.getElementById('horario').innerHTML = `<strong>Horário: </strong>` + voluntariado.horario;
      document.getElementById('localizacao').innerHTML = `<strong>Localização: </strong>` + voluntariado.localizacao;
      document.getElementById('dias').innerHTML = `<strong>Dias:</strong> ${obterSelecionados(voluntariado.dia.opcoes)}`;

      let nomeAnfitriao = voluntariado.anfitriao;
      fetch("http://localhost:3001/anfitrioes")
        .then(res => res.json())
        .then(anfData => {
          let anfitriao = anfData.find(elem => elem.nome == nomeAnfitriao);
          if (anfitriao) {
            document.getElementById('infoAnfitriao').innerHTML = `<strong>Informações Anfitrião: </strong>` + anfitriao.info;
          } else {
            console.error(`Anfitrião não encontrado para o voluntariado ${voluntariado.nome}`);
          }
        })
        .catch(err => console.error('Erro ao buscar anfitriões:', err));
    } else {
      console.error(`Voluntariado com ID ${id} não encontrado.`);
    }
  })
  .catch(err => console.error('Erro ao buscar voluntariados:', err));

function obterSelecionados(opcoes) {
  const selecionados = opcoes.map(opcao => opcao.nome).join(", ");
  return selecionados;
}
