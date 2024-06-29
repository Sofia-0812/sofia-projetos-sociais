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
            const projeto = await response.json();
            projeto.tipo = response.url.includes('volunt') ? 'volunt' : response.url.includes('doacoes') ? 'doacoes' : 'cfinanceira';
            return projeto;
        }));

        return projetos;
    } catch (error) {
        console.error('Erro ao obter projetos do anfitrião:', error);
        return [];
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
        
            const cardElement = cardClone.querySelector('.card');
            cardElement.querySelector(".projtitulo").textContent = projeto.nome;
            cardElement.querySelector(".projimagem").src = projeto.imagem;
            cardElement.querySelector(".anfitriao").innerHTML = `<strong>Anfitrião:</strong> ${projeto.anfitriao}`;
            cardElement.querySelector(".temas").innerHTML = `<strong>Temas:</strong> ${obterSelecionados(projeto.temas.opcoes)}`;
            cardElement.querySelector(".resumo").textContent = projeto.resumo;
            
            // Adicionar evento de clique para o botão de excluir
            const btnExcluir = cardElement.querySelector("#btnExcluir");
            btnExcluir.addEventListener('click', async () => {
                await excluirProjeto(anfitriaoId, projeto.id, projeto.tipo);
                cardElement.style.display = 'none';
            });

            return cardClone;
        }
    } catch (error) {
        console.error('Erro ao preencher projetos no HTML:', error);
    }
}

// Função para excluir um projeto
async function excluirProjeto(anfitriaoId, projetoId, tipo) {
    try {
        // Obter dados do anfitrião
        const responseAnfitriao = await fetch(`http://localhost:3001/anfitrioes/${anfitriaoId}`);
        if (!responseAnfitriao.ok) {
            throw new Error('Erro ao obter dados do anfitrião.');
        }
        const anfitriao = await responseAnfitriao.json();
        
        // Remover o projeto do array id_meusProjetos do anfitrião
        const novosProjetosIds = anfitriao.id_meusProjetos.filter(id => id !== projetoId);

        // Atualizar o anfitrião com o novo array de projetos
        const anfitriaoAtualizado = {
            ...anfitriao,
            id_meusProjetos: novosProjetosIds
        };

        const responseAtualizarAnfitriao = await fetch(`http://localhost:3001/anfitrioes/${anfitriaoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(anfitriaoAtualizado)
        });
        if (!responseAtualizarAnfitriao.ok) {
            throw new Error('Erro ao atualizar projetos do anfitrião.');
        }

        // Remover o projeto do banco de dados
        const responseDeletarProjeto = await fetch(`http://localhost:3001/${tipo}/${projetoId}`, {
            method: 'DELETE'
        });
        if (!responseDeletarProjeto.ok) {
            throw new Error('Erro ao deletar projeto.');
        }

        console.log(`Projeto ${projetoId} deletado com sucesso.`);
    } catch (error) {
        console.error('Erro ao excluir projeto:', error);
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
