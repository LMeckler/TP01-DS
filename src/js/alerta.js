var usuarioLogado = null;
var usuarioCompras;
var intervalId;
var produto;
var valor;
var monitorando = false;

$(document).ready(function () {
    $("#formulario").validate({
        rules: {
            valor: {
                required: true,
            }
        },
        messages: {
            valor: {
                required: "Campo obrigatório",
            }
        }
    });

    $("#item, #tipoAcao").on("change", function () {
        if (monitorando) {
            monitorando = false;
            clearTimeout(intervalId);
            $("#btnIniciar").text("Iniciar").removeClass("btn-vermelho").addClass("btn-verde");
        }
    });

    $("#preco").on("change", function () {
        if (monitorando) {
            valor = parseFloat($(this).val());
        }
    });
});

function carregar() {
    usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (localStorage.usuarioCompras) {
        usuarioCompras = JSON.parse(localStorage.getItem('usuarioCompras'));
    } else {
        usuarioCompras = [];
        localStorage.setItem('usuarioCompras', JSON.stringify(usuarioCompras));
    }

    retornaOsProdutos();
}

async function retornaOsProdutos() {
    try {
        var chave = usuarioLogado[0].chave || usuarioLogado[0].login || usuarioLogado[0].usuario;
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${chave}/usuario`)
        const produtos = await resposta.json();
        $("#item").empty();
        $("#item").append('<option value="0" disabled selected>Escolha o item</option>');
        produtos.forEach(p => {
            $("#item").append(`<option value="${p.id}">${p.descricao}</option>`);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function carregarSelect(produtos) {
    $("#produto").append(
        `<option value="${produtos.id}">${produtos.descricao}</option>`
    );
}

function iniciar() {
    if (!$("#formMonitor").valid()) {
        return;
    }
    var acao = $("#tipoAcao").val();
    if (acao == 1) {
        if (monitorando) {
            monitorando = false;
            clearTimeout(intervalId);
            $("#btnIniciar").text("INICIAR").removeClass("btn-vermelho").addClass("btn-verde");
        } else {
            produto = $("#item").val();
            valor = parseFloat($("#preco").val());
            monitorando = true;
            $("#btnIniciar").text("PARAR").removeClass("btn-verde").addClass("btn-vermelho");
            iniciarTemporizador();
        }
    } else if (acao == 2) {
        if (monitorando) {
            monitorando = false;
            clearTimeout(intervalId);
            $("#btnIniciar").text("INICIAR").removeClass("btn-vermelho").addClass("btn-verde");
        } else {
            produto = $("#item").val();
            valor = parseFloat($("#preco").val());
            monitorando = true;
            $("#btnIniciar").text("PARAR").removeClass("btn-verde").addClass("btn-vermelho");
            iniciarTemporizadorCompra();
        }
    }
}

async function iniciarTemporizadorCompra() {
    if (!monitorando) return;
    clearTimeout(intervalId);
    intervalId = setTimeout(realizarCompra, 5000); // 5 segundos
}

async function iniciarTemporizador() {
    if (!monitorando) return;
    clearTimeout(intervalId);
    intervalId = setTimeout(alerta, 5000); // 5 segundos
}

async function alerta() {
    if (!monitorando) return;
    try {
        var chave = usuarioLogado[0].chave;
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${chave}/usuario`)
        const produtos = await resposta.json();

        var produtoSelecionado = produtos.find(p => p.id == produto || p.id == parseInt(produto));
        if (produtoSelecionado) {
            if (produtoSelecionado.valor <= valor) {
                Swal.fire({
                    icon: 'info',
                    title: '🎉 Ótima notícia!',
                    text: 'Produto abaixo ou igual ao valor desejado!',
                    showCancelButton: true,
                    confirmButtonText: 'Comprar',
                    cancelButtonText: 'Continuar monitorando',
                    customClass: {
                        confirmButton: 'btn btn-verde',
                        cancelButton: 'btn btn-vermelho'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        monitorando = false;
                        clearTimeout(intervalId);
                        $("#btnIniciar").text("Iniciar").removeClass("btn-vermelho").addClass("btn-verde");
                        // Adiciona ao histórico de compras
                        if (!Array.isArray(usuarioCompras)) usuarioCompras = [];
                        var jaExiste = usuarioCompras.some(c => c.id == produtoSelecionado.id);
                        if (!jaExiste) {
                            var agora = new Date();
                            var data = agora.toLocaleDateString('pt-BR');
                            var hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            usuarioCompras.push({
                                id: produtoSelecionado.id,
                                descricao: produtoSelecionado.descricao,
                                valor: produtoSelecionado.valor,
                                urlImagem: produtoSelecionado.urlImagem || '',
                                data: data,
                                hora: hora
                            });
                            localStorage.setItem('usuarioCompras', JSON.stringify(usuarioCompras));
                        }

                        Swal.fire({
                            icon: 'success',
                            title: '🎉 Ótima notícia!',
                            text: 'Produto Comprado com valor abaixo ou igual ao desejado!',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-verde'
                            },
                            buttonsStyling: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                monitorando = false;
                                clearTimeout(intervalId);
                                $("#btnIniciar").text("Iniciar").removeClass("btn-vermelho").addClass("btn-verde");
                                // Salva a compra corretamente, sem duplicar produtos
                                if (!Array.isArray(usuarioCompras)) usuarioCompras = [];
                                // Verifica se o produto já está na lista de compras
                                var jaExiste = usuarioCompras.some(c => c.id == produtoSelecionado.id);
                                if (!jaExiste) {
                                    var agora = new Date();
                                    var data = agora.toLocaleDateString('pt-BR');
                                    var hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    usuarioCompras.push({
                                        id: produtoSelecionado.id,
                                        descricao: produtoSelecionado.descricao,
                                        valor: produtoSelecionado.valor,
                                        urlImagem: produtoSelecionado.urlImagem || '',
                                        data: data,
                                        hora: hora
                                    });
                                    localStorage.setItem('usuarioCompras', JSON.stringify(usuarioCompras));
                                }
                                window.location.href = "Compra.html";
                            }
                        });
                        
                    } else if (result.isDismissed) {
                        if (monitorando) iniciarTemporizador();
                    }
                });
            } else {
                if (monitorando) iniciarTemporizador();
            }
        } else {
            alert("Produto não encontrado!");
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        if (monitorando) iniciarTemporizador();
    }
}

function realizarCompra() {
    if (!monitorando) return;
    try {
        var chave = usuarioLogado[0].chave;
        fetch(`https://api-odinline.odiloncorrea.com/produto/${chave}/usuario`)
            .then(resposta => resposta.json())
            .then(produtos => {
                var produtoSelecionado = produtos.find(p => p.id == produto || p.id == parseInt(produto));
                if (produtoSelecionado) {
                    if (produtoSelecionado.valor <= valor) {
                        Swal.fire({
                            icon: 'success',
                            title: '🎉 Ótima notícia!',
                            text: 'Produto Comprado com valor abaixo ou igual ao desejado!',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-verde'
                            },
                            buttonsStyling: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                monitorando = false;
                                clearTimeout(intervalId);
                                $("#btnIniciar").text("Iniciar").removeClass("btn-danger").addClass("btn-verde");
                                // Salva a compra corretamente, sem duplicar produtos
                                if (!Array.isArray(usuarioCompras)) usuarioCompras = [];
                                // Verifica se o produto já está na lista de compras
                                var jaExiste = usuarioCompras.some(c => c.id == produtoSelecionado.id);
                                if (!jaExiste) {
                                    var agora = new Date();
                                    var data = agora.toLocaleDateString('pt-BR');
                                    var hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    usuarioCompras.push({
                                        id: produtoSelecionado.id,
                                        descricao: produtoSelecionado.descricao,
                                        valor: produtoSelecionado.valor,
                                        urlImagem: produtoSelecionado.urlImagem || '',
                                        data: data,
                                        hora: hora
                                    });
                                    localStorage.setItem('usuarioCompras', JSON.stringify(usuarioCompras));
                                }
                                window.location.href = "Compra.html";
                            }
                        });
                    } else {
                        alert("Produto acima do valor desejado!");
                    }
                } else {
                    alert("Produto não encontrado!");
                }
            });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}



