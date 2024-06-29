usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarioId = usuarioLogado.id; // ID do anfitrião para o qual você deseja obter os projetos

// Função para obter os projetos associados a um anfitrião específico
async function obterFavoritosDoUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3001/usuarios/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor.');
        }
        const usuario = await response.json();
        const projetosIds = usuario.id_favoritos;

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
            return projeto;
        }));

        return projetos;
    } catch (error) {
        console.error('Erro ao obter favoritos do usuario:', error);
        return [];
    }
}

// Função para preencher dinamicamente o HTML com as informações dos projetos do anfitrião
async function preencherProjetosNoHTML() {
    try {
        const projetos = await obterFavoritosDoUsuario(usuarioId);

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
                await retirarFavorito(usuarioId, projeto.id);
                cardElement.style.display = 'none';
            });

            return cardClone;
        }
    } catch (error) {
        console.error('Erro ao preencher projetos no HTML:', error);
    }
}

// Função para excluir um projeto
async function retirarFavorito(usuarioId, projetoId) {
    try {
        const responseUsuario = await fetch(`http://localhost:3001/usuarios/${usuarioId}`);
        if (!responseUsuario.ok) {
            throw new Error('Erro ao obter dados do usuário.');
        }
        const usuario = await responseUsuario.json();
        
        // Remover o projeto do array id_meusProjetos do anfitrião
        const novosProjetosIds = usuario.id_favoritos.filter(id => id !== projetoId);

        // Atualizar o anfitrião com o novo array de projetos
        const responseAtualizarUsuario = await fetch(`http://localhost:3001/usuarios/${usuarioId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_favoritos: novosProjetosIds })
        });
        if (!responseAtualizarUsuario.ok) {
            throw new Error('Erro ao atualizar favoritos do usuário.');
        }
        
        alert('Projeto retirado dos favoritos com sucesso!');
        
    } catch (error) {
        console.error('Erro ao retirar favorito:', error);
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
