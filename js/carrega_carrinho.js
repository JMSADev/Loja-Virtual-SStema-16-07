// ARQUIVO: js/carrega_carrinho.js
// Esse arquivo só roda na página carrinho.html

// PEGANDO ELEMENTOS DO DOM
const listaCarrinho = document.querySelector('#lista-carrinho');
const carrinhoVazio = document.querySelector('#carrinho-vazio');
const valorTotal = document.querySelector('#valor-total');
const btnFinalizar = document.querySelector('#btn-finalizar');

// Lê o carrinho salvo no localStorage (mesma lógica do carrega_produtos.js)
const pegarCarrinho = () => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

// Salva o carrinho atualizado de volta no localStorage
const salvarCarrinho = (carrinho) => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Formata número para o padrão de moeda brasileiro (mesma lógica usada nos cards)
const formatarPreco = (valor) => {
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

// Calcula a soma de todos os itens do carrinho
const calcularTotal = (carrinho) => {
    return carrinho.reduce((soma, elem) => soma + parseFloat(elem.valor_unitario), 0);
}

// Remove um item do carrinho pelo índice (posição) dele no array
const removerItem = (indice) => {
    const carrinho = pegarCarrinho();
    carrinho.splice(indice, 1); // splice remove 1 elemento a partir daquela posição
    salvarCarrinho(carrinho);
    renderizarCarrinho(); // desenha a tela de novo, já sem o item removido
}

// FUNÇÃO PRINCIPAL: monta a tela do carrinho a partir do que está no localStorage
const renderizarCarrinho = () => {
    const carrinho = pegarCarrinho();

    listaCarrinho.innerHTML = '';

    // Se não tiver nenhum item, mostra a mensagem de carrinho vazio e some com o resumo
    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        valorTotal.innerHTML = formatarPreco(0);
        btnFinalizar.disabled = true;
        return;
    }

    carrinhoVazio.style.display = 'none';
    btnFinalizar.disabled = false;

    carrinho.forEach((elem, indice) => {
        const divItem = document.createElement('div');
        divItem.setAttribute('class', 'item_carrinho');

        const imgItem = document.createElement('img');
        // "../" na frente porque carrinho.html está dentro da pasta /paginas,
        // então precisa subir um nível antes de entrar em /imagens
        imgItem.setAttribute('src', `../${elem.caminho_da_imagem}`);
        imgItem.setAttribute('alt', elem.descricao_produto);
        imgItem.setAttribute('class', 'img_carrinho');

        const divInfo = document.createElement('div');
        divInfo.setAttribute('class', 'info_carrinho');

        const h2Nome = document.createElement('h2');
        h2Nome.innerHTML = elem.descricao_produto;

        divInfo.appendChild(h2Nome);

        const spanValor = document.createElement('span');
        spanValor.setAttribute('class', 'valor_carrinho');
        spanValor.innerHTML = formatarPreco(elem.valor_unitario);

        const btnRemover = document.createElement('button');
        btnRemover.setAttribute('class', 'btn_remover');
        btnRemover.innerHTML = 'Remover';

        // Cada botão "sabe" qual item remover pelo índice dele no array
        btnRemover.addEventListener('click', () => {
            removerItem(indice);
        });

        divItem.appendChild(imgItem);
        divItem.appendChild(divInfo);
        divItem.appendChild(spanValor);
        divItem.appendChild(btnRemover);

        listaCarrinho.appendChild(divItem);
    });

    valorTotal.innerHTML = formatarPreco(calcularTotal(carrinho));
}

// Lê a biblioteca (jogos já comprados) salva no localStorage
const pegarBiblioteca = () => {
    const bibliotecaSalva = localStorage.getItem('biblioteca');
    return bibliotecaSalva ? JSON.parse(bibliotecaSalva) : [];
}

// Salva a biblioteca atualizada no localStorage
const salvarBiblioteca = (biblioteca) => {
    localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
}

// Ao clicar em "Finalizar Compra": move os itens do carrinho para a biblioteca
btnFinalizar.addEventListener('click', () => {
    const carrinho = pegarCarrinho();

    if (carrinho.length === 0) return;

    const biblioteca = pegarBiblioteca();

    // Junta os jogos do carrinho com os que já estavam na biblioteca,
    // evitando duplicar caso o jogo já tenha sido comprado antes
    carrinho.forEach((jogo) => {
        const jaEstaNaBiblioteca = biblioteca.some(elem => elem.id === jogo.id);
        if (!jaEstaNaBiblioteca) {
            biblioteca.push(jogo);
        }
    });

    salvarBiblioteca(biblioteca);

    alert('Compra finalizada com sucesso! Os jogos já estão na sua Biblioteca.');
    localStorage.removeItem('carrinho'); // esvazia o carrinho
    renderizarCarrinho(); // atualiza a tela mostrando "carrinho vazio"
});

// Roda assim que a página carrega
renderizarCarrinho();