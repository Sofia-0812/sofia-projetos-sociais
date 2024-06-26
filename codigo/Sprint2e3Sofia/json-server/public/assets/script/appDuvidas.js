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

        if (cardTitle && cardText) {
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