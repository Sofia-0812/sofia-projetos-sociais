let parametros = new URLSearchParams(window.location.search);
let id = parametros.get("id");
console.log(id);


usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

async function verificarUsuarioLogado() {
    if(usuarioLogado){
        const idUsuario = usuarioLogado.id;
    const responseUsuario = await fetch(`http://localhost:3001/usuarios/${idUsuario}`);
    if (!responseUsuario.ok) {
        throw new Error('Erro ao obter dados do usuário.');
    }
    const usuario = await responseUsuario.json();

        if (usuario.id_favoritos && usuario.id_favoritos.includes(id)) {
            document.getElementById('btnFav').addEventListener('click', function () {
                alert('Este projeto já está nos seus favoritos');
                document.getElementById('btnFav').disabled = true;
            });
        } else {
            document.getElementById('btnFav').disabled = false;
            document.getElementById('btnFav').addEventListener('click', function () {
                favoritarProjeto(id, usuario, idUsuario);
            });
        }
    } else {
        document.getElementById('btnFav').addEventListener('click', function () {
            alert('Para favoritar um projeto, é necessário estar logado como usuário.');
            document.getElementById('btnFav').disabled = true;
        });
    }
}

async function favoritarProjeto(idProjeto, user, IDUsuario) {
    if (!user.id_favoritos) {
        user.id_favoritos = [];
    }

    user.id_favoritos.push(idProjeto);

    const response = await fetch(`http://localhost:3001/usuarios/${IDUsuario}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        alert('Projeto adicionado aos favoritos.');
        document.getElementById('btnFav').disabled = true;
    } else {
        alert('Erro ao adicionar o projeto aos favoritos.');
    }
}

// Carrega detalhes da doacao e configura página
fetch(`http://localhost:3001/doacoes?id=${id}`)
    .then(res => res.json())
    .then(data => {
        if (data && data.length > 0) {
            console.log(data);
            let doacao = data[0];
            document.getElementById('titulo').innerHTML = doacao.nome;
            document.getElementById('imagem').src = doacao.imagem;
            document.getElementById('anfitriao').innerHTML = `<strong>Anfitrião: </strong>` + doacao.anfitriao;
            document.getElementById('descricao').innerHTML = `<strong>Descrição do Projeto: </strong>` + doacao.resumo;
            document.getElementById('horario').innerHTML = `<strong>Horário: </strong>` + doacao.horario;
            document.getElementById('localizacao').innerHTML = `<strong>Localização: </strong>` + doacao.localizacao;
            document.getElementById('dias').innerHTML = `<strong>Dias:</strong> ${obterSelecionados(doacao.dia.opcoes)}`;
            return fetch(`http://localhost:3001/anfitrioes?id=${doacao.id_anfitriao}`)
                .then(res => res.json())
                .then(anfitData => {
                    console.log(anfitData);
                    let anfitriao = anfitData[0];
                    document.getElementById('infoAnfitriao').innerHTML = `<strong>Informações do Anfitrião: </strong>` + anfitriao.info;
                    document.getElementById('contato').innerHTML = `<strong>Contato: </strong>` + anfitriao.email;
                });
        } else {
            console.error(`Doação com ID ${id} não encontrado.`);
        }
    })
    .catch(err => console.error('Erro ao buscar doações:', err));

// Função auxiliar para obter dias selecionados
function obterSelecionados(opcoes) {
    const selecionados = opcoes.map(opcao => opcao.nome).join(", ");
    return selecionados;
}
