let parametros = new URLSearchParams(location.search);
let id = parametros.get("id");

fetch("http://localhost:3001/volunt")
     .then(res => res.json())
     .then(data => {
      let voluntariado = data.find(function (elem) {return elem.id == id});
      if(voluntariado){
        document.getElementById('titulo').innerHTML = voluntariado.nome;
        document.getElementById('imagem').src = voluntariado.imagem;
        document.getElementById('anfitriao').innerHTML =  `<strong>Anfitrião: </strong>` + voluntariado.anfitriao;
        document.getElementById('descricao').innerHTML =  `<strong>Descrição do Projeto: </strong>` + voluntariado.resumo;
        document.getElementById('horario').innerHTML =  `<strong>Horário: </strong>` + voluntariado.horario;
        document.getElementById('localizacao').innerHTML =  `<strong>Localização: </strong>` + voluntariado.localizacao;
        document.getElementById('dias').innerHTML =  `<strong>Dias:</strong> ${obterSelecionados(voluntariado.dia.opcoes)}`;
        let nome = voluntariado.anfitriao;
        return fetch("http://localhost:3001/anfitrioes")
          .then(res => res.json())
          .then(anfData => {
            let anfitriao = anfData.find(function (elem) {return elem.nome == nome});
            document.getElementById('infoAnfitriao').innerHTML =  `<strong>Informações Anfitrião: </strong>` + anfitriao.info;
        })
      }
    })

function obterSelecionados(opcoes) {
    const Selecionados = opcoes
        .map((opcao) => opcao.nome)
        .join(", ");
    
    return Selecionados;
}