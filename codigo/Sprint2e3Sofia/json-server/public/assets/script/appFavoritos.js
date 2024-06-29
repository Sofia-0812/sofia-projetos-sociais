const usuarioId = 1; // ID do anfitrião para o qual você deseja obter os projetos

// Função para obter os projetos associados a um anfitrião específico
async function obterProjetosDoUsuario(usuarioId) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
        const usuario = await response.json();
        const projetosIds = usuario.id_projetos_favoritados;

        // Obter detalhes dos projetos
        const projetos = await Promise.all(projetosIds.map(async (projetoId) => {
            const response = await fetch(`http://localhost:3000/projetos/${projetoId}`);
            return await response.json();
        }));
        return projetos;
    } catch (error) {
        console.error('Erro ao obter projetos do usuário:', error);
        return [];
    }
}

// Função para preencher dinamicamente o HTML com as informações dos projetos do anfitrião
async function preencherProjetosNoHTML() {
    const projetos = await obterProjetosDoUsuario(usuarioId);

    // Selecionar o elemento onde os projetos serão inseridos
    const view1 = document.getElementById('view');

    // Limpar o conteúdo atual, se houver
    view1.innerHTML = '';

    // Para cada projeto, criar e adicionar um elemento HTML com suas informações
    projetos.forEach(projeto => {
        const cardTemplate = document.getElementById('card-template');
        const cardClone = cardTemplate.content.cloneNode(true);

        cardClone.querySelector('.anfitriao').textContent = projeto.nome_anfitriao;
        cardClone.querySelector('.projtitulo').textContent = projeto.nome_projeto;
        cardClone.querySelector('.temas').textContent = projeto.tema;
        cardClone.querySelector('.resumo').textContent = projeto.resumo;

        const btnExcluir = cardClone.querySelector('#btnExcluir');
        btnExcluir.addEventListener('click', () => removerProjetoFavoritado(projeto.id));

        view1.appendChild(cardClone);
    });
}

// Função para remover um projeto favoritado
async function removerProjetoFavoritado(projetoId) {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`);
        const usuario = await response.json();

        // Remover o ID do projeto da lista de projetos favoritados
        const novosProjetosFavoritados = usuario.id_projetos_favoritados.filter(id => id != projetoId);

        // Atualizar o usuário no servidor
        await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_projetos_favoritados: novosProjetosFavoritados })
        });

        // Atualizar a exibição dos projetos no HTML
        preencherProjetosNoHTML();
    } catch (error) {
        console.error('Erro ao remover projeto favoritado:', error);
    }
}

// Chamar a função para preencher os projetos no carregamento da página
window.addEventListener('load', () => {
    preencherProjetosNoHTML();
});