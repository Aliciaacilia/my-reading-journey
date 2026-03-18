const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const uri = "mongodb://127.0.0.1:27017/myReadingDB";
mongoose.connect(uri)
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

const Livro = mongoose.model('Livro', {
    titulo: String,
    autor: String,
    totalPaginas: Number,
    paginaAtual: { type: Number, default: 0 },
    status: String
});


app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.post('/livros', async (req, res) => {
    try {
        const novoLivro = new Livro(req.body);
        await novoLivro.save();
        res.status(201).json(novoLivro);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        await Livro.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.listen(5000, () => console.log('🚀 Servidor rodando na porta 5000'));
app.put('/livros/:id', async (req, res) => {
    await Livro.findByIdAndUpdate(req.params.id, req.body);
    res.send();
});