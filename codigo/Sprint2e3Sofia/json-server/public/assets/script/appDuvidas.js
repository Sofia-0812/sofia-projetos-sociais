async function obterDuvidas() {
    try {
        const response = await fetch('http://localhost:3000/duvidas');
        const duvidas = await response.json();
        return duvidas;
    } catch (error) {
        console.error('Erro ao obter as duvidas:', error);
        return [];
    }
}

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

    duvidas.forEach(duvida => {
        const clone = template.content.cloneNode(true);
        const cardTitle = clone.querySelector('.card-title');
        const cardText = clone.querySelector('.card-text');
        const btnAjudou = clone.getElementById('ajudou');
        const btnNaoAjudou = clone.getElementById('NaoAjudou');

        if (cardTitle && cardText && btnAjudou && btnNaoAjudou) {

            // Verificar se os botões devem ser desabilitados
                const ajudouKey = `ajudou_${duvida.id}`;
                const naoAjudouKey = `naoAjudou_${duvida.id}`;

               // Checar localStorage para saber se os botões estão desabilitados
               if (localStorage.getItem(ajudouKey) === 'true') {
                   btnAjudou.disabled = true;
                  btnNaoAjudou.disabled = true;
                } else if (localStorage.getItem(naoAjudouKey) === 'true') {
                   btnAjudou.disabled = true;
                   btnNaoAjudou.disabled = true;
                }

            btnAjudou.addEventListener('click', async() => {
                duvida.ajudou++;
                btnAjudou.disabled = true;
                btnNaoAjudou.disabled = true;
                localStorage.setItem(ajudouKey, 'true');
                
                try {
                    const response = await fetch(`http://localhost:3000/duvidas/${duvida.id}`, {
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
            });

            btnNaoAjudou.addEventListener('click', async() => {
                duvida.naoAjudou++;
                btnNaoAjudou.disabled = true;
                btnAjudou.disabled = true;
                localStorage.setItem(naoAjudouKey, 'true');
                try {
                    const response = await fetch(`http://localhost:3000/duvidas/${duvida.id}`, {
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
            });

            document.getElementById('banner').innerHTML = `<p>Ainda não se cadastrou?</p>
            <div class="btn"><a href="registro.html">Cadastre-se</a></div>`;

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            const anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));

            if(usuarioLogado || anfitriaoLogado){
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

document.addEventListener('DOMContentLoaded', () => {
    preencherTemplate();
});