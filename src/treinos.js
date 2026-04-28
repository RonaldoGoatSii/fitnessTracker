const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

const createTrn = document.getElementById("create");

function validarFormulario() {
    const nomeTreino = document.getElementById("input-novo-treino").value.trim();
    const checkboxes = document.querySelectorAll(".exercicio-card input");
    let exerciciosSelecionados = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);

    if (!nomeTreino) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Write a name for the workout!",
            confirmButtonColor: "#ff0033"
        });
        return { valido: false };
    }

    if (exerciciosSelecionados.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Select at least one exercise!",
            confirmButtonColor: "#ff0033"
        });
        return { valido: false };
    }

    return { valido: true, nome: nomeTreino, exercicios: exerciciosSelecionados };
}

function criarTreino(nomeTreino, exercociosSelecionados) {
    return {
        training_list: nomeTreino,
        date: new Date().toLocaleString('pt-PT'),
        abs: exercociosSelecionados.includes("Abs") ? "Sim" : "Não",
        legs: exercociosSelecionados.includes("Legs") ? "Sim" : "Não",
        biceps: exercociosSelecionados.includes("Biceps") ? "Sim" : "Não",
        triceps: exercociosSelecionados.includes("Triceps") ? "Sim" : "Não"
    };
}

function limparFormulario() {
    document.getElementById("input-novo-treino").value = "";
    document.querySelectorAll(".exercicio-card input").forEach(c => c.checked = false);
}

createTrn.addEventListener("click", function () {
    const { valido, nome, exercicios } = validarFormulario();

    if (!valido) return;

    const novoTreino = criarTreino(nome, exercicios);

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
            throw new Error("Connection error");
        })
        .then(data => {
            Swal.fire({
                icon: "success",
                title: "Workout created!",
                text: "Good luck with your training!",
                confirmButtonColor: "#ff0033"
            }).then(() => {
                limparFormulario();
            });
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Connection failed. Try again.",
                confirmButtonColor: "#ff0033"
            });
            console.error("Erro ao criar treino:", error);
        });
});