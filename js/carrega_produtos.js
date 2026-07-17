// ARQUIVO: js/carrega_produtos.js

// IMPORTANDO O ARRAY DOS PRODUTOS
import { produtos } from "./produtos.js";

// PEGANDO ELEMENTO DO DOM
const section_cards = document.querySelector('#cards');

// CARRINHO — funções para salvar produtos no localStorage

// Pega o carrinho salvo no localStorage (ou um array vazio se ainda não existir nada)
const pegarCarrinho = () => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

// Salva o array do carrinho de volta no localStorage
// (JSON.stringify para transformar o array em texto)
const salvarCarrinho = (carrinho) => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Adiciona um produto ao carrinho e manda o usuário para a página do carrinho
const adicionarAoCarrinho = (produto) => {

    //  Ve se ta logado 
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert("Você precisa fazer login ou criar uma conta para comprar jogos!");
        window.location.href = 'paginas/login.html'; 
        return;
    }


    const carrinho = pegarCarrinho();

    // ve se o jogo ja esta no carrinho
    const jaEstaNoCarrinho = carrinho.some(elem => elem.id === produto.id);

    if (jaEstaNoCarrinho) {
        alert(`${produto.descricao_produto} já está no seu carrinho.`);
        window.location.href = 'paginas/carrinho.html';
        return;
    }

    carrinho.push(produto); // acrescenta o produto clicado na lista
    salvarCarrinho(carrinho);

    // Redireciona para a página do carrinho.
    window.location.href = 'paginas/carrinho.html';
}

// FUNÇÃO PARA MONTAR CARDS (coloquei ela mais pra cima para poder ser chamada pelas outras)
const montandoCards = (objProdutos) => {
    section_cards.innerHTML = '';

    objProdutos.forEach((elem, i) => {
        const divCard = document.createElement('div');
        divCard.setAttribute('class', 'card');

        const imgProduto = document.createElement('img');
        imgProduto.setAttribute('src', elem.caminho_da_imagem);
        imgProduto.setAttribute('alt', elem.descricao_produto);
        imgProduto.setAttribute('class', 'img_card');

        const h2Titulo = document.createElement('h2');
        h2Titulo.setAttribute('class', 'titulo_card');
        h2Titulo.innerHTML = elem.descricao_produto;

        const h3Valor = document.createElement('h3');
        h3Valor.setAttribute('class', 'valor_card');
        // Seu código incrível para formatar para reais:
        h3Valor.innerHTML = `R$ ${parseFloat(elem.valor_unitario).toFixed(2).replace('.', ',')}`;

        const btnCard = document.createElement('button');
        btnCard.setAttribute('class', 'btn_card');
        btnCard.innerHTML = 'Adicionar';

        // Ao clicar, chama a função que salva o produto no carrinho e redireciona
        btnCard.addEventListener('click', () => {
            adicionarAoCarrinho(elem);
        });

        divCard.appendChild(imgProduto);
        divCard.appendChild(h2Titulo);
        divCard.appendChild(h3Valor);
        divCard.appendChild(btnCard);

        section_cards.appendChild(divCard);
    });
};

// FUNÇÃO PARA CARREGAR TODOS OS PRODUTOS INICIALMENTE
const listarProdutos = () => {
    montandoCards(produtos); // Chama a função passando todos os produtos
}

listarProdutos();

// FILTRANDO AS SEÇÕES COM A COLEÇÃO map
const listarSecoes = () => {
    const secoesFiltrada = new Map();

    produtos.forEach((elem, i) => {
        secoesFiltrada.set(elem.id_secao, elem);
    });

    const secoesMenu = Array.from(secoesFiltrada.values());
    return secoesMenu;
}

// FILTRANDO PRODUTOS 
const produtosFiltrados = (idSecao) => {
    return produtos.filter(elem => elem.id_secao === idSecao);
}

// MONTANDO OS LINKS SEÇÕES
const montarSecoes = () => {
    const ulMenu = document.querySelector('#menu-secoes');
    
    // Trava de segurança caso o elemento menu-secoes ainda não exista no HTML
    if (!ulMenu) return; 

    ulMenu.innerHTML = '';

    // OPCIONAL: Criar um botão "Ver Todos" no menu
    const liTodos = document.createElement('li');
    const aTodos = document.createElement('a');
    aTodos.setAttribute('href', '#');
    aTodos.setAttribute('class', 'lnk-secao lnk_menu'); // Uso a sua classe lnk_menu pra ficar bonito
    aTodos.innerHTML = "Todos";
    aTodos.addEventListener('click', () => {
        listarProdutos();
    });
    liTodos.appendChild(aTodos);
    ulMenu.appendChild(liTodos);

    // PERCORRENDO O ARRAY DAS SEÇÕES FILTRADA
    listarSecoes().forEach((elem, i) => {
        const liSecao = document.createElement('li');
        const aSecao = document.createElement('a');
        aSecao.setAttribute('href', '#');
        aSecao.setAttribute('class', 'lnk-secao lnk_menu');
        aSecao.innerHTML = elem.nome_secao;

        aSecao.addEventListener('click', () => {
            montandoCards(produtosFiltrados(elem.id_secao));
        });

        liSecao.appendChild(aSecao);
        ulMenu.appendChild(liSecao);
    });
}

montarSecoes();

// ============================================
// PESQUISA — mostra o jogo enquanto o usuário digita
// ============================================

const campoPesquisa = document.querySelector('#campo-pesquisa');
const resultadoPesquisa = document.querySelector('#resultado-pesquisa');

// Remove acentos para a busca funcionar mesmo com "acao" vs "ação"
const normalizar = (texto) => {
    return texto
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

// Monta o dropdown com os resultados encontrados
const montarResultadoPesquisa = (termo) => {
    resultadoPesquisa.innerHTML = '';

    const termoNormalizado = normalizar(termo);

    const encontrados = produtos.filter(elem =>
        normalizar(elem.descricao_produto).includes(termoNormalizado)
    );

    if (encontrados.length === 0) {
        const divVazio = document.createElement('div');
        divVazio.setAttribute('class', 'sem-resultado');
        divVazio.innerHTML = `Nenhum jogo encontrado para "${termo}"`;
        resultadoPesquisa.appendChild(divVazio);
        resultadoPesquisa.classList.add('ativo');
        return;
    }

    encontrados.forEach((elem) => {
        const divItem = document.createElement('div');
        divItem.setAttribute('class', 'item-resultado');

        const imgItem = document.createElement('img');
        imgItem.setAttribute('src', elem.caminho_da_imagem);
        imgItem.setAttribute('alt', elem.descricao_produto);

        const divInfo = document.createElement('div');
        divInfo.setAttribute('class', 'item-resultado-info');

        const spanNome = document.createElement('span');
        spanNome.setAttribute('class', 'item-resultado-nome');
        spanNome.innerHTML = elem.descricao_produto;

        const spanPreco = document.createElement('span');
        spanPreco.setAttribute('class', 'item-resultado-preco');
        spanPreco.innerHTML = `R$ ${parseFloat(elem.valor_unitario).toFixed(2).replace('.', ',')}`;

        divInfo.appendChild(spanNome);
        divInfo.appendChild(spanPreco);

        divItem.appendChild(imgItem);
        divItem.appendChild(divInfo);

        // Ao clicar no resultado, mostra só aquele jogo nos cards
        divItem.addEventListener('click', () => {
            montandoCards([elem]);
            resultadoPesquisa.classList.remove('ativo');
            campoPesquisa.value = elem.descricao_produto;
        });

        resultadoPesquisa.appendChild(divItem);
    });

    resultadoPesquisa.classList.add('ativo');
}

// Digitando, o dropdown aparece com os jogos encontrados
campoPesquisa.addEventListener('input', () => {
    const termo = campoPesquisa.value.trim();

    if (termo === '') {
        resultadoPesquisa.classList.remove('ativo');
        resultadoPesquisa.innerHTML = '';
        listarProdutos();
        return;
    }

    montarResultadoPesquisa(termo);
});

// Fecha o dropdown ao clicar fora dele
document.addEventListener('click', (evento) => {
    const cliqueDentro = campoPesquisa.contains(evento.target) || resultadoPesquisa.contains(evento.target);
    if (!cliqueDentro) {
        resultadoPesquisa.classList.remove('ativo');
    }
});

// Reabre o dropdown se o campo já tiver texto e o usuário clicar nele de novo
campoPesquisa.addEventListener('focus', () => {
    if (campoPesquisa.value.trim() !== '') {
        montarResultadoPesquisa(campoPesquisa.value.trim());
    }
});