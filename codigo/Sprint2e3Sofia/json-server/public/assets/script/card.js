let parametros = new URLSearchParams(window.location.search);
let id = parametros.get("id");
console.log(id);

usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const idUsuario = usuarioLogado.id;

async function verificarUsuarioLogado() {
    const responseUsuario = await fetch(`http://localhost:3001/usuarios/${idUsuario}`);
    if (!responseUsuario.ok) {
        throw new Error('Erro ao obter dados do usuário.');
    }
    const usuario = await responseUsuario.json();

    if (usuarioLogado) {
        if (usuario.id_favoritos && usuario.id_favoritos.includes(id)) {
            document.getElementById('btnFav').addEventListener('click', function () {
                alert('Este projeto já está nos seus favoritos');
                document.getElementById('btnFav').disabled = true;
            });
        } else {
            document.getElementById('btnFav').disabled = false;
            document.getElementById('btnFav').addEventListener('click', function () {
                favoritarProjeto(id, usuario);
            });
        }
    } else {
        document.getElementById('btnFav').addEventListener('click', function () {
            alert('Para favoritar um projeto, é necessário estar logado como usuário.');
            document.getElementById('btnFav').disabled = true;
        });
    }
}

async function favoritarProjeto(idProjeto, user) {
    if (!user.id_favoritos) {
        user.id_favoritos = [];
    }

    user.id_favoritos.push(idProjeto);

    const response = await fetch(`http://localhost:3001/usuarios/${idUsuario}`, {
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

// Carrega detalhes do voluntariado e configura página
fetch(`http://localhost:3001/volunt?id=${id}`)
    .then(res => res.json())
    .then(data => {
        if (data && data.length > 0) {
            console.log(data);
            let voluntariado = data[0];
            document.getElementById('titulo').innerHTML = voluntariado.nome;
            document.getElementById('imagem').src = voluntariado.imagem;
            document.getElementById('anfitriao').innerHTML = `<strong>Anfitrião: </strong>` + voluntariado.anfitriao;
            document.getElementById('descricao').innerHTML = `<strong>Descrição do Projeto: </strong>` + voluntariado.resumo;
            document.getElementById('horario').innerHTML = `<strong>Horário: </strong>` + voluntariado.horario;
            document.getElementById('localizacao').innerHTML = `<strong>Localização: </strong>` + voluntariado.localizacao;
            document.getElementById('dias').innerHTML = `<strong>Dias:</strong> ${obterSelecionados(voluntariado.dia.opcoes)}`;
            return fetch(`http://localhost:3001/anfitrioes?id=${voluntariado.id_anfitriao}`)
                .then(res => res.json())
                .then(anfitData => {
                    console.log(anfitData);
                    let anfitriao = anfitData[0];
                    document.getElementById('infoAnfitriao').innerHTML = `<strong>Informações do Anfitrião: </strong>` + anfitriao.info;
                });
        } else {
            console.error(`Voluntariado com ID ${id} não encontrado.`);
        }
    })
    .catch(err => console.error('Erro ao buscar voluntariados:', err));

// Função auxiliar para obter dias selecionados
function obterSelecionados(opcoes) {
    const selecionados = opcoes.map(opcao => opcao.nome).join(", ");
    return selecionados;
}
