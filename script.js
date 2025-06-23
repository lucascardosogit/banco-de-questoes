let questions = JSON.parse(localStorage.getItem("questions")) || [];
let matters = JSON.parse(localStorage.getItem("matters")) || ["Programação Web", "Banco de Dados", "Algoritmos"];
let contents = JSON.parse(localStorage.getItem("contents")) || ["HTML", "CSS", "JavaScript"];
let courses = JSON.parse(localStorage.getItem("courses")) || ["Análise e Desenvolvimento de Sistemas", "Engenharia de Software", "Sistemas de Informação", "Redes de Computadores"];

// Funções genéricas
function optionsLoad(position, arrayOfContent, placeholderMsg) {
  const element = document.querySelector(position);

  const elementPreSet = document.createElement("option");
  elementPreSet.text =  placeholderMsg.toString();
  elementPreSet.selected = true;
  elementPreSet.disabled = true;
  element.appendChild(elementPreSet)
  arrayOfContent.forEach((el, index) => {
    let tempElement = document.createElement("option");
    tempElement.text = el.toString();
    tempElement.value = index;
    element.appendChild(tempElement);
  })
}

function syncLocalStorage() {
  questions = JSON.parse(localStorage.getItem("questions")) || [];
  matters = JSON.parse(localStorage.getItem("matters")) || ["Programação Web", "Banco de Dados", "Algoritmos"];
  contents = JSON.parse(localStorage.getItem("contents")) || ["HTML", "CSS", "JavaScript"];
  courses = JSON.parse(localStorage.getItem("courses")) || ["Análise e Desenvolvimento de Sistemas", "Engenharia de Software", "Sistemas de Informação", "Redes de Computadores"];
}

function clearLocalStorage() {
  localStorage.clear();
  alert("Banco de questões zerado com sucesso!");
  location.reload();
}

// Lógica página home
function homeLoader() {
  syncLocalStorage();
  cardLoader(matters, 'Matérias', '.dashboard');
  cardLoader(contents, 'Conteúdos', '.dashboard');
  cardLoader(courses, 'Cursos', '.dashboard');
  optionsLoad('#type-content', ["Matéria", "Conteúdo", "Curso"], 'Adicionar um(a) novo(a)...');
  
  document.getElementById('dashboard-modify').addEventListener("click", () => {
    let tempMenu = document.getElementById('hidden-menu');

    tempMenu.classList.add("hidden-animation-open");
    tempMenu.classList.remove("hidden-animation-close");
  });

  document.getElementById('hidden-close').addEventListener("click", () => {
    let tempMenu = document.getElementById('hidden-menu');

    tempMenu.classList.add("hidden-animation-close");
    tempMenu.classList.remove("hidden-animation-open");
  });
}

function typeOfContentAdd() {
  event.preventDefault();
  syncLocalStorage();
  const objIndex = parseInt(document.getElementById("type-content").value);
  const objValue = document.getElementById("value-content").value;
  document.getElementById('hidden-form').reset();

  if(!objIndex && !objValue) {
    alert("Por favor preencha ambos os campos!");
    return;
  }

  switch(objIndex) {
    case 0:
      matters.push(objValue);
      localStorage.setItem("matters", JSON.stringify(matters));
      alert("Matéria adicionada com sucesso!");
      cardLoader(matters, 'Matérias', '.dashboard', true);
    break;
    case 1:
      contents.push(objValue);
      localStorage.setItem("contents", JSON.stringify(contents));
      alert("Conteúdo adicionado com sucesso!");
      cardLoader(contents, 'Conteúdos', '.dashboard', true);
    break;
    case 2:
      courses.push(objValue);
      localStorage.setItem("courses", JSON.stringify(courses));
      alert("Curso adicionado com sucesso!");
      cardLoader(courses, 'Cursos', '.dashboard', true);
    break;
    default:
      console.log("Error on select data.");
    break;
  }
}

function cardLoader(array, text, position, replace = false) {
  const cardContainer = document.querySelector(position);

  const cardDiv = document.createElement("div");

  
  if(replace) {
    let temp = document.getElementById(`${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}-card`);
    
    temp.firstChild.textContent = `${array.length}`;
    return;
  }
  
  cardDiv.id = `${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}-card`;
  cardDiv.className = "dashboard-card"
  cardDiv.innerHTML = 
    `<p class="p-number-card">${array.length}</p>
    <p class="p-description-card">${text}</p>`;
  cardContainer.appendChild(cardDiv);
}

// Lógica página cadastro de questões
function questRegLoader() {
  syncLocalStorage();
  optionsLoad('#quest-matter', matters, 'Selecione uma matéria');
  optionsLoad('#quest-content', contents, 'Selecione um conteúdo');
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

// Lógica página gerar prova

function testGenLoader() {
  questionsLoader();
  syncLocalStorage();
  optionsLoad('#test-course', courses, 'Selecione a cadeira');
  optionsLoad('#test-matter', matters, 'Selecione uma matéria');
  optionsLoad('#test-content', contents, 'Selecione um conteúdo');
}

function questionsLoader() {
  syncLocalStorage();
  const questionsContainer = document.getElementById("quest-list-container");

  questions = JSON.parse(localStorage.getItem("questions")) || [];

  if (questions.length === 0) {
    questionsContainer.innerHTML = "<p>Nenhuma questão cadastrada.</p>";
  } else {
    questions.forEach((quest, index) => {
      const questCardID = `quest-card-${index + 1}`;
      const questCardCheckboxID = `quest-checkbox-${index + 1}`;
      
      const questCard = document.createElement("div");
      questCard.className = "question-card";
      questCard.id = questCardID;
      
      const questionAlternatives = quest.alternativesArray.map((alt, index) => {
        const altID = String.fromCharCode(97 + index);

        if(parseInt(quest.correctAltIndex) === index) {
          return `<li class="correct-alternative">${altID}) ${alt}</li>`;
        } else {
          return `<li>${altID}) ${alt}</li>`;
        }
      }).join("");
      
      console.log(quest)
      questCard.innerHTML = 
      `<div class="question-header">
        <div class="quest-matter-content">
          <p>Matéria: ${quest.matter}</p>
          <p>Conteúdo: ${quest.content}</p>
        </div>
        <input type="checkbox" role="switch" id="${questCardCheckboxID}" onclick="toggleQuestion('${questCardCheckboxID}', '${questCardID}')">
      </div>
      <p>${quest.questHeader}</p>
      <ul>${questionAlternatives}</ul>`;
      
      questionsContainer.appendChild(questCard);
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

function gerarProva() {
  event.preventDefault();
  
  let questions = JSON.parse(localStorage.getItem("questions")) || [];

  if (questions.length === 0) {
    alert("Você não possui questões cadastradas. Cadastre-as para gerar provas!");
    return;
  }

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  if(checkboxes.length === 0) {
    alert("Selecione pelo menos uma questão para gerar a prova.");
    return;
  }

  const questoesSelecionadas = Array.from(checkboxes).map(checkbox => {
    const cardId = checkbox.id.replace('q', '');
    return questions[parseInt(cardId) - 1];
  });

  const variacoesInput = parseInt(document.getElementById("tests-variation").value);

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
  const containerProvas = document.getElementById("tests-list");
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