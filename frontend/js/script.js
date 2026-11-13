
/* ==========================================
   NOSSO PEQUENO UNIVERSO
   LINDOMAR ♡ HELOISA

   ANIMAÇÃO CINEMATOGRÁFICA
========================================== */

/* ==========================================
   CANVAS DO CORAÇÃO
========================================== */

const canvas = document.getElementById("coracaoCanvas");
const ctx = canvas.getContext("2d");

const LARGURA = 700;
const ALTURA = 360;

let particulas = [];

let pontosCoracao = [];
let pontosLogo = [];

let fase = "coracao";
let inicioAnimacao = performance.now();

/* ==========================================
   CANVAS DE TELA CHEIA
========================================== */

const efeitosCanvas = document.getElementById("efeitosCanvas");
const efeitoCtx = efeitosCanvas.getContext("2d");

let larguraTela = window.innerWidth;
let alturaTela = window.innerHeight;

let particulasEntrada = [];

const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* ==========================================
   CONFIGURAR CANVAS DO CORAÇÃO
========================================== */

function configurarCanvas() {

    const escala = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = LARGURA * escala;
    canvas.height = ALTURA * escala;

    ctx.setTransform(
        escala,
        0,
        0,
        escala,
        0,
        0
    );
}

/* ==========================================
   CONFIGURAR CANVAS DE TELA CHEIA
========================================== */

function configurarEfeitosCanvas() {

    const escala = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    larguraTela = window.innerWidth;
    alturaTela = window.innerHeight;

    efeitosCanvas.width = larguraTela * escala;
    efeitosCanvas.height = alturaTela * escala;

    efeitoCtx.setTransform(
        escala,
        0,
        0,
        escala,
        0,
        0
    );
}

/* ==========================================
   DESENHAR CORAÇÃO
========================================== */

function desenharCoracao(
    contexto,
    x,
    y,
    tamanho,
    preenchido = true
) {

    contexto.beginPath();

    contexto.moveTo(
        x,
        y + tamanho * 0.35
    );

    contexto.bezierCurveTo(
        x - tamanho * 1.2,
        y - tamanho * 0.35,

        x - tamanho * 0.9,
        y - tamanho * 1.05,

        x,
        y - tamanho * 0.45
    );

    contexto.bezierCurveTo(
        x + tamanho * 0.9,
        y - tamanho * 1.05,

        x + tamanho * 1.2,
        y - tamanho * 0.35,

        x,
        y + tamanho * 0.35
    );

    contexto.closePath();

    if (preenchido) {
        contexto.fill();
    } else {
        contexto.stroke();
    }
}

/* ==========================================
   GERAR PONTOS DO CORAÇÃO E LOGOTIPO
========================================== */

function obterPontos(tipo) {

    const tela = document.createElement("canvas");

    tela.width = LARGURA;
    tela.height = ALTURA;

    const desenho = tela.getContext("2d");

    desenho.fillStyle = "#ffffff";
    desenho.strokeStyle = "#ffffff";
    desenho.lineWidth = 9;
    desenho.lineJoin = "round";
    desenho.lineCap = "round";

    if (tipo === "coracao") {

        desenharCoracao(
            desenho,
            350,
            180,
            105,
            true
        );
    }

    if (tipo === "logo") {

        // LETRA L

        desenho.font = "bold 190px Georgia";
        desenho.textAlign = "center";
        desenho.textBaseline = "middle";

        desenho.fillText(
            "L",
            135,
            175
        );

        // CORAÇÃO NO CENTRO

        desenho.strokeStyle = "#ffffff";
        desenho.lineWidth = 8;

        desenharCoracao(
            desenho,
            350,
            175,
            65,
            false
        );

        // LETRA H

        desenho.font = "bold 190px Georgia";

        desenho.fillText(
            "H",
            565,
            175
        );
    }

    const dados = desenho.getImageData(
        0,
        0,
        LARGURA,
        ALTURA
    ).data;

    const pontos = [];

    for (let y = 0; y < ALTURA; y += 4) {

        for (let x = 0; x < LARGURA; x += 4) {

            const indice = (y * LARGURA + x) * 4;

            if (dados[indice + 3] > 100) {

                pontos.push({
                    x,
                    y
                });
            }
        }
    }

    return pontos;
}

/* ==========================================
   CRIAR PARTÍCULAS DO CORAÇÃO
========================================== */

function criarParticulas() {

    pontosCoracao = obterPontos("coracao");
    pontosLogo = obterPontos("logo");

    const quantidade = Math.max(
        pontosCoracao.length,
        pontosLogo.length
    );

    particulas = [];

    for (let i = 0; i < quantidade; i++) {

        const indiceCoracao = Math.floor(
            i * pontosCoracao.length / quantidade
        );

        const indiceLogo = Math.floor(
            i * pontosLogo.length / quantidade
        );

        const coracao = pontosCoracao[indiceCoracao];
        const logo = pontosLogo[indiceLogo];

        particulas.push({

            x: Math.random() * LARGURA,
            y: Math.random() * ALTURA,

            coracaoX: coracao.x,
            coracaoY: coracao.y,

            logoX: logo.x,
            logoY: logo.y,

            tamanho: Math.random() * 1.8 + 1,

            brilho: Math.random() * Math.PI * 2,

            velocidade: Math.random() * 0.025 + 0.035

        });
    }
}

/* ==========================================
   DESENHAR PARTÍCULA DO CORAÇÃO
========================================== */

