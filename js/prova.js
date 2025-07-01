import {getQuestionByParams, getQuestionById, postTest, putTest, getTestById, deleteTest} from './api.js';

let selectedQuestions = [];

function setupSearchListener() {
    document.addEventListener("submit", (event) => {
        event.preventDefault();
        loadQuestions();
    })
}

async function setTest() {
  let params = (new URLSearchParams(window.location.search)).get('id');

  const testHeader = document.getElementById("test-header").value.trim();
  const course = document.getElementById("test-course").value.trim();
  const selectedQuestionsId = selectedQuestions.map(quest => quest.idQuestao);

  if (testHeader === "" || !course || selectedQuestionsId.length === 0) {
    alert("Preencha os campos e selecione as questões a serem inseridas na prova.");

    if(testHeader === "") {
      document.getElementById("test-header").style.border = '2px solid red';
      document.getElementById("test-header").placeholder = "Campo 'Título' de uma prova não pode estar vazio";
    } else {
      document.getElementById("test-header").style.border = '1px solid #ccc';
    }

    if(!course) {
      document.getElementById("test-course").style.border = '2px solid red';
      document.getElementById("test-course").placeholder = "Campo 'Disciplina' de uma prova não pode estar vazio";
    } else {
      document.getElementById("test-course").style.border = '1px solid #ccc';
    }

    if(selectedQuestionsId.length === 0) {
        document.querySelector("div#selected-result ul li:first-of-type").style.border = '2px solid red';
    } else {
        document.querySelector("div#selected-result ul li:first-of-type").style.border = 'none';
    }

    return;
  }

  const newTest = {
    titulo: testHeader,
    disciplina: course,
    questoesIds: selectedQuestionsId
  };

  try {

    if(params) {
      await putTest(params, newTest);
      alert(`Prova editada com sucesso!`);
    } else {
      await postTest(newTest);
      alert(`Prova adicionada com sucesso!`);
      document.getElementById("test-form").reset();
    }
    
  } catch (error) {
    alert("Não foi possível estabelecer conexão com o banco de dados...");
    console.error(`Erro ao salvar a prova no banco de dados: ${error}`);
  }
}

async function loadTestForEdit() {
  let params = (new URLSearchParams(window.location.search)).get('id');
  
  if(!params) {
    return;
  }

  let buttonForInsert = document.querySelector("div.test-actions > button");
  buttonForInsert.classList.add("edit");
  buttonForInsert.innerHTML = "<img src='/public/img/check-icon.svg' alt='Insert button'> Atualizar";

  try {
    const data = await getTestById(params);

    if(!data) {
      alert(`Prova de ID ${params} não encontrada!`);
      return;
    }
    
    document.querySelector("h1").textContent = "Edição de Prova";

    document.getElementById('test-header').value = data.titulo;
    document.getElementById('test-course').value = data.disciplina;
    selectedQuestions = data.questoes;
    renderSelectedQuestions();
    
    let buttonForDelete = document.createElement("button"); 
    buttonForDelete.classList.add("delete");

    buttonForDelete.onclick = async () => {
        let deleteConfirmation = confirm("Tem certeza que deseja excluir esta prova?");
        if (deleteConfirmation) {
            try {
                await deleteTest(data.idProva);
                alert("Prova excluída com sucesso!");
                window.location.href = "provas.html";
            } catch (error) {
                alert("Erro ao excluir prova!");
                console.error("Erro ao excluir:", error);
            }
        };
      };

    buttonForDelete.innerHTML = '<img src="/public/img/delete-svg.svg" alt="Delete button"> Excluir';
    document.querySelector('.test-actions').appendChild(buttonForDelete);
    
  } catch (error) {
    console.error(`Erro ao carregar prova para edição: ${error}`);
  }
}

