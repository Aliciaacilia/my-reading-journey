const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/myReadingDB")
    .then(() => console.log("✅ Conectado ao SEU MongoDB local"))
    .catch(err => console.log("❌ Erro: Verifique se o MongoDB Compass está aberto!", err));

const Livro = mongoose.model('Livro', {
    titulo: String,
    autor: String,
    totalPaginas: Number,
    paginaAtual: { type: Number, default: 0 },
    status: { type: String, default: 'Quero Ler' }
});

app.get('/livros', async (req, res) => {
    const livros = await Livro.find();
    res.json(livros);
});

app.post('/livros', async (req, res) => {
    const novo = new Livro(req.body);
    await novo.save();
    res.status(201).json(novo);
});

app.put('/livros/:id', async (req, res) => {
    try {
        const { paginaAtual } = req.body;
        // Busca no SEU banco pelo ID que você criou na SUA máquina
        const livro = await Livro.findById(req.params.id);
        
        if (!livro) return res.status(404).send("Livro não encontrado no seu banco local!");

        livro.paginaAtual = Number(paginaAtual);
        if (livro.paginaAtual >= livro.totalPaginas) {
            livro.status = "Lido";
            livro.paginaAtual = livro.totalPaginas;
        } else if (livro.paginaAtual > 0) {
            livro.status = "Lendo";
        }

        await livro.save();
        res.json(livro);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/livros/:id', async (req, res) => {
    await Livro.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(5000, () => console.log('🚀 Servidor rodando na porta 5000'));