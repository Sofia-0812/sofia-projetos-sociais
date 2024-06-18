const temasInput = document.querySelectorAll(".temaInput");
let filtrosTema = [];

const temValoresEmComum = (array1, array2) =>
  array1.some((item) => array2.includes(item));

const aplicarFiltros = () => {
  const cards = document.querySelectorAll(".card");
  console.log(cards);
  cards.forEach((card) => {
    const temas = card
      .querySelector(".temas")
      .textContent.toLowerCase()
      .slice(6)
      .trim()
      .split(", ");

    const mostrarPorTema =
      filtrosTema.length === 0 || temValoresEmComum(temas, filtrosTema);

    if (mostrarPorTema) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

temasInput.forEach((input) => {
  input.addEventListener("change", (event) => {
    if (event.target.checked) {
      filtrosTema.push(event.target.value.toLowerCase());
    } else {
      filtrosTema = filtrosTema.filter(
        (tema) => tema !== event.target.value.toLowerCase()
      );
    }
    aplicarFiltros();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Função para carregar e exibir os cards dos projetos
  function carregarProjetos() {
    fetch("http://localhost:3000/cfinanceira") // Caminho para o arquivo JSON
      .then((response) => response.json())
      .then((data) => {
        const projetos = data;

        const cardsContainer = document.getElementById("cards-container");

        projetos.forEach((projeto) => {
          const card = criarCard(projeto);
          cardsContainer.appendChild(card);
        });
      })
      .catch((error) => console.error("Erro ao carregar projetos:", error));
  }

  // Função para criar um card com os dados de um projeto
  function criarCard(projeto) {
    // Obter o template do card
    const template = document.getElementById("card-template");

    // Criar uma cópia do template
    const cardClone = document.importNode(template.content, true);

    // Preencher os elementos do card com os dados do projeto
    cardClone.querySelector(".projtitulo").textContent = projeto.nome;
    cardClone.querySelector(".projimagem").src = projeto.imagem;
    cardClone.querySelector(".anfitriao").innerHTML = `<strong>Anfitrião:</strong> ${projeto.anfitrião}`;
    cardClone.querySelector(".temas").innerHTML = `<strong>Temas:</strong> ${obterSelecionados(projeto.temas.opcoes)}`;
    cardClone.querySelector(".ibancarias").innerHTML = `<strong>Informações Bancárias:</strong> ${projeto.ibancarias}`;
    cardClone.querySelector(".resumo").textContent = projeto.resumo;

    return cardClone;
  }

  // Função para obter os selecionados de um projeto
  function obterSelecionados(opcoes) {
    const Selecionados = opcoes
      .map((opcao) => opcao.nome)
      .join(", ");

    return Selecionados;
  }

  // Função para buscar projetos com base no texto digitado
  function buscarProjetos() {
    const searchText = normalizeText(
      document.getElementById("search").value.toLowerCase()
    );
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const titulo = normalizeText(card.querySelector(".projtitulo").textContent.toLowerCase());
      const anfitriao = normalizeText(card.querySelector(".anfitriao").textContent.toLowerCase());
      const temas = normalizeText(card.querySelector(".temas").textContent.toLowerCase());
      const resumo = normalizeText(card.querySelector(".resumo").textContent.toLowerCase());

      if (titulo.includes(searchText) || anfitriao.includes(searchText) || temas.includes(searchText) || resumo.includes(searchText)) 
      {
        card.style.display = "block";
      } 
      else {
        card.style.display = "none";
      }
    });
  }

  // Função para normalizar caracteres, removendo acentos e caracteres especiais
  function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Adicionar um listener para o evento de input no campo de busca
  document.getElementById("search").addEventListener("input", buscarProjetos);

  // Chamada para carregar os projetos ao carregar a página
  carregarProjetos();
});
