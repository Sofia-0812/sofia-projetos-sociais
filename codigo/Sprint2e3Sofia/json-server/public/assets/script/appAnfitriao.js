anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));
const anfitriaoId = anfitriaoLogado.id; // ID do anfitrião para o qual você deseja obter os projetos

// Função para obter os projetos associados a um anfitrião específico
async function obterProjetosDoAnfitriao(anfitriaoId) {
    try {
        const response = await fetch(`http://localhost:3001/anfitrioes/${anfitriaoId}`);
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor.');
        }
        const anfitriao = await response.json();
        const projetosIds = anfitriao.id_meusProjetos;

        // Obter detalhes dos projetos
        const projetos = await Promise.all(projetosIds.map(async (projetoId) => {
            var response = await fetch(`http://localhost:3001/volunt/${projetoId}`);
            if (!response.ok) {
                response = await fetch(`http://localhost:3001/doacoes/${projetoId}`);
                if(!response.ok){
                    response = await fetch(`http://localhost:3001/cfinanceira/${projetoId}`);
                }
            }
            return await response.json();
        }));

        // Calcular a média das notas dos projetos
        const notas = projetos.flatMap(projeto => projeto.notas || []);
        const somaNotas = notas.reduce((acc, nota) => acc + nota, 0);
        let mediaNotas = somaNotas / notas.length;

        // Arredondar para o próximo inteiro maior, se necessário
        if (!isNaN(mediaNotas)) {
            mediaNotas = Math.ceil(mediaNotas);
        }

        console.log("Média das notas:", mediaNotas);

        // Preencher dinamicamente a div de avaliação com ícones ou mensagem
        preencherAvaliacaoNoHTML(mediaNotas);

        return projetos;
    } catch (error) {
        console.error('Erro ao obter projetos do anfitrião:', error);
        return [];
    }
}

// Função para preencher dinamicamente a div de avaliação com ícones ou mensagem
function preencherAvaliacaoNoHTML(mediaNotas) {
    const iconsContainer = document.getElementById('icons-container');
    iconsContainer.innerHTML = ''; // Limpar o conteúdo atual

    // Verificar se a média de notas é NaN
    if (isNaN(mediaNotas) || mediaNotas === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Você ainda não foi avaliado.';
        iconsContainer.appendChild(mensagem);
    } else {
        // Adicionar ícones com base na média de notas
        for (let i = 0; i < mediaNotas; i++) {
            const icon = document.createElement('i');
            icon.classList.add('bi', 'bi-star-fill', 'initial-star');
            iconsContainer.appendChild(icon);
        }
    }
}

// Função para preencher dinamicamente o HTML com as informações dos projetos do anfitrião
async function preencherProjetosNoHTML() {
    try {
        const projetos = await obterProjetosDoAnfitriao(anfitriaoId);

        const cardsContainer = document.getElementById("cards-container");

        // Para cada projeto, criar e adicionar um elemento HTML com suas informações
        projetos.forEach((projeto) => {
            const card = criarCard(projeto);
            cardsContainer.appendChild(card);
        });

        function criarCard(projeto) {
            // Obter o template do card
            const template = document.getElementById("card-template");
        
            // Criar uma cópia do template
            const cardClone = document.importNode(template.content, true);
        
            // Preencher os elementos do card com os dados do projeto
            cardClone.querySelector(".projtitulo").textContent = projeto.nome;
            cardClone.querySelector(".projimagem").src = projeto.imagem;
            cardClone.querySelector(".anfitriao").innerHTML = `<strong>Anfitrião:</strong> ${projeto.anfitriao}`;
            cardClone.querySelector(".temas").innerHTML = `<strong>Temas:</strong> ${obterSelecionados(projeto.temas.opcoes)}`;
            cardClone.querySelector(".resumo").textContent = projeto.resumo;
        
            return cardClone;
          }


    } catch (error) {
        console.error('Erro ao preencher projetos no HTML:', error);
    }
}

// Função para obter os selecionados de um projeto
function obterSelecionados(opcoes) {
    const Selecionados = opcoes
      .map((opcao) => opcao.nome)
      .join(", ");

    return Selecionados;
  }
  
// Chamar a função para preencher os projetos no carregamento da página
window.addEventListener('load', () => {
    preencherProjetosNoHTML();
});