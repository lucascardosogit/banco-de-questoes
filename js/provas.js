import {getQuestions} from './api.js';

async function testsCardLoader() {
    const element = document.getElementById("tests-list-container");
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
            const tempCard = document.createElement("li");
            tempCard.appendChild(document.createElement("div"));
            tempCard.classList.add("question-card");

            tempCard.innerHTML = `
            <div class="quest-actions edit">
                <button type="button" onclick="urlRedirectById(${data_quest.idQuestao})"><img src="/public/img/edit-icon.svg" alt="Edit quest icon"></button>
            </div>
            <p>${data_quest.idQuestao}) ${data_quest.titulo}</p>
            <p>Disciplina: ${data_quest.disciplina}</p>
            <p class="question-header">Assuntos: ${(data_quest.assuntos).join(', ')}</p>
            `;
            element.firstChild.appendChild(tempCard);
        })

    } catch (error) {
        document.querySelector("#questions-list-container li:first-of-type").textContent = "Conexão com o banco de dados foi perdida...";
        console.error("Erro ao carregar questões para exibição: " + error);
    }
}

export function urlRedirectById(id) {
    window.location.href = `questao.html?id=${id}`;
}

window.urlRedirectById = urlRedirectById;
window.testsCardLoader = testsCardLoader;