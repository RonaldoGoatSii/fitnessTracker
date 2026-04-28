let createTrn = document.getElementById("create");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

createTrn.addEventListener("click", function () {
    const nomeTreino = document.getElementById("input-novo-treino").value.trim();
    
    const checkboxes = document.querySelectorAll(".exercicio-card input");

    let exerciciosSelecionados = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            exerciciosSelecionados.push(checkbox.value);
        }
    });

    if (nomeTreino === "") {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Write a name for the workout!",
            confirmButtonColor: "#ff0033"
        });
        return;
    }

    if (exerciciosSelecionados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Select at least one exercise!",
            confirmButtonColor: "#ff0033"
        });
        return;
    }

    const novoTreino = {
        training_list: nomeTreino,
        date: new Date().toLocaleString('pt-PT'), 
        abs: exerciciosSelecionados.includes("Abs") ? "Sim" : "Não",
        legs: exerciciosSelecionados.includes("Legs") ? "Sim" : "Não",
        biceps: exerciciosSelecionados.includes("Biceps") ? "Sim" : "Não",
        triceps: exerciciosSelecionados.includes("Triceps") ? "Sim" : "Não"
    };

    Swal.fire({
        title: "Creating the training..",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(urlAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoTreino)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error("Erro na API");
    })
    .then(data => {
        Swal.fire({
            icon: "success",
            title: "Workout created!",
            text: "Good luck with your training!",
            confirmButtonColor: "#ff0033"
        }).then(() => {

            document.getElementById("input-novo-treino").value = "";
            checkboxes.forEach((c) => (c.checked = false));

        });
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Connection failed.",
            confirmButtonColor: "#ff0033"
        });
    });
});