// Usar as informações do db.json para montar o carousel de conteúdos sugeridos
fetch("http://localhost:3000/contsugerido")
 .then(res => res.json())
 .then(contData => {
  let slides = `<div class="carousel-item active"><img src=${contData[0].urlImagem} class="d-block w-100" alt="slide1"></div>`;
  for(let j = 1; j < contData.length; j++)
  {
    let slide = contData[j];
    slides += `<div class="carousel-item">
    <img src=${slide.urlImagem} class="d-block w-100" alt="slide${j + 1}">
   </div>`
  }
  document.getElementById("containerSlides").innerHTML = slides;
})


function maisInformacoes() {
  document.getElementById('btnSM').style.display = 'none';
  document.getElementById('saibaMais').innerHTML = `
    <p><strong>Quem Somos:</strong> O projeto foi idealizado por um grupo de alunos estudantes do curso de Ciência da Computação na PUC Minas para a disciplina de Trabalho Interdiciplinar(TIAW)</p>
    <p><strong>Funcionalidades:</strong> Este site permite que pessoas com interesse em voluntariar encontrem projetos pelos quais se interessam e que se encaixam em suas rotinas através de um sistema de
    busca e filtros, além de permitir que elas favoritem projetos, salvem projetos dos quais participaram e avaliem os anfitriões dos mesmos. Ademais, a plataforma permite que provedores de projetos sociais 
    cadastrem-os no site para que consigam encontrar voluntários para realizarem tais projetos mais facilmente.
    <div id="banner">
      <p>Ainda não se cadastrou?</p>
      <div class="btn"><a href="registro.html">Cadastre-se</a></div>
    </div>
    <button class="btn" id="btnLM">Ler Menos</button>
  `;

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if(usuarioLogado){
    document.getElementById('banner').style.display = "none";
  }
  else{
    document.getElementById('banner').style.display = "block";
  }
  
  document.getElementById('btnLM').addEventListener('click', menosInformacoes);
}

function menosInformacoes() {
  document.getElementById('btnSM').style.display = 'block';
  document.getElementById('saibaMais').innerHTML = '';
}

document.getElementById('btnSM').addEventListener('click', maisInformacoes);
