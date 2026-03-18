const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    paginasTotais: { type: Number, required: true },
    paginaAtual: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['Quero Ler', 'Lendo', 'Lido'], 
        default: 'Quero Ler' 
    },
    dataInicio: { type: Date, default: Date.now },
    ultimaAtualizacao: { type: Date, default: Date.now }
});

// Lógica automática: se a página atual chegar no total, muda o status para "Lido"
livroSchema.pre('save', function(next) {
    if (this.paginaAtual >= this.paginasTotais) {
        this.status = 'Lido';
    } else if (this.paginaAtual > 0) {
        this.status = 'Lendo';
    }
    this.ultimaAtualizacao = Date.now();
    next();
});

module.exports = mongoose.model('Livro', livroSchema);