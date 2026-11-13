
const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Permite receber dados em JSON
app.use(express.json());

// Caminho da pasta frontend
const frontendPath = path.join(__dirname, "..", "frontend");

// Disponibiliza HTML, CSS, JS, imagens e músicas
app.use(express.static(frontendPath));

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Verificar se o servidor está funcionando
app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        mensagem: "Nosso site está funcionando!",
        porta: PORT
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log(" NOSSO PEQUENO UNIVERSO ❤️");
    console.log("------------------------------------");
    console.log(`Servidor rodando: http://localhost:${PORT}`);
    console.log("Servidor iniciado com sucesso!");
});
