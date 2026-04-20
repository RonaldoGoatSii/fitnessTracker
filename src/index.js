const contentorTreinos = document.getElementById("lista-treinos-api");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

function carregarTreinosNoInicio() {
    fetch(urlAPI)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error();
        })
        .then(treinos => {
            contentorTreinos.innerHTML = "";

            treinos.forEach(treino => {
                const item = document.createElement("li");
                
                let detalhes = [];
                if (treino.abs === "Sim") detalhes.push("Abs");
                if (treino.legs === "Sim") detalhes.push("Legs");
                if (treino.biceps === "Sim") detalhes.push("Biceps");
                if (treino.triceps === "Sim") detalhes.push("Triceps");

                item.innerHTML = `
                    <div style="text-align: left;">
                        <strong>${treino.training_list}</strong><br>
                        <small style="color: #ff0033;">${detalhes.join(" • ")}</small>
                    </div>
                `;
                
                contentorTreinos.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar treinos");
        });
}

window.onload = carregarTreinosNoInicio;