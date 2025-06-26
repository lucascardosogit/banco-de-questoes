// Lógica página cadastro de questões
function questRegLoader() {
  syncLocalStorage();
  inputOptionsLoad('#quest-matter', matters, 'Selecione uma disciplina');
  checkboxOptionsLoad('#quest-content', contents, 'Selecione um ou mais assuntos');
}

function setNewQuest() {
  syncLocalStorage();
  const matter = document.getElementById("quest-matter").value.trim();
  const content = document.getElementById("quest-content").value.trim();
  const questHeader = document.getElementById("quest-header").value.trim();
  const alternativeInputs = document.querySelectorAll(".alternative-input");
  const correctAltIndex = (document.querySelector('input[name="isCorrect"]:checked')).value;

  if (!matter || !content || !questHeader || !alternativeInputs || !correctAltIndex) {
    alert("Preencha todos os campos da questão e selecione qual a alternativa correta.");
    return;
  }

  const alternatives = Array.from(alternativeInputs).map(alt => alt.value.trim());

  const newQuest = {
    questNumberID: questions.length + 1,
    matters,
    content,
    questHeader,
    alternativesArray: alternatives,
    correctAltIndex
  };

  questions.push(newQuest);

  localStorage.setItem("questions", JSON.stringify(questions));

  alert(`Questão ${newQuest.questNumberID} adicionada com sucesso!`);

  document.getElementById("quest-form").reset();
}