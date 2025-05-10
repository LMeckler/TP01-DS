function carregar(){
    var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if(usuarioLogado && usuarioLogado.length > 0){
        // Tenta preencher pelo campo mais comum (login, usuario, nome, etc)
        var nome = usuarioLogado[0].login || usuarioLogado[0].usuario || usuarioLogado[0].nome || 'Usuário';
        $("#nomeUsuario").text(nome);
    } else {
        $("#nomeUsuario").text('Usuário');
    }
}

function alerta(){
    window.location.href = "Alerta.html";
}

function compras(){
    window.location.href = "Compra.html";
}