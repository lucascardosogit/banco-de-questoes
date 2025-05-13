const container = document.getElementById("listaQuestoes");

function carregarQuestoes() {
  const questoes = JSON.parse(localStorage.getItem("questoes")) || [];
  container.innerHTML = "";

  if (questoes.length === 0) {
    container.innerHTML = "<p>Nenhuma questão cadastrada.</p>";
  } else {
    questoes.forEach((questao, index) => {
      const cardId = `card${index + 1}`;
      const checkboxId = `q${index + 1}`;
      
      const card = document.createElement("div");
      card.className = "question-card";
      card.id = cardId;
      
      const opcoesList = questao.opcoes.map((opcao, idx) => {
        const letra = String.fromCharCode(97 + idx);
        const isCorreta = idx === questao.indexCorreta;
        return `<li ${isCorreta ? 'style="font-weight:bold; color:green;"' : ''}>${letra}) ${opcao}</li>`;
      }).join("");
      
      card.innerHTML = 
      `<div class="questao cabecalho">
      <h6>Questão ${questao.numeroQuestao}</h6>
      <input type="checkbox" role="switch" id="${checkboxId}" onclick="toggleQuestion('${checkboxId}', '${cardId}')">
      </div>
      <p>${questao.enunciado}</p>
      <ul>${opcoesList}</ul>`;
      
      container.appendChild(card);
    });
  }
}
  
function toggleQuestion(checkboxId, cardId) {
  const checkbox = document.getElementById(checkboxId);
  const card = document.getElementById(cardId);
  if (checkbox.checked) {
    card.style.backgroundColor = "#e3f2fd";
  } else {
    card.style.backgroundColor = "#f9f9f9";
  }
}

function adicionarQuestao() {
  const materia = document.getElementById("subject").value.trim();
  const conteudo = document.getElementById("content").value.trim();
  const enunciado = document.getElementById("quest-header").value.trim();
  const opcaoInputs = document.querySelectorAll(".alternative-input");
  const questCorreta = document.querySelector('input[name="isCorrect"]:checked');

  if (!materia || !conteudo || !enunciado || !questCorreta) {
    alert("Preencha todos os campos e selecione a opção correta.");
  return;
  }

  const opcoes = Array.from(opcaoInputs).map(input => input.value.trim());

  const indexCorreta = parseInt(questCorreta.value);

  let questoes = JSON.parse(localStorage.getItem("questoes")) || [];

  const novaQuestao = {
    numeroQuestao: questoes.length + 1,
    materia,
    conteudo,
    enunciado,
    opcoes,
    indexCorreta
  };

  questoes.push(novaQuestao);
  localStorage.setItem("questoes", JSON.stringify(questoes));

  alert(`Questão ${novaQuestao.numeroQuestao} adicionada com sucesso!`);

  document.getElementById("quest-form").reset();
}

function gerarProva() {
  
  let questoes = JSON.parse(localStorage.getItem("questoes")) || [];

  if (questoes.length === 0) {
    alert("Você não possui questões cadastradas. Cadastre-as para gerar provas");
    return;
  }

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  if(checkboxes.length === 0) {
    alert("Selecione pelo menos uma questão para gerar a prova.");
    return;
  }

  const questoesSelecionadas = Array.from(checkboxes).map(checkbox => {
    const cardId = checkbox.id.replace('q', '');
    return questoes[parseInt(cardId) - 1];
  });

  const variacoesInput = parseInt(document.getElementById("variacoes").value);

  if (isNaN(variacoesInput) || variacoesInput <= 0) {
      alert("Informe um número válido de variações.");
    return;
  }

  const variacoes = [];
  for (let i = 0; i < variacoesInput; i++) {
    const copiaQuestoes = [...questoesSelecionadas];
    const questoesAleatorias = [];
    
    while (copiaQuestoes.length > 0) {
      const indexAleatorio = Math.floor(Math.random() * copiaQuestoes.length);
      questoesAleatorias.push(copiaQuestoes[indexAleatorio]);
      copiaQuestoes.splice(indexAleatorio, 1);
    }

    variacoes.push(questoesAleatorias);
  }

  localStorage.setItem("variacoes", JSON.stringify(variacoes));

  alert(`Provas geradas com sucesso! ${variacoesInput} variações foram criadas.`);
}

function carregarProvas() {
  const variacoes = JSON.parse(localStorage.getItem("variacoes")) || [];
  const containerProvas = document.getElementById("listaProvas");
  containerProvas.innerHTML = "";

  if (variacoes.length === 0) {
    containerProvas.innerHTML = "<p>Nenhuma prova gerada.</p>";
  } else {
    variacoes.forEach((prova, indexProva) => {
      const provaCardId = `provaCard${indexProva + 1}`;

      const provaCard = document.createElement("div");
      provaCard.className = "prova-card";
      provaCard.id = provaCardId;
      
      provaCard.innerHTML = 
      `<div class="prova cabecalho">
        <h4>Prova ${indexProva + 1}</h4>
      </div>`;

      const questoesList = document.createElement("ul");
      questoesList.className = "questoes-list";

      prova.forEach((questao, indexQuestao) => {
        const questaoItem = document.createElement("li");
        questaoItem.innerHTML = `
          <h5>Questão ${indexQuestao + 1}: ${questao.enunciado}</h5>
          <ul>
            ${questao.opcoes
              .map((opcao, idx) => {
                const letra = String.fromCharCode(97 + idx);
                const isCorreta = idx === questao.indexCorreta;
                return `<li ${isCorreta ? 'style="font-weight:bold; color:green;"' : ''}>${letra}) ${opcao}</li>`;
              })
              .join("")}
          </ul>
        `;
        questoesList.appendChild(questaoItem);
      });

      provaCard.appendChild(questoesList);
      containerProvas.appendChild(provaCard);
    });
  }
}

function limparLocal(){
  localStorage.clear();
  alert('Questões excluidas com sucesso!');
}