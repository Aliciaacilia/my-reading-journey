require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Pega a URI do arquivo .env ou usa a string direta se o .env falhar
const uri = process.env.MONGO_URI || "mongodb+srv://Aliciaacilia:alicia123@my-reading-journey.qpyi3c4.mongodb.net/myReadingDB?retryWrites=true&w=majority";

// Conexão com o MongoDB
mongoose.connect(uri)
    .then(() => console.log("Conectado ao MongoDB com sucesso!"))
    .catch(err => console.log("Erro ao conectar ao MongoDB:", err));

// Rota de teste inicial
app.get('/', (req, res) => {
    res.send('API do My Reading Journey rodando!');
});

// Definir a porta do servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});