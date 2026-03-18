const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    totalPaginas: { type: Number, required: true },
    paginaAtual: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['Quero Ler', 'Lendo', 'Lido'], 
        default: 'Quero Ler' 
    },
    dataInicio: { type: Date, default: Date.now },
    ultimaAtualizacao: { type: Date, default: Date.now }
}, {
    versionKey: false
});

livroSchema.pre('save', function() {
    if (this.paginaAtual >= this.totalPaginas) {
        this.status = 'Lido';
    } else if (this.paginaAtual > 0) {
        this.status = 'Lendo';
    }
    this.ultimaAtualizacao = Date.now();
});

livroSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        
        ret.dataInicio = new Date(ret.dataInicio).toLocaleDateString('pt-BR');
        ret.ultimaAtualizacao = new Date(ret.ultimaAtualizacao).toLocaleDateString('pt-BR');

        const progresso = (ret.paginaAtual / ret.totalPaginas) * 100;
        ret.progresso = `${Math.round(progresso)}%`;
    }
});

module.exports = mongoose.model('Livro', livroSchema);