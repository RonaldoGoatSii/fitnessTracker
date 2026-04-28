const contentorTreinos = document.getElementById("lista-treinos-api");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

function mostrarCarregamento() {
    if (!contentorTreinos) return;
    contentorTreinos.innerHTML = "<p style='text-align:center; opacity:0.7;'><em>Loading your workouts...</em></p>";
}

function carregarTreinos() {
    if (!contentorTreinos) return;

    mostrarCarregamento();

    fetch(urlAPI)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(treinos => {
            contentorTreinos.innerHTML = "";

            if (treinos.length === 0) {
                contentorTreinos.innerHTML = "<p style='text-align:center; opacity:0.5;'>No workouts found yet.</p>";
                return;
            }

            treinos.forEach(treino => {
                const item = document.createElement("li");
                item.className = "treino-item";

                let detalhes = [];
                if (treino.abs === "Sim") detalhes.push("Abs");
                if (treino.legs === "Sim") detalhes.push("Legs");
                if (treino.biceps === "Sim") detalhes.push("Biceps");
                if (treino.triceps === "Sim") detalhes.push("Triceps");

                item.innerHTML = `
                    <div class="info-treino">
                        <strong>${treino.training_list}</strong>
                        <small>${detalhes.join(" / ")}</small>
                        <span class="data-treino">${treino.date || ''}</span>
                    </div>
                    <div class="acoes">
                        <button class="btn-edit" data-id="${treino.id}" data-name="${treino.training_list}" title="Edit">✏️</button>
                        <button class="btn-delete" data-id="${treino.id}" title="Delete">🗑️</button>
                    </div>
                `;
                contentorTreinos.appendChild(item);
            });

            // Adicionar event listeners aos botões
            adicionarListenersBotons();
        })
        .catch(err => {
            contentorTreinos.innerHTML = "<p style='text-align:center; opacity:0.5; color:#ff0033;'>Error loading workouts. Try again.</p>";
            console.error("Erro ao carregar lista:", err);
        });
}

function adicionarListenersBotons() {
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            confirmarDelete(btn.dataset.id);
        });
    });

    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            editarTreino(btn.dataset.id, btn.dataset.name);
        });
    });
}

window.confirmarDelete = function (id) {
    Swal.fire({
        title: "Delete this workout?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0033",
        cancelButtonColor: "#333",
        confirmButtonText: "Yes, delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${urlAPI}/${id}`, { method: 'DELETE' })
                .then(() => {
                    Swal.fire("Deleted!", "Workout removed.", "success");
                    carregarTreinos();
                });
        }
    });
};

// 3. FUNÇÃO PARA EDITAR NOME (UPDATE)
window.editarTreino = function (id, nomeAtual) {
    Swal.fire({
        title: "Edit Workout Name",
        input: "text",
        inputValue: nomeAtual,
        showCancelButton: true,
        confirmButtonColor: "#ff0033",
        inputValidator: (value) => {
            if (!value) return 'Please write a name!';
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            fetch(`${urlAPI}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ training_list: result.value })
            }).then(() => {
                Swal.fire("Updated!", "Name changed successfully.", "success");
                carregarTreinos();
            });
        }
    });
};


window.onload = carregarTreinos;