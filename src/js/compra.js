function carregar() {
    if (!localStorage.usuarioCompras) {
        usuarioCompras = [];
        localStorage.setItem('usuarioCompras', JSON.stringify(usuarioCompras));
    }
    exibirTabela();
}

function exibirTabela() {
    var compras = JSON.parse(localStorage.getItem('usuarioCompras'));
    var tabela = $("#tabelaCompras");
    apagarLinhas(tabela);
    compras.forEach(compra => {
        adicionarLinha(tabela, compra);
    });
}

function apagarLinhas(tabela) {
    var corpoTabela = $(tabela).find("tbody");
    corpoTabela.empty();
}

function adicionarLinha(tabela, compra) {
    var corpoTabela = $(tabela).find("tbody");
    var novaLinha = $("<tr></tr>");

    var colunaProduto = $("<td></td>").text(compra.descricao);
    colunaProduto.appendTo(novaLinha);

    var colunaValor = $("<td></td>").text(compra.valor);
    colunaValor.appendTo(novaLinha);

    var colunaData = $("<td></td>").text(compra.data || '');
    colunaData.appendTo(novaLinha);

    var colunaHora = $("<td></td>").text(compra.hora || '');
    colunaHora.appendTo(novaLinha);

    var colunaVisualizar = $("<td></td>").addClass("d-flex justify-content-end");
    var visualizar = $("<button></button>")
        .addClass("btn btn-verde")
        .attr("id", compra.id)
        .attr("onclick", "visualizarProduto(this.id)")
        .html('<i class="bi bi-eye"></i>');
    visualizar.appendTo(colunaVisualizar);
    colunaVisualizar.appendTo(novaLinha);

    novaLinha.appendTo(corpoTabela);
}

function visualizarProduto(id) {
    var compras = JSON.parse(localStorage.getItem('usuarioCompras'));
    var produto = compras.find(compra => compra.id == id || compra.id == parseInt(id));

    var janelaFlutuante = $("#modalDetalhe");

    if (produto) {
        janelaFlutuante.find("h2").text(produto.descricao || produto.nome || 'Produto');
        $("#imagemDetalhe").attr("src", produto.urlImagem || produto.imagem || '').attr("style", "width: 30%;");
        janelaFlutuante.css("display", "block");
    } else {
        alert("Produto não encontrado.");
    }
}

function fecharJanelaFlutuante() {
    var janelaFlutuante = $("#modalDetalhe");
    janelaFlutuante.css("display", "none");
    janelaFlutuante.find("h2").text("");
    janelaFlutuante.find("img").attr("src", "").attr("style", "width: 0;");
}
