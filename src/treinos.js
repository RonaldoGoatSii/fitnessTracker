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
    alert("Escreve um nome para o treino!");
    return;
  }

  if (exerciciosSelecionados.length === 0) {
    alert("Seleciona pelo menos um exercício!");
    return;
  }

  const novoTreino = {
    training_list: nomeTreino,
    abs: exerciciosSelecionados.includes("Abs") ? "Sim" : "Não",
    legs: exerciciosSelecionados.includes("Legs") ? "Sim" : "Não",
    biceps: exerciciosSelecionados.includes("Biceps") ? "Sim" : "Não",
    triceps: exerciciosSelecionados.includes("Triceps") ? "Sim" : "Não"
  };

  fetch(urlAPI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoTreino)
  })
  .then(response => {
      if(response.ok) {
          return response.json();
      }
      throw new Error();
  })
  .then(data => {
    alert("Treino guardado!");
    document.getElementById("input-novo-treino").value = "";
    checkboxes.forEach((c) => (c.checked = false));
  })
  .catch(error => {
    alert("Erro na ligação.");
  });
});