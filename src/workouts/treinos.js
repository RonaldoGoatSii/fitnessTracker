const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";
const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

function createWorkout() {

    const inputNome = document.getElementById("input-novo-treino");

    const checkboxes = document.querySelectorAll('#lista-exercicios input[type="checkbox"]');
    
    let escolhas = {
        Biceps: "Não",
        Legs: "Não",
        Triceps: "Não",
        Abs: "Não"
    };

    checkboxes.forEach(box => {
        if (box.checked) {
            escolhas[box.value] = "Sim";
        }
    });

    if (!inputNome.value.trim()) {
        Swal.fire("Wait!", "Please name your workout first.", "info");
        return;
    }

    const algumSelecionado = Object.values(escolhas).includes("Sim");

    if (!algumSelecionado) {
        Swal.fire("Wait!", "Please select at least one exercise.", "warning");
        return;
    }

  
    const newTraining = {
        training_list: inputNome.value,
        biceps: escolhas["Biceps"],
        legs: escolhas["Legs"],
        triceps: escolhas["Triceps"],
        abs: escolhas["Abs"],
        date: new Date().toLocaleString('pt-PT'),
        userId: sessionUser.id 
    };

    let storedTrainings = JSON.parse(localStorage.getItem("localTrainings")) || [];
    storedTrainings.push(newTraining);
    localStorage.setItem("localTrainings", JSON.stringify(storedTrainings));

    Swal.fire({
        title: 'Saving...',
        didOpen: () => { Swal.showLoading(); }
    });

    fetch(urlAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTraining)
    })
    .then(res => {
        if (res.ok) {
            Swal.fire("Success!", "Workout created!", "success").then(() => {
                window.location.href = "../../index.html"; 
            });
        } else {
            Swal.fire("Error", "Failed to save to database", "error");
        }
    })
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Connection failed", "error");
    });
}
