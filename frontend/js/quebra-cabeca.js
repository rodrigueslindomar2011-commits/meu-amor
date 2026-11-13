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

const botaoProximaPagina = document.getElementById("botaoProximaPagina");

// ELEMENTOS DA ENTRADA

const entradaPuzzle = document.getElementById("entradaPuzzle");

const botaoDescobrir = document.getElementById("botaoDescobrir");

// VARIÁVEIS

let ordem = [];

let movimentos = 0;

let selecionada = null;

let concluido = false;


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

    ordem = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for (let i = ordem.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [ordem[i], ordem[j]] = [ordem[j], ordem[i]];

    }

    // EVITA COMEÇAR COM O QUEBRA-CABEÇA RESOLVIDO

    if (ordem.every((peca, indice) => peca === indice)) {

        [ordem[0], ordem[1]] = [ordem[1], ordem[0]];

    }

    movimentos = 0;

    selecionada = null;

    concluido = false;

    mensagemFinal.hidden = true;

    tabuleiro.classList.remove("concluido");

    mensagemStatus.textContent =
        "Cada peça tem seu lugar. Vamos descobrir? 💗";

    botaoEmbaralhar.textContent = "Embaralhar novamente";

    atualizarMovimentos();

    desenharTabuleiro();

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

        peca.setAttribute(
            "aria-label",
            `Peça ${numero + 1}`
        );

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

    [ordem[primeira], ordem[segunda]] =
        [ordem[segunda], ordem[primeira]];

    movimentos++;

    selecionada = null;

    atualizarMovimentos();

    desenharTabuleiro();

    verificarConclusao();

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

    const resolvido = ordem.every(
        (peca, indice) => peca === indice
    );

    if (resolvido) {

        concluido = true;

        tabuleiro.classList.add("concluido");

        mensagemStatus.textContent =
            "Você conseguiu montar nosso coração! ❤️";

        mensagemFinal.hidden = false;

        botaoEmbaralhar.textContent =
            "Jogar novamente";

    } else {

        mensagemStatus.textContent =
            "Muito bem! Continue encontrando os lugares certos. 💗";

    }

}


/* ==========================================
   BOTÃO EMBARALHAR NOVAMENTE
========================================== */

botaoEmbaralhar.addEventListener("click", () => {

    embaralharPecas();

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