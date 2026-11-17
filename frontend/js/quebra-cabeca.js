/* ==========================================
   NOSSO PEQUENO UNIVERSO
   QUEBRA-CABEÇA DE CORAÇÃO
========================================== */

// ELEMENTOS DO JOGO

const tabuleiro = document.getElementById("tabuleiro");

const contadorMovimentos = document.getElementById("movimentos");

const pecasCorretas = document.getElementById("pecasCorretas");

const mensagemStatus = document.getElementById("mensagemStatus");

const mensagemFinal = document.getElementById("mensagemFinal");

const botaoEmbaralhar = document.getElementById("botaoEmbaralhar");

const botaoDica = document.getElementById("botaoDica");

const botaoDesfazer = document.getElementById("botaoDesfazer");

const botaoProximaPagina = document.getElementById("botaoProximaPagina");

// ELEMENTOS DA ENTRADA

const entradaPuzzle = document.getElementById("entradaPuzzle");

const botaoDescobrir = document.getElementById("botaoDescobrir");

// VARIÁVEIS

let ordem = [];

let movimentos = 0;

let selecionada = null;

let concluido = false;

let historico = [];


/* ==========================================
   ANIMAÇÃO DE ENTRADA
========================================== */
botaoDescobrir.addEventListener("click", () => {

    botaoDescobrir.disabled = true;

    botaoDescobrir.innerHTML = "Preparando nossa surpresa... ♡";

    // Libera a página do jogo
    document.body.classList.add("jogo-liberado");

    // Ativa a animação inicial das peças
    document.body.classList.add("animando-pecas");

    entradaPuzzle.classList.add("saindo");

    setTimeout(() => {

        entradaPuzzle.style.display = "none";

    }, 1100);

    // Depois da entrada, remove a classe de animação
    setTimeout(() => {

        document.body.classList.remove("animando-pecas");

    }, 2200);

});


/* ==========================================
   EMBARALHAR AS PEÇAS
========================================== */

function embaralharPecas() {

    do {
        ordem = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        for (let i = ordem.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [ordem[i], ordem[j]] = [ordem[j], ordem[i]];

        }

    } while (calcularTrocasMinimas(ordem) < 3 || calcularTrocasMinimas(ordem) > 5);

    movimentos = 0;

    selecionada = null;

    concluido = false;

    historico = [];

    mensagemFinal.hidden = true;

    tabuleiro.classList.remove("concluido");

    mensagemStatus.textContent =
        "Cada peça tem seu lugar. Vamos descobrir? 💗";

    botaoEmbaralhar.textContent = "Embaralhar novamente";

    atualizarMovimentos();

    desenharTabuleiro();

    atualizarControles();

}

function calcularTrocasMinimas(pecas) {

    const visitadas = new Set();
    let ciclos = 0;

    for (let inicio = 0; inicio < pecas.length; inicio++) {

        if (visitadas.has(inicio)) {
            continue;
        }

        ciclos++;
        let atual = inicio;

        while (!visitadas.has(atual)) {
            visitadas.add(atual);
            atual = pecas[atual];
        }
    }

    return pecas.length - ciclos;
}


/* ==========================================
   DESENHAR TABULEIRO
========================================== */

function desenharTabuleiro() {

    tabuleiro.innerHTML = "";

    ordem.forEach((numero, indice) => {

        const peca = document.createElement("button");

        peca.type = "button";

        peca.classList.add("peca");

        const estaCorreta = numero === indice;

        if (estaCorreta) {
            peca.classList.add("correta");
        }

        peca.setAttribute(
            "aria-label",
            `Peça ${numero + 1}${estaCorreta ? ", no lugar correto" : ""}`
        );

        peca.setAttribute("aria-pressed", selecionada === indice);

        // POSIÇÃO ORIGINAL DA IMAGEM

        const coluna = numero % 3;

        const linha = Math.floor(numero / 3);

        const posicaoX = coluna * 50;

        const posicaoY = linha * 50;

        peca.style.backgroundPosition =
            `${posicaoX}% ${posicaoY}%`;

        // DESTAQUE DA PEÇA SELECIONADA

        if (selecionada === indice) {

            peca.classList.add("selecionada");

        }

        peca.disabled = concluido;

        peca.addEventListener("click", () => {

            selecionarPeca(indice);

        });

        tabuleiro.appendChild(peca);

    });

    atualizarProgresso();

}


