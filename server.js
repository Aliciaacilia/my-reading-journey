const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.static('public'));




let livros = [];


app.get('/livros', (req, res) => {
    res.json(livros);
});


app.post('/livros', (req, res) => {
    const novoLivro = { ...req.body, _id: Date.now().toString() };
    livros.push(novoLivro);
    res.status(201).json(novoLivro);
});


app.delete('/livros/:id', (req, res) => {
    livros = livros.filter(l => l._id !== req.params.id);
    res.status(204).send();
});




app.listen(5000, () => console.log('Servidor rodando na porta 5000'));