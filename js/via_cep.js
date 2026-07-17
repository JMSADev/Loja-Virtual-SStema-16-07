// ARQUIVO: js/via_cep.js

const inputCep = document.getElementById('cep');
const divEndereco = document.getElementById('div-dados-endereco');

// Campos de endereço
const inputLogradouro = document.getElementById('logradouro');
const inputBairro = document.getElementById('bairro');
const inputLocalidade = document.getElementById('localidade');
const inputUf = document.getElementById('uf');
const inputNumero = document.getElementById('num-residencia');

// Função para deixar apenas os números do CEP
const limparCep = (cep) => cep.replace(/\D/g, '');

const buscarCep = async () => {
    const cepValor = limparCep(inputCep.value);

    // Verifica se tem 8 números
    if (cepValor.length !== 8) {
        if (cepValor.length > 0) alert("CEP inválido! O CEP deve conter 8 números.");
        // Esconde a div novamente se o CEP for apagado/inválido
        divEndereco.classList.add('oculto');
        return;
    }

    try {
        // Mostra "Buscando..." enquanto a API não responde
        inputLogradouro.value = "Buscando...";
        inputBairro.value = "Buscando...";
        inputLocalidade.value = "Buscando...";
        inputUf.value = "...";
        
        // Remove a classe "oculto" para mostrar os campos para o usuário
        divEndereco.classList.remove('oculto');

        // Faz a consulta na API do ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cepValor}/json/`);
        const data = await response.json();

        // Se a API retornar erro (CEP não existe)
        if (data.erro) {
            alert("CEP não encontrado!");
            divEndereco.classList.add('oculto'); // Esconde a div de novo
            inputLogradouro.value = "";
            inputBairro.value = "";
            inputLocalidade.value = "";
            inputUf.value = "";
            return;
        }

        // Preenche os inputs com os dados retornados
        inputLogradouro.value = data.logradouro;
        inputBairro.value = data.bairro;
        inputLocalidade.value = data.localidade;
        inputUf.value = data.uf;

        // Foca automaticamente no campo número para o usuário só completar
        inputNumero.focus();

    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro na comunicação com o correio. Tente novamente mais tarde.");
        divEndereco.classList.add('oculto');
    }
};

// Quando o usuário clicar fora do campo CEP (ou apertar Tab), executa a busca
inputCep.addEventListener('blur', buscarCep);

// EXTRA: Para o botão "Limpar" esconder a div de endereço novamente
const btnLimpar = document.getElementById('btn-limpar');
if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
        divEndereco.classList.add('oculto');
    });
}