function desenharParticula(p) {

    p.brilho += 0.035;

    const luminosidade =
        0.65 + Math.sin(p.brilho) * 0.35;

    const verde = Math.floor(
        105 + luminosidade * 75
    );

    const azul = Math.floor(
        165 + luminosidade * 65
    );

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        p.tamanho,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(255, ${verde}, ${azul}, ${luminosidade})`;

    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff4f9b";

    ctx.fill();
}

/* ==========================================
   ANIMAÇÃO DO CORAÇÃO
========================================== */

function animarCoracao(tempo) {

    ctx.clearRect(
        0,
        0,
        LARGURA,
        ALTURA
    );

    const segundos =
        (tempo - inicioAnimacao) / 1000;

    // DEPOIS DE 5 SEGUNDOS:
    // CORAÇÃO SE TRANSFORMA EM L ♡ H

    if (segundos >= 5 && fase === "coracao") {

        fase = "logo";
    }

    const pulsacao =
        1 + Math.sin(tempo / 230) * 0.045;

    particulas.forEach((p) => {

        let destinoX;
        let destinoY;

        if (fase === "coracao") {

            destinoX =
                350 + (p.coracaoX - 350) * pulsacao;

            destinoY =
                180 + (p.coracaoY - 180) * pulsacao;

        } else {

            destinoX = p.logoX;
            destinoY = p.logoY;
        }

        p.x +=
            (destinoX - p.x) * p.velocidade;

        p.y +=
            (destinoY - p.y) * p.velocidade;

        desenharParticula(p);

    });

    ctx.shadowBlur = 0;

    requestAnimationFrame(animarCoracao);
}

/* ==========================================
   CRIAR PARTÍCULAS QUE VÊM DOS LADOS
========================================== */

function criarParticulasEntrada() {

    const quantidade = movimentoReduzido ? 15 : 150;

    particulasEntrada = [];

    for (let i = 0; i < quantidade; i++) {

        const lado = Math.floor(Math.random() * 4);

        let x;
        let y;

        // NASCEM NAS QUATRO EXTREMIDADES

        if (lado === 0) {
            x = Math.random() * larguraTela;
            y = -20;
        }

        else if (lado === 1) {
            x = larguraTela + 20;
            y = Math.random() * alturaTela;
        }

        else if (lado === 2) {
            x = Math.random() * larguraTela;
            y = alturaTela + 20;
        }

        else {
            x = -20;
            y = Math.random() * alturaTela;
        }

        particulasEntrada.push({

            x,
            y,

            destinoX: larguraTela / 2,
            destinoY: alturaTela / 2,

            velocidade: Math.random() * 0.018 + 0.008,

            tamanho: Math.random() * 2.5 + 0.8,

            brilho: Math.random() * Math.PI * 2,

            cor: Math.random() > 0.5
                ? "#ff72ac"
                : "#ffd6e6",

            chegou: false,

            deslocamento: Math.random() * 20

        });
    }
}

/* ==========================================
   ANIMAÇÃO DAS LUZES EM TELA CHEIA
========================================== */

function animarEfeitos() {

    efeitoCtx.clearRect(
        0,
        0,
        larguraTela,
        alturaTela
    );

    particulasEntrada.forEach((p) => {

        p.brilho += 0.04;

        if (!p.chegou) {

            const dx = p.destinoX - p.x;
            const dy = p.destinoY - p.y;

            p.x += dx * p.velocidade;
            p.y += dy * p.velocidade;

            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                p.chegou = true;
            }

        } else {

            // DEPOIS DE CHEGAR AO CENTRO,
            // A PARTÍCULA CONTINUA FLUTUANDO

            p.x += Math.sin(p.brilho) * 0.25;
            p.y += Math.cos(p.brilho) * 0.25;
        }

        const luminosidade =
            0.45 + Math.sin(p.brilho) * 0.4;

        // RASTRO DE LUZ

        efeitoCtx.beginPath();

        efeitoCtx.moveTo(
            p.x,
            p.y
        );

        efeitoCtx.lineTo(
            p.x - (p.destinoX - p.x) * 0.08,
            p.y - (p.destinoY - p.y) * 0.08
        );

        efeitoCtx.strokeStyle =
            p.cor + "99";

        efeitoCtx.lineWidth = 1;

        efeitoCtx.stroke();

        // PONTO LUMINOSO

        efeitoCtx.beginPath();

        efeitoCtx.arc(
            p.x,
            p.y,
            p.tamanho,
            0,
            Math.PI * 2
        );

        efeitoCtx.fillStyle = p.cor;

        efeitoCtx.globalAlpha = luminosidade;

        efeitoCtx.shadowBlur = 15;
        efeitoCtx.shadowColor = p.cor;

        efeitoCtx.fill();

        efeitoCtx.globalAlpha = 1;

    });

    efeitoCtx.shadowBlur = 0;

    requestAnimationFrame(animarEfeitos);
}

/* ==========================================
   BOTÃO DE ENTRADA
========================================== */

const botao = document.getElementById("botaoEntrar");

botao.addEventListener("click", function () {

    if (botao.disabled) {
        return;
    }

    botao.disabled = true;

    botao.innerHTML =
        "Preparando nossa surpresa ♥";

    botao.classList.add("botao-clicado");

    document.body.classList.add("saindo");

    setTimeout(() => {

        window.location.href = "quebra-cabeca.html";

    }, 1100);

});

/* ==========================================
   INICIALIZAÇÃO
========================================== */

configurarCanvas();

configurarEfeitosCanvas();

criarParticulas();

criarParticulasEntrada();

requestAnimationFrame(animarCoracao);

requestAnimationFrame(animarEfeitos);

/* ==========================================
   REDIMENSIONAR A TELA
========================================== */

window.addEventListener("resize", () => {

    configurarCanvas();

    configurarEfeitosCanvas();

    criarParticulasEntrada();

});