async function loadQuestions() {
    const course = document.getElementById("test-course").value.trim();
    const subjects = document.getElementById("search-subject").value.split(",").map(sub => sub.trim());
    const ulContainer = document.querySelector("#researched-result ul");
    
    if(!course) {
        alert("O campo 'Disciplina' não pode estar vazio!");
        document.getElementById("test-course").style.border = '2px solid red';

        return;
    } else {
        document.getElementById("test-course").style.border = '1px solid #ccc';
    }
    
    ulContainer.innerHTML = `<li>Carregando questões...</li>`;

    try {
        const data = await getQuestionByParams(course, subjects);

        if(data.length === 0) {
            ulContainer.innerHTML = `<li>Não há questões registradas em banco com este filtro. Verifique a Disciplina e o Assunto informados e tente novamente.</li>`;
        } else {
            ulContainer.querySelector("li:first-of-type").remove();
        }

        data.forEach((quest_obj) => {
            const liTempCard = document.createElement("li");
            const liDivTempCard = document.createElement("div");
            liDivTempCard.classList.add("question-card");
            

            liDivTempCard.innerHTML = `
            <p>${quest_obj.idQuestao}) ${quest_obj.titulo}</p>
            <p class="categories">Assuntos: ${(quest_obj.assuntos).join(', ')}</p>
            <div class="options"></div>
            `;
            
            const viewButton = document.createElement("button");
            viewButton.type = "button";
            viewButton.classList.add("info");
            viewButton.innerHTML = '<img src="/public/img/view-info-icon.svg" alt="View info quest icon">';
            
            viewButton.addEventListener("click", () => {
                viewQuestInDetails(`${quest_obj.idQuestao}`);
            });

            liDivTempCard.querySelector("div.options").appendChild(viewButton);

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.classList.add("add");
            addButton.innerHTML = '<img src="/public/img/add-button-svg.svg" alt="Add quest to test icon">';
            
            addButton.addEventListener("click", () => {
                addQuestionToTest(quest_obj);
            });
            
            liDivTempCard.querySelector("div.options").appendChild(addButton);
            
            liTempCard.appendChild(liDivTempCard);
            ulContainer.appendChild(liTempCard);
        });

    } catch (error) {
        ulContainer.innerHTML = `<li>Não foi possível estabelecer conexão com o banco de dados...</li>`;
        console.error('Erro na busca de questões parametrizadas: ' + error);
    }
}

async function viewQuestInDetails(id) {
    const hiddenContainer = document.createElement("div");
    
    try {
        const data = await getQuestionById(id);

        hiddenContainer.style.position = "absolute";
        hiddenContainer.classList.add("hidden-menu");
        hiddenContainer.innerHTML = `
            <h2 class="subtitle">Detalhes da Questão</h2>
            <div>
            <button>X</button>
            <p>${data.idQuestao}) ${data.titulo}</p>
            <ul>
                ${data.alternativas.map((alt, index) => 
                    alt.correta
                        ? `<li class="correct-alternative">${String.fromCharCode(65 + index)}) ${alt.descricao}</li>`
                        : `<li>${String.fromCharCode(65 + index)}) ${alt.descricao}</li>`
                ).join('')}
            </ul>
            </div>
        `;

        hiddenContainer.querySelector("button").addEventListener("click", () => {
            hiddenContainer.classList.remove("show");
        });

        setTimeout(() => {
            hiddenContainer.classList.add("show");
        }, 10);        

        document.body.appendChild(hiddenContainer);

        setInterval(() => {
            if (!hiddenContainer.classList.contains("show")) {
                hiddenContainer.remove();
            }
        }, 3000);
    } catch (error) {
        console.error(`Erro ao carregar dados de questão para exibição detalhada: ${error}`);
    }
}

function addQuestionToTest(question) {
    const alreadyAdded = selectedQuestions.find(q => q.idQuestao === question.idQuestao);
    
    if (alreadyAdded) {
        alert('Esta questão já foi adicionada à prova!');
        return;
    }
    selectedQuestions.push(question);
    renderSelectedQuestions();
}

function removeQuestionOfTest(index) {
    selectedQuestions.splice(index, 1);
    renderSelectedQuestions();
}

function renderSelectedQuestions() {
    const container = document.querySelector("#selected-result ul");
    
    container.innerHTML = '';

    if(selectedQuestions.length === 0) {
        container.innerHTML = `<li>Nenhuma questão selecionada para a prova atual.</li>`;
    }
    
    selectedQuestions.forEach((question, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="question-card">
                <p>${question.idQuestao}) ${question.titulo}</p>
                <p>Assuntos: ${question.assuntos.join(', ')}</p>
                <div class="options">
                    <button class="remove" onclick="removeQuestionOfTest(${index})"><img src="/public/img/delete-svg.svg"></button>
                </div>
            </div>
        `;
        container.appendChild(li);
    });
}

function init() {
    setupSearchListener();
    renderSelectedQuestions();
    loadTestForEdit();
}

window.addEventListener("DOMContentLoaded", init);

window.removeQuestionOfTest = removeQuestionOfTest;
window.setTest = setTest;