let createTrn = document.getElementById("create");
const urlAPI = "https://69de915cd6de26e1192812a2.mockapi.io/workout";

createTrn.addEventListener("click", function () {
  const nomeTreino = document.getElementById("input-novo-treino").value.trim();
  const checkboxes = document.querySelectorAll("#lista-exercicios li input");

  let exerciciosSelecionados = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      exerciciosSelecionados.push(checkbox.parentElement.textContent.trim());
    }
  });

  if (nomeTreino === "") {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Escreve um nome para o treino!",
      showClass: {
        popup: "animate__animated animate__shakeX"
      }
    });
    return;
  }

  if (exerciciosSelecionados.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Seleciona pelo menos um exercício!",
      showClass: {
        popup: "animate__animated animate__shakeX"
      }
    });
    return;
  }

  const novoTreino = {
    training_list: nomeTreino,
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
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  })
  .then(data => {
    Swal.fire({
      icon: "success",
      title: "Traine created!",
      text: "Good luck!",
      showClass: {
        popup: "animate__animated animate__zoomIn"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut"
      }
    });

    document.getElementById("input-novo-treino").value = "";
    checkboxes.forEach((c) => (c.checked = false));
  })
  .catch(error => {
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro na ligação.",
      showClass: {
        popup: "animate__animated animate__shakeX"
      }
    });
  });
});