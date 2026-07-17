// ARQUIVO: js/cadastro.js

const formPessoa = document.getElementById('form-pessoa');

formPessoa.addEventListener('submit', (evento) => {
    // Impede a página de recarregar
    evento.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    // Pega a lista de usuários salvos (ou cria uma lista vazia se não existir)
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se o CPF já está cadastrado
    const cpfJaExiste = usuarios.some(usuario => usuario.cpf === cpf);
    if (cpfJaExiste) {
        alert("Este CPF já está cadastrado!");
        return;
    }

    // Salva o novo usuário na lista
    usuarios.push({ nome, cpf, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso! Faça seu login.");
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
});