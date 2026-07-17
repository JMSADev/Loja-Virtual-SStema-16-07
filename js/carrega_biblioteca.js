// ARQUIVO: js/carrega_biblioteca.js
// Roda só na página biblioteca.html

// PEGANDO ELEMENTOS DO DOM
const listaJogos = document.querySelector('#jogos-biblioteca');
const bibliotecaVazia = document.querySelector('#biblioteca-vazia');
const jogoSelecionadoBox = document.querySelector('#jogo-selecionado');
const capaJogo = document.querySelector('#capa-jogo');
const tituloJogo = document.querySelector('#titulo-jogo');
const btnBaixar = document.querySelector('#btn-baixar');
const btnRemoverJogo = document.querySelector('#btn-remover-jogo');

// Lê a biblioteca salva no localStorage (mesma lógica usada no carrega_carrinho.js)
const pegarBiblioteca = () => {
    const bibliotecaSalva = localStorage.getItem('biblioteca');
    return bibliotecaSalva ? JSON.parse(bibliotecaSalva) : [];
}

// Salva a biblioteca atualizada de volta no localStorage
const salvarBiblioteca = (biblioteca) => {
    localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
}

// Mostra os detalhes de um jogo específico no painel da direita
const mostrarJogo = (jogo) => {
    // "../" porque biblioteca.html está dentro de /paginas
    capaJogo.setAttribute('src', `../${jogo.caminho_da_imagem}`);
    capaJogo.setAttribute('alt', jogo.descricao_produto);
    tituloJogo.innerHTML = jogo.descricao_produto;

    // O botão "Baixar" e o botão "Remover" guardam qual jogo está selecionado no momento
    btnBaixar.dataset.nomeJogo = jogo.descricao_produto;
    btnRemoverJogo.dataset.idJogo = jogo.id;
    btnRemoverJogo.dataset.nomeJogo = jogo.descricao_produto;
}

// FUNÇÃO PRINCIPAL: monta a barra lateral com os jogos comprados
const renderizarBiblioteca = () => {
    const biblioteca = pegarBiblioteca();

    listaJogos.innerHTML = '';

    // Se não tiver nenhum jogo comprado, mostra a mensagem de biblioteca vazia
    if (biblioteca.length === 0) {
        bibliotecaVazia.style.display = 'flex';
        jogoSelecionadoBox.style.display = 'none';
        return;
    }

    bibliotecaVazia.style.display = 'none';
    jogoSelecionadoBox.style.display = 'flex';

    biblioteca.forEach((jogo, indice) => {
        const liJogo = document.createElement('li');
        liJogo.setAttribute('class', 'jogo-item');
        if (indice === 0) liJogo.classList.add('ativo'); // primeiro jogo já vem selecionado

        const imgJogo = document.createElement('img');
        imgJogo.setAttribute('src', `../${jogo.caminho_da_imagem}`);
        imgJogo.setAttribute('alt', jogo.descricao_produto);

        const spanNome = document.createElement('span');
        spanNome.setAttribute('class', 'jogo-nome');
        spanNome.innerHTML = jogo.descricao_produto;

        liJogo.appendChild(imgJogo);
        liJogo.appendChild(spanNome);

        // Ao clicar num jogo da lista, mostra ele no painel da direita
        liJogo.addEventListener('click', () => {
            // Tira a classe "ativo" de todos e coloca só no clicado
            document.querySelectorAll('.jogo-item').forEach(el => el.classList.remove('ativo'));
            liJogo.classList.add('ativo');
            mostrarJogo(jogo);
        });

        listaJogos.appendChild(liJogo);
    });

    // Mostra o primeiro jogo da lista por padrão, assim que a página carrega
    mostrarJogo(biblioteca[0]);
}

// Ao clicar em "Baixar" (por enquanto só simula o download)
btnBaixar.addEventListener('click', () => {
    alert(`Baixando ${btnBaixar.dataset.nomeJogo}...`);
});

// Ao clicar em "Remover da biblioteca"
btnRemoverJogo.addEventListener('click', () => {
    const idJogo = parseInt(btnRemoverJogo.dataset.idJogo);
    const nomeJogo = btnRemoverJogo.dataset.nomeJogo;

    const confirmarRemocao = confirm(`Remover "${nomeJogo}" da sua biblioteca?`);
    if (!confirmarRemocao) return;

    const biblioteca = pegarBiblioteca();
    const bibliotecaAtualizada = biblioteca.filter(jogo => jogo.id !== idJogo);

    salvarBiblioteca(bibliotecaAtualizada);
    renderizarBiblioteca(); // desenha a tela de novo, já sem o jogo removido
});

// Roda assim que a página carrega
renderizarBiblioteca();