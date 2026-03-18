require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Livro = require('./models/Livro'); 

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://127.0.0.1:27017/myReadingDB";

mongoose.connect(uri)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.log("Erro MongoDB:", err));

app.get('/', (req, res) => {
    res.send('API do My Reading Journey rodando!');
});

app.post('/livros', async (req, res) => {
    try {
        const novoLivro = new Livro(req.body);
        await novoLivro.save();
        res.status(201).json(novoLivro);
    } catch (error) {
        res.status(400).json({ mensagem: "Erro ao cadastrar", erro: error.message });
    }
});

app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar", erro: error.message });
    }
});

app.put('/livros/:id', async (req, res) => {
    try {
        const { paginaAtual } = req.body;
        const livro = await Livro.findById(req.params.id);
        
        if (!livro) return res.status(404).json({ mensagem: "Livro não encontrado" });

        livro.paginaAtual = paginaAtual;
        await livro.save();
        
        res.json(livro);
    } catch (error) {
        res.status(400).json({ mensagem: "Erro ao atualizar", erro: error.message });
    }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        const livroDeletado = await Livro.findByIdAndDelete(req.params.id);
        if (!livroDeletado) return res.status(404).json({ mensagem: "Livro não encontrado" });
        
        res.json({ mensagem: "Livro removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao remover", erro: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});