/* ==========================================
   SELECIONAR E TROCAR PEÇAS
========================================== */

function selecionarPeca(indice) {

    if (concluido) {
        return;
    }

    // PRIMEIRA PEÇA SELECIONADA

    if (selecionada === null) {

        selecionada = indice;

        mensagemStatus.textContent =
            "Agora escolha a segunda peça para trocar. 💕";

        desenharTabuleiro();

        return;
    }

    // CLICOU NA MESMA PEÇA

    if (selecionada === indice) {

        selecionada = null;

        mensagemStatus.textContent =
            "Escolha duas peças para trocar de lugar. 💗";

        desenharTabuleiro();

        return;
    }

    // TROCAR POSIÇÃO DAS DUAS PEÇAS

    const primeira = selecionada;

    const segunda = indice;

    historico.push([...ordem]);

    [ordem[primeira], ordem[segunda]] =
        [ordem[segunda], ordem[primeira]];

    registrarMovimento();

}

function registrarMovimento() {

    movimentos++;
    selecionada = null;

    atualizarMovimentos();
    verificarConclusao();
    desenharTabuleiro();
    atualizarControles();

    if (!concluido) {
        mensagemStatus.textContent =
            "Boa! As peças corretas estão destacadas. Continue assim. 💗";
    }
}


/* ==========================================
   ATUALIZAR CONTADOR
========================================== */

function atualizarMovimentos() {

    contadorMovimentos.textContent = movimentos;

}


/* ==========================================
   ATUALIZAR PROGRESSO
========================================== */

function atualizarProgresso() {

    const quantidadeCorreta = ordem.filter(
        (peca, indice) => peca === indice
    ).length;

    pecasCorretas.textContent =
        `${quantidadeCorreta}/9`;

}


/* ==========================================
   VERIFICAR CONCLUSÃO
========================================== */

function verificarConclusao() {

    concluido = ordem.every(
        (peca, indice) => peca === indice
    );

    tabuleiro.classList.toggle("concluido", concluido);
    mensagemFinal.hidden = !concluido;
    botaoEmbaralhar.textContent = concluido
        ? "Jogar novamente"
        : "Embaralhar novamente";

    if (concluido) {
        mensagemStatus.textContent =
            "Você conseguiu montar nosso coração! ❤️";
    }

}

function atualizarControles() {
    botaoDesfazer.disabled = historico.length === 0;
    botaoDica.disabled = concluido;
}


/* ==========================================
   BOTÃO EMBARALHAR NOVAMENTE
========================================== */

botaoEmbaralhar.addEventListener("click", () => {

    embaralharPecas();

});

botaoDica.addEventListener("click", () => {

    if (concluido) {
        return;
    }

    const posicaoErrada = ordem.findIndex(
        (peca, indice) => peca !== indice
    );
    const posicaoDaPecaCerta = ordem.indexOf(posicaoErrada);

    if (posicaoErrada === -1 || posicaoDaPecaCerta === -1) {
        verificarConclusao();
        atualizarControles();
        return;
    }

    historico.push([...ordem]);
    [ordem[posicaoErrada], ordem[posicaoDaPecaCerta]] =
        [ordem[posicaoDaPecaCerta], ordem[posicaoErrada]];

    registrarMovimento();

    if (!concluido) {
        mensagemStatus.textContent =
            "Dica aplicada: uma peça foi colocada no lugar certo. 💕";
    }
});

botaoDesfazer.addEventListener("click", () => {

    const ordemAnterior = historico.pop();

    if (!ordemAnterior) {
        return;
    }

    ordem = ordemAnterior;
    movimentos = Math.max(0, movimentos - 1);
    selecionada = null;

    atualizarMovimentos();
    verificarConclusao();
    desenharTabuleiro();
    atualizarControles();

    mensagemStatus.textContent = concluido
        ? "Última jogada desfeita. O quebra-cabeça continua resolvido! ❤️"
        : "Última troca desfeita. Você pode tentar de novo. 💗";
});


/* ==========================================
   IR PARA A PRÓXIMA PÁGINA
========================================== */

botaoProximaPagina.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});


/* ==========================================
   INICIAR JOGO
========================================== */

embaralharPecas();