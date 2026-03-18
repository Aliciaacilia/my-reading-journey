const API_URL = 'http://localhost:5000/livros';

async function carregarLivros() {
    const grid = document.getElementById('estante-grid');
    try {
        const response = await fetch(API_URL);
        const livros = await response.json();
        grid.innerHTML = '';

        livros.forEach(livro => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const atual = Number(livro.paginaAtual) || 0;
            const total = Number(livro.totalPaginas) || 1;
            const porcentagem = Math.min(Math.round((atual / total) * 100), 100);

            card.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p>Autor: ${livro.autor} | Status: <strong>${livro.status}</strong></p>
                <p>Progresso: ${atual} / ${total} pág.</p>
                
                <div class="progress-bar-bg" style="background: #333; height: 12px; border-radius: 6px; margin: 10px 0; overflow: hidden;">
                    <div class="progress-bar-fill" style="background: #2ecc71; height: 100%; width: ${porcentagem}%; transition: 0.5s;"></div>
                </div>
                
                <p style="text-align:right; font-size:12px; color: #2ecc71; margin-bottom: 10px;">${porcentagem}% concluído</p>

                <div class="actions" style="display: flex; gap: 10px;">
                    <button onclick="atualizarProgresso('${livro.id}', ${atual})" style="flex:2; padding: 10px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Atualizar</button>
                    <button onclick="deletarLivro('${livro.id}')" style="flex:1; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Excluir</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error("Erro:", err);
    }
}

document.getElementById('livro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const novo = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        totalPaginas: Number(document.getElementById('totalPaginas').value),
        status: document.getElementById('status').value
    };
    await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(novo)
    });
    e.target.reset();
    carregarLivros();
});

async function atualizarProgresso(id, atual) {
    const novaPag = prompt("Página atual:", atual);
    if (novaPag === null) return;

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ paginaAtual: Number(novaPag) })
    });

    const data = await res.json();
    console.log("RESPOSTA:", data);

    if (res.ok) {
        carregarLivros();
    } else {
        alert("Erro ao atualizar");
    }
}

async function deletarLivro(id) {
    if (confirm("Excluir?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarLivros();
    }
}

carregarLivros();