const questoes = JSON.parse(localStorage.getItem("questoes")) || [];
const container = document.getElementById("listaQuestoes");

const opcoesMenu = document.querySelectorAll(".botao-link");

opcoesMenu.forEach((botao, indice) => {
  botao.addEventListener('click', (event) => {
    if (indice === 0) {
      document.querySelector('#container-cadastrar-questoes').classList.toggle('oculto');
      document.querySelector('#container-menu').classList.toggle('oculto');
      document.querySelector('.back').classList.toggle('oculto');
    }
  })
})

document.querySelector('.back').addEventListener('click', () => {
  document.querySelector('.back').classList.toggle('oculto');
  document.querySelector('#container-cadastrar-questoes').classList.toggle('oculto');
  document.querySelector('#container-menu').classList.toggle('oculto');
})

if (questoes.length === 0) {
  container.innerHTML = "<p>Nenhuma questão cadastrada.</p>";
} else {
  questoes.forEach((questao, index) => {
    const cardId = `card${index + 1}`;
    const checkboxId = `q${index + 1}`;

    const card = document.createElement("div");
    card.className = "question-card";
    card.id = cardId;

    console.log(questao.opcoes);

    const opcoesList = questao.opcoes.map((opcao, idx) => {
      const letra = String.fromCharCode(97 + idx);
      const isCorreta = idx === questao.correta;
      return `<li ${isCorreta ? 'style="font-weight:bold; color:green;"' : ''}>${letra}) ${opcao}</li>`;
    }).join("");

    card.innerHTML = 
    `<div class="question-header">
    <h6>Questão ${questao.numero}</h6>
    <input type="checkbox" role="switch" id="${checkboxId}" onclick="toggleQuestion('${checkboxId}', '${cardId}')">
    </div>
    <p>${questao.enunciado}</p>
    <ul>${opcoesList}</ul>`;

    container.appendChild(card);
  });
}

function toggleQuestion(checkboxId, cardId) {
  const checkbox = document.getElementById(checkboxId);
  const card = document.getElementById(cardId);
  if (checkbox.checked) {
    card.style.backgroundColor = "#e3f2fd"; // azul claro
  } else {
    card.style.backgroundColor = "#f9f9f9"; // cor padrão definida no CSS
  }
}

// script.js

function adicionarQuestao() {
  const materia = document.getElementById("materia").value.trim();
  const conteudo = document.getElementById("conteudo").value.trim();
  const enunciado = document.getElementById("enunciado").value.trim();
  const opcaoInputs = document.querySelectorAll(".opcaoInput");
  const corretaIndex = document.querySelector('input[name="correta"]:checked');

  if (!materia || !conteudo || !enunciado || !corretaIndex) {
    alert("Preencha todos os campos e selecione a opção correta.");
  return;
  }

  const opcoes = Array.from(opcaoInputs).map(input => input.value.trim());
  // console.log(opcoes);

  const correta = parseInt(corretaIndex.value);

  let questoes = JSON.parse(localStorage.getItem("questoes")) || [];

  const novaQuestao = {
    numero: questoes.length + 1,
    materia,
    conteudo,
    enunciado,
    opcoes,
    correta // índice da opção correta
  };

  questoes.push(novaQuestao);
  localStorage.setItem("questoes", JSON.stringify(questoes));

  alert(`Questão ${novaQuestao.numero} adicionada com sucesso!`);

  // Limpar o formulário para a próxima questão
  document.getElementById("questaoForm").reset();
}

function limparLocal(){
  localStorage.clear()
  alert('Questões excluidas com sucesso!')
}