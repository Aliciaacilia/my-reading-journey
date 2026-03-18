const API_URL = 'http://localhost:5000/livros';


async function carregarLivros() {
    const grid = document.getElementById('estante-grid');
    try {
        const response = await fetch(API_URL);
        const livros = await response.json();


        grid.innerHTML = '';


        if (livros.length === 0) {
            grid.innerHTML = '<p>Nenhum livro cadastrado ainda.</p>';
            return;
        }


        livros.forEach(livro => {
            const card = document.createElement('div');
            card.className = 'card';


            const progresso = Math.round((livro.paginaAtual / livro.totalPaginas) * 100) || 0;


            card.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Status:</strong> ${livro.status}</p>
                <p><strong>Progresso:</strong> ${livro.paginaAtual} / ${livro.totalPaginas} (${progresso}%)</p>
                <div style="background: #eee; height: 10px; border-radius: 5px;">
                    <div style="background: #2ecc71; height: 100%; width: ${progresso}%; border-radius: 5px;"></div>
                </div>
                <button class="btn-delete" onclick="deletarLivro('${livro._id}')">Remover</button>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao buscar livros:", error);
        grid.innerHTML = '<p>Erro ao conectar com o servidor.</p>';
    }
}


document.getElementById('livro-form').addEventListener('submit', async (e) => {
    e.preventDefault();


    const novoLivro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        totalPaginas: Number(document.getElementById('totalPaginas').value),
        paginaAtual: 0,
        status: document.getElementById('status').value
    };


    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoLivro)
        });


        if (response.ok) {
            e.target.reset();
            carregarLivros();
        }
    } catch (error) {
        alert("Erro ao salvar livro.");
    }
});


async function deletarLivro(id) {
    if (!confirm("Deseja mesmo remover este livro?")) return;


    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarLivros();
    } catch (error) {
        alert("Erro ao remover.");
    }
}


carregarLivros();