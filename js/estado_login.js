// ARQUIVO: js/estado_login.js

const atualizarCabecalho = () => {
    // Busca os dados de quem está logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const spanNomeHeader = document.getElementById('nome-header');
    
    // Só tenta alterar se a página atual tiver o span no HTML
    if (spanNomeHeader) {
        if (usuarioLogado) {
            // Pega o nome completo e divide pelos espaços
            const partesNome = usuarioLogado.nome.trim().split(' ');
            
            // Pega a primeira palavra
            const primeiroNome = partesNome[0];
            
            // Pega a última palavra (só se a pessoa tiver digitado mais de um nome)
            const ultimoNome = partesNome.length > 1 ? partesNome[partesNome.length - 1] : '';
            
            // Junta o primeiro e o último e joga na tela
            spanNomeHeader.innerHTML = `${primeiroNome} ${ultimoNome}`;
        } else {
            // Se não tiver logado, deixa em branco
            spanNomeHeader.innerHTML = "";
        }
    }
}

// Executa assim que o arquivo é carregado pelo navegador
atualizarCabecalho();