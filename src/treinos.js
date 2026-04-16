let createBtn = document.getElementById("create");

createBtn.addEventListener("click", function () {
  const nomeTreino = document.getElementById("input-novo-treino").value.trim();

  const checkboxes = document.querySelectorAll("#lista-exercicios li input");

  let exerciciosSelecionados = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      exerciciosSelecionados.push(
        checkbox.parentElement.textContent.trim()
      );
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
    nome: nomeTreino,
    exercicios: exerciciosSelecionados
  };

  let treinos = JSON.parse(localStorage.getItem("treinos")) || [];


  treinos.push(novoTreino);


  localStorage.setItem("treinos", JSON.stringify(treinos));

  console.log("Treino criado:", novoTreino);

  alert("Treino criado com sucesso!");

  
  document.getElementById("input-novo-treino").value = "";

 
  checkboxes.forEach((c) => (c.checked = false));
});