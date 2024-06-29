async function obterDuvidas() {
    try {
        const response = await fetch('http://localhost:3001/duvidas');
        const duvidas = await response.json();
        return duvidas;
    } catch (error) {
        console.error('Erro ao obter as dúvidas:', error);
        return [];
    }
}

async function atualizarUsuarioAvaliacao(usuarioId, id_duvidasAvaliadas) {
    try {
        const response = await fetch(`http://localhost:3001/usuarios/${usuarioId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_duvidasAvaliadas }),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar o usuário no servidor');
        }
        const usuarioAtualizado = await response.json();
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
        console.log('Usuário atualizado no servidor com sucesso');
    } catch (error) {
        console.error('Erro ao enviar requisição para atualizar o usuário:', error);
    }
}

async function atualizarAnfitriaoAvaliacao(anfitriaoId, id_duvidasAvaliadas) {
    try {
        const response = await fetch(`http://localhost:3001/anfitrioes/${anfitriaoId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_duvidasAvaliadas }),
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar o anfitrião no servidor');
        }
        const anfitriaoAtualizado = await response.json();
        localStorage.setItem('anfitriaoLogado', JSON.stringify(anfitriaoAtualizado));
        console.log('Anfitrião atualizado no servidor com sucesso');
    } catch (error) {
        console.error('Erro ao enviar requisição para atualizar o anfitrião:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    preencherTemplate();
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));
    const usuarioAtual = usuarioLogado || anfitriaoLogado;

    // Verificação de login para os botões
    if (!usuarioAtual) {
        document.getElementById('ajudou').addEventListener('click', () => {
            alert('Para avaliar uma dúvida, é necessário estar logado.');
            document.getElementById('ajudou').disabled = true;
        });
        document.getElementById('NaoAjudou').addEventListener('click', () => {
            alert('Para avaliar uma dúvida, é necessário estar logado.');
            document.getElementById('NaoAjudou').disabled = true;
        });
    }
});

async function preencherTemplate() {
    const duvidas = await obterDuvidas();
    const questionCards = document.getElementById('cards');
    if (!questionCards) {
        console.error('Elemento com ID "cards" não encontrado');
        return;
    }

    const template = document.getElementById('template');
    if (!template) {
        console.error('Template com ID "template" não encontrado');
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));
    const usuarioAtual = usuarioLogado || anfitriaoLogado;

    if (usuarioAtual && !usuarioAtual.id_duvidasAvaliadas) {
        usuarioAtual.id_duvidasAvaliadas = [];
    }

    duvidas.forEach(duvida => {
        const clone = template.content.cloneNode(true);
        const cardTitle = clone.querySelector('.card-title');
        const cardText = clone.querySelector('.card-text');
        const btnAjudou = clone.querySelector('#ajudou');
        const btnNaoAjudou = clone.querySelector('#NaoAjudou');

        if (cardTitle && cardText && btnAjudou && btnNaoAjudou) {
            if (usuarioAtual && usuarioAtual.id_duvidasAvaliadas.includes(duvida.id)) {
                btnAjudou.disabled = true;
                btnNaoAjudou.disabled = true;
            }

            btnAjudou.addEventListener('click', async () => {
                if (usuarioAtual) {
                    duvida.ajudou++;
                    btnAjudou.disabled = true;
                    btnNaoAjudou.disabled = true;
                    usuarioAtual.id_duvidasAvaliadas.push(duvida.id);

                    if (usuarioLogado) {
                        await atualizarUsuarioAvaliacao(usuarioAtual.id, usuarioAtual.id_duvidasAvaliadas);
                    } else if (anfitriaoLogado) {
                        await atualizarAnfitriaoAvaliacao(usuarioAtual.id, usuarioAtual.id_duvidasAvaliadas);
                    }

                    try {
                        const response = await fetch(`http://localhost:3001/duvidas/${duvida.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(duvida),
                        });
                        if (!response.ok) {
                            throw new Error('Erro ao atualizar a dúvida no servidor');
                        }
                        console.log('Dúvida atualizada no servidor com sucesso');
                    } catch (error) {
                        console.error('Erro ao enviar requisição para atualizar a dúvida:', error);
                    }
                } else {
                    alert('Para avaliar uma dúvida, é necessário estar logado.');
                }
            });

            btnNaoAjudou.addEventListener('click', async () => {
                if (usuarioAtual) {
                    duvida.naoAjudou++;
                    btnNaoAjudou.disabled = true;
                    btnAjudou.disabled = true;
                    usuarioAtual.id_duvidasAvaliadas.push(duvida.id);

                    if (usuarioLogado) {
                        await atualizarUsuarioAvaliacao(usuarioAtual.id, usuarioAtual.id_duvidasAvaliadas);
                    } else if (anfitriaoLogado) {
                        await atualizarAnfitriaoAvaliacao(usuarioAtual.id, usuarioAtual.id_duvidasAvaliadas);
                    }

                    try {
                        const response = await fetch(`http://localhost:3001/duvidas/${duvida.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(duvida),
                        });
                        if (!response.ok) {
                            throw new Error('Erro ao atualizar a dúvida no servidor');
                        }
                        console.log('Dúvida atualizada no servidor com sucesso');
                    } catch (error) {
                        console.error('Erro ao enviar requisição para atualizar a dúvida:', error);
                    }
                } else {
                    alert('Para avaliar uma dúvida, é necessário estar logado.');
                }
            });

            document.getElementById('banner').innerHTML = `<p>Ainda não se cadastrou?</p>
            <div class="btn"><a href="registro.html">Cadastre-se</a></div>;`

            if(usuarioAtual){
               document.getElementById('banner').style.display = "none";
            }
            else{
               document.getElementById('banner').style.display = "block";
            }

            cardTitle.textContent = duvida.titulo;
            cardText.textContent = duvida.texto;
            questionCards.appendChild(clone);
        } else {
            console.error('Erro ao preencher o template: elementos card-title ou card-text não encontrados');
        }
    });
}
