import {getQuestions, redirect} from './api.js';

async function questionsCardLoader() {
    const element = document.getElementById("questions-list-container");
    element.appendChild(document.createElement("ul"));
    element.firstChild.innerHTML = `<li>Carregando questões...</li>`;

    try {
        const data = await getQuestions();

        if(data.length === 0) {
            element.firstChild.innerHTML = `<li>Não há questões registradas em banco.</li>`;
            return;
        } else {
            element.querySelector("li:first-of-type").remove();
        }

        data.forEach((data_quest) => {
            const liTempCard = document.createElement("li");
            const liDivTempCard = document.createElement("div");
            liTempCard.appendChild(liDivTempCard);
            liDivTempCard.classList.add("question-card");


            liDivTempCard.innerHTML = `
            <div class="quest-actions edit"></div>
            <p>${data_quest.idQuestao}) ${data_quest.titulo}</p>
            <p>Disciplina: ${data_quest.disciplina}</p>
            <p class="categories">Assuntos: ${(data_quest.assuntos).join(', ')}</p>
            `;

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.innerHTML = '<img src="/public/img/edit-icon.svg" alt="Edit quest icon">';
            editButton.addEventListener("click", () => {
                redirect('questao.html', {id: `${data_quest.idQuestao}`});
            });

            liDivTempCard.querySelector("div.quest-actions.edit").appendChild(editButton);

            element.firstChild.appendChild(liTempCard);
        });

    } catch (error) {
        document.querySelector("#questions-list-container li:first-of-type").textContent = "Não foi possível estabelecer conexão com o banco de dados...";
        console.error("Erro ao carregar questões para exibição: " + error);
    }
}

window.questionsCardLoader = questionsCardLoader;