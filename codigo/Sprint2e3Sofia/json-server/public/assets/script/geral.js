document.getElementById('cabecalho').innerHTML = `<link rel="stylesheet" href="assets/css/menu.css">
<nav class="header">
<a href="index.html" id="logoMobile"><img id="logo" src="assets/imagens/Conexão Solidária Logo-3.png" width="200px"></a>
<div id="secoesMenu">
<input type="checkbox" id="menuTuggle">
<label for="menuTuggle" class="menu-icon">
   <i class="fa-solid fa-bars"></i>
   <i class="fa-solid fa-circle-xmark"></i>
</label>
<ul class="menu">
    <li class="mItem" id="m1"><a href="duvidasFrequentes.html">Central de Ajuda</a></li>
    <li class="mItem" id="m2"><a href="registroAnfitriao.html">Torne-se um Anfitrião</a></li>
    <li class="mItem" id="m3"><a href="index.html"><img src="assets/imagens/Conexão Solidária Logo-3.png" width="150px"></a></li>
    <li class="mItem" id="m4"><a href="login.html">Entrar</a></li>
    <li class="mItem" id="m5"><a href="registro.html">Cadastre-se</a></li>
    <li class="mItem" id="m6"><a href="voluntariado.html">Vagas de Voluntariado</a></li>
    <li class="mItem" id="m7"><a href="doacao.html">Doação de Materiais</a></li>
    <li class="mItem" id="m8"><a href="financeira.html">Contribuição Financeira</a></li>
    <li class="bar"></li>
</ul>
</div>
</nav>`;

let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
let anfitriaoLogado = JSON.parse(localStorage.getItem('anfitriaoLogado'));

if (usuarioLogado) {
    document.getElementById('cabecalho').innerHTML = `<link rel="stylesheet" href="assets/css/menuLogado.css">
    <nav class="header">
    <a href="index.html" id="logoMobile"><img id="logo" src="assets/imagens/Conexão Solidária Logo-3.png" width="200px"></a>
    <input type="checkbox" id="perfilMobile" style="display: none;">
    <label for="perfilMobile" class="perfilMobile-icon">
        <img id="fotoDePerfil" src="assets/imagens/circle-user-regular.svg" width="30px">
    </label>
    <ul id="menuPerfil">
        <li class="mpItem" id="pNome"><p>${usuarioLogado.nome}</p></li>
        <li class="mpItem" id="mp1"><img src="assets/imagens/gear-solid.webp"><a href="configUserForm.html">Configurações</a></li>
        <li class="mpItem" id="mp2"><img src="assets/imagens/heart-regular.svg"><a href="favoritos.html">Favoritos</a></li>
        <li class="mpItem" id="mp4"><img src="assets/imagens/arrow-right-from-bracket-solid.svg"><a href="#" id="logoutMobile">Sair</a></li>
    </ul>
    <div id="secoesMenu">
        <input type="checkbox" id="menuTuggle">
        <label for="menuTuggle" class="menu-icon">
            <i class="fa-solid fa-bars"></i>
            <i class="fa-solid fa-circle-xmark"></i>
        </label>
        <ul class="menu">
            <li class="mItem" id="m1"><a href="duvidasFrequentes.html">Central de Ajuda</a></li>
            <li class="mItem" id="m3"><a href="index.html"><img src="assets/imagens/Conexão Solidária Logo-3.png" width="150px"></a></li>
            <li class="mItem" id="m9">
                <input type="checkbox" id="perfil" style="display: none;">
                <label for="perfil" class="perfil-icon">
                    <img src="assets/imagens/circle-user-regular.svg" width="30px">
                </label>
                <ul id="menuPerfil">
                    <li class="mpItem" id="pNome"><p>${usuarioLogado.nome}</p></li>
                    <li class="mpItem" id="mp1"><img src="assets/imagens/gear-solid.webp"><a href="configUserForm.html">Configurações</a></li>
                    <li class="mpItem" id="mp2"><img src="assets/imagens/heart-regular.svg"><a href="favoritos.html">Favoritos</a></li>
                    <li class="mpItem" id="mp4"><img src="assets/imagens/arrow-right-from-bracket-solid.svg"><a href="#" id="logout">Sair</a></li>
                </ul>
            </li>
            <li class="mItem" id="m6"><a href="voluntariado.html">Vagas de Voluntariado</a></li>
            <li class="mItem" id="m7"><a href="doacao.html">Doação de Materiais</a></li>
            <li class="mItem" id="m8"><a href="financeira.html">Contribuição Financeira</a></li>
            <li class="bar"></li>
        </ul>
    </div>
</nav>`;

function logout() {
    localStorage.removeItem('usuarioLogado'); // Remove os dados do usuário do localStorage
    window.location.href = 'login.html'; // Redireciona para a página de login
}
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('logoutMobile').addEventListener('click', logout);
}
else if (anfitriaoLogado) {
    document.getElementById('cabecalho').innerHTML = `<link rel="stylesheet" href="assets/css/menuLogado.css">
    <nav class="header">
    <a href="index.html" id="logoMobile"><img id="logo" src="assets/imagens/Conexão Solidária Logo-3.png" width="200px"></a>
    <input type="checkbox" id="perfilMobile" style="display: none;">
    <label for="perfilMobile" class="perfilMobile-icon">
        <img id="fotoDePerfil" src="assets/imagens/circle-user-regular.svg" width="30px">
    </label>
    <ul id="menuPerfil">
        <li class="mpItem" id="pNome"><p>${anfitriaoLogado.nome}</p></li>
        <li class="mpItem" id="mp1"><img src="assets/imagens/gear-solid.webp"><a href="configAnfitriaoForm.html">Configurações</a></li>
        <li class="mpItem" id="mp2"><img src="assets/imagens/plus-solid.svg"><a href="novoProjeto.html">Novo Projeto</a></li>
        <li class="mpItem" id="mp3"><img src="assets/imagens/folder-regular.svg"><a href="meusProjsAnfitriao.html">Meus Projetos</a></li>
        <li class="mpItem" id="mp4"><img src="assets/imagens/arrow-right-from-bracket-solid.svg"><a href="#" id="logoutMobile">Sair</a></li>
    </ul>
    <div id="secoesMenu">
        <input type="checkbox" id="menuTuggle">
        <label for="menuTuggle" class="menu-icon">
            <i class="fa-solid fa-bars"></i>
            <i class="fa-solid fa-circle-xmark"></i>
        </label>
        <ul class="menu">
            <li class="mItem" id="m1"><a href="duvidasFrequentes.html">Central de Ajuda</a></li>
            <li class="mItem" id="m3"><a href="index.html"><img src="assets/imagens/Conexão Solidária Logo-3.png" width="150px"></a></li>
            <li class="mItem" id="m9">
                <input type="checkbox" id="perfil" style="display: none;">
                <label for="perfil" class="perfil-icon">
                    <img src="assets/imagens/circle-user-regular.svg" width="30px">
                </label>
                <ul id="menuPerfil">
                    <li class="mpItem" id="pNome"><p>${anfitriaoLogado.nome}</p></li>
                    <li class="mpItem" id="mp1"><img src="assets/imagens/gear-solid.webp"><a href="configAnfitriaoForm.html">Configurações</a></li>
                    <li class="mpItem" id="mp2"><img src="assets/imagens/plus-solid.svg"><a href="novoProjeto.html">Novo Projeto</a></li>
                    <li class="mpItem" id="mp3"><img src="assets/imagens/folder-regular.svg"><a href="meusProjsAnfitriao.html">Meus Projetos</a></li>
                    <li class="mpItem" id="mp4"><img src="assets/imagens/arrow-right-from-bracket-solid.svg"><a href="#" id="logout">Sair</a></li>
                </ul>
            </li>
            <li class="mItem" id="m6"><a href="voluntariado.html">Vagas de Voluntariado</a></li>
            <li class="mItem" id="m7"><a href="doacao.html">Doação de Materiais</a></li>
            <li class="mItem" id="m8"><a href="financeira.html">Contribuição Financeira</a></li>
            <li class="bar"></li>
        </ul>
    </div>
</nav>`;

function logout() {
    localStorage.removeItem('anfitriaoLogado'); // Remove os dados do usuário do localStorage
    window.location.href = 'login.html'; // Redireciona para a página de login
}
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('logoutMobile').addEventListener('click', logout);
}
