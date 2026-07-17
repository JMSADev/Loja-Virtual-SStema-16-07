// ARQUIVO: js/login.js

const formEntrar = document.getElementById('form-entrar');
const inputCpf = document.getElementById('cpf-entrar');
const inputSenha = document.getElementById('senha-entrar');
const mensagemErro = document.getElementById('erro-entrar');

const areaFormularios = document.getElementById('area-formularios');
const divJaLogado = document.getElementById('ja-logado');
const nomeUsuarioLogado = document.getElementById('nome-usuario-logado');
const btnSair = document.getElementById('btn-sair');
const btnIrLoja = document.getElementById('btn-ir-loja');

// Verifica se já tem alguém logado
const verificarLogin = () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado) {
        areaFormularios.style.display = 'none';
        divJaLogado.style.display = 'block';
        nomeUsuarioLogado.innerHTML = usuarioLogado.nome;
    } else {
        areaFormularios.style.display = 'block';
        divJaLogado.style.display = 'none';
    }
}

// Executa a verificação ao abrir a página
verificarLogin();

// Evento de Login
if (formEntrar) {
    formEntrar.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const cpfDigitado = inputCpf.value;
        const senhaDigitada = inputSenha.value;

        // Puxa os usuários do localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Procura se existe um usuário com esse CPF e Senha
        const usuarioValido = usuarios.find(
            usuario => usuario.cpf === cpfDigitado && usuario.senha === senhaDigitada
        );

        if (usuarioValido) {
            // Salva a sessão do usuário
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));
            mensagemErro.innerHTML = "";
            alert(`Bem-vindo(a), ${usuarioValido.nome}!`);
            
            // Redireciona para a loja (index.html)
            window.location.href = '../index.html';
        } else {
            // Mostra erro caso esteja incorreto
            mensagemErro.innerHTML = "CPF ou senha incorretos!";
        }
    });
}

// Botão Sair da Conta
if (btnSair) {
    btnSair.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        verificarLogin(); // Atualiza a tela para mostrar o formulário de novo
    });
}

// Botão Ir para Loja
if (btnIrLoja) {
    btnIrLoja.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}