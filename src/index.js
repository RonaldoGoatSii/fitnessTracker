const contentorTreinos = document.getElementById("lista-treinos-api");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

function carregarTreinos() {
    if (!contentorTreinos) return;

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
                        <button class="btn-editar" data-id="${treino.id}" data-name="${treino.training_list}" title="Edit">✏️</button>
                        <button class="btn-delete" data-id="${treino.id}" title="Delete">🗑️</button>
                    </div>
                `;
                contentorTreinos.appendChild(item);
            });
        })
        .catch(err => console.error("Erro ao carregar lista:", err));
}

const editarListener = document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar")) {

        const id = e.target.dataset.id;
        const nomeAtual = e.target.dataset.name;

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
    }
});

const deleteListener = document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {

        const id = e.target.dataset.id;

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
                fetch(`${urlAPI}/${id}`, {
                    method: 'DELETE'
                }).then(() => {
                    Swal.fire("Deleted!", "Workout removed.", "success");
                    carregarTreinos();
                });
            }
        });
    }
});


window.onload = carregarTreinos;