const contentorTreinos = document.getElementById("lista-treinos-api");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";
const sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

// Update navbar based on session
function updateNavbar() {
    const navWorkout = document.getElementById("nav-workout-li");
    const navList = document.getElementById("nav-list-li");
    const navLogin = document.getElementById("nav-login-li");
    const navLogout = document.getElementById("nav-logout-li");
    const welcomeMsg = document.getElementById("welcome-message");

    if (sessionUser) {
        if (navLogin) navLogin.style.display = "none";
        if (navLogout) navLogout.style.display = "block";
        if (navList) navList.style.display = "block";
        if (navWorkout) navWorkout.style.display = "block"; 

        if (welcomeMsg) {
            welcomeMsg.innerText = `Welcome back, ${sessionUser.name}!`;
        }
    } else {
        if (navLogin) navLogin.style.display = "block";
        if (navLogout) navLogout.style.display = "none";
        if (navWorkout) navWorkout.style.display = "none";
        if (navList) navList.style.display = "none";
    }
}

// Training filters
function loadTrainings() {
    if (!contentorTreinos) return;

    fetch(urlAPI)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(treinos => {
            contentorTreinos.innerHTML = "";

            let filterTrainigs;
            if (sessionUser && sessionUser.role === "admin") {
                filterTrainigs = treinos; // Admin vê tudo
            } else if (sessionUser) {
                // An normal user only sees their own workouts
                filterTrainigs = treinos.filter(t => String(t.userId) === String(sessionUser.id));
            } else {
                filterTrainigs = [];
            }

            if (filterTrainigs.length === 0) {
                contentorTreinos.innerHTML = "<p style='text-align:center; opacity:0.5;'>No workouts found.</p>";
                return;
            }

            filterTrainigs.forEach(treino => {
                const exercise = document.createElement("li");
                exercise.className = "treino-item"; 

                let details = [];
                if (treino.abs === "Sim") details.push("Abs");
                if (treino.legs === "Sim") details.push("Legs");
                if (treino.biceps === "Sim") details.push("Biceps");
                if (treino.triceps === "Sim") details.push("Triceps");

                exercise.innerHTML = `
                    <div class="info-treino">
                        <strong>${treino.training_list}</strong>
                        <small>${details.join(" / ")}</small>
                        <span class="data-treino">${treino.date || ''}</span>
                        ${sessionUser.role === "admin" ? `<span style="font-size:10px; color:gray; display:block;">User ID: ${treino.userId}</span>` : ""}
                    </div>
                    <div class="acoes">
                        <button onclick="editTraining('${treino.id}', '${treino.training_list}')">✏️</button>
                        <button onclick="confirmDelete('${treino.id}')">🗑️</button>
                    </div>
                `;
                contentorTreinos.appendChild(exercise);
            });
        })
        .catch(err => console.error("Error loading list:", err));
}

window.confirmDelete = function(id) {
    Swal.fire({
        title: "Delete this workout?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff0033",
        confirmButtonText: "Yes, delete!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${urlAPI}/${id}`, { method: 'DELETE' })
                .then(() => {
                    Swal.fire("Deleted!", "Workout removed.", "success");
                    loadTrainings(); 
                });
        }
    });
};

window.editTraining = function(id, nomeAtual) {
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
                Swal.fire("Updated!", "Success!", "success");
                loadTrainings();
            });
        }
    });
};

window.logout = function() {
    localStorage.removeItem("sessionUser");
    window.location.href = "index.html";
};

window.onload = function() {
    updateNavbar();
    if (contentorTreinos) {
        loadTrainings();
    }
};