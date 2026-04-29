const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";
const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

function createWorkout() {
    // 1. Verificar login
    if (!sessionUser) {
        Swal.fire("Error", "You must be logged in to create a workout!", "error");
        return;
    }

    // 2. Pegar o input do nome (usando o ID exato do teu HTML)
    const inputNome = document.getElementById("input-novo-treino");
    
    // 3. Pegar todos os checkboxes dentro da grid
    const checkboxes = document.querySelectorAll('#lista-exercicios input[type="checkbox"]');
    
    // Criamos um objeto para mapear o que foi selecionado
    let escolhas = {
        Biceps: "Não",
        Legs: "Não",
        Triceps: "Não",
        Abs: "Não"
    };

    // Percorrer os checkboxes para ver quais estão marcados
    checkboxes.forEach(box => {
        if (box.checked) {
            escolhas[box.value] = "Sim";
        }
    });

    // 4. Validação
    if (!inputNome.value.trim()) {
        Swal.fire("Wait!", "Please name your workout first.", "info");
        return;
    }

    // 5. Montar o objeto para a API
    const newTraining = {
        training_list: inputNome.value,
        biceps: escolhas["Biceps"],
        legs: escolhas["Legs"],
        triceps: escolhas["Triceps"],
        abs: escolhas["Abs"],
        date: new Date().toLocaleString('pt-PT'),
        userId: sessionUser.id 
    };


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
                window.location.href = "../index.html"; 
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