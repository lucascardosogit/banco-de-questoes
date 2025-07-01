import {getTests, redirect} from './api.js';

async function testsCardLoader() {
    const element = document.getElementById("tests-list-container");
    element.appendChild(document.createElement("ul"));
    element.firstChild.innerHTML = `<li>Carregando provas...</li>`;

    try {
        const data = await getTests();

        if(data.length === 0) {
            element.firstChild.innerHTML = `<li>Não há provas registradas em banco.</li>`;
            return;
        } else {
            element.querySelector("li:first-of-type").remove();
        }

        data.forEach((data_test) => {
            const liTempCard = document.createElement("li");
            const liDivTempCard = document.createElement("div");
            liTempCard.appendChild(liDivTempCard);
            liDivTempCard.classList.add("test-card");


            liDivTempCard.innerHTML = `
            <div class="test-actions edit"></div>
            <p>Título: ${data_test.titulo}</p>
            <p>Disciplina: ${data_test.disciplina}</p>
            <p class="categories">Quantidade de Questões: ${data_test.quantidadeQuestoes}</p>
            `;

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.innerHTML = '<img src="/public/img/edit-icon.svg" alt="Edit test icon">';
            editButton.addEventListener("click", () => {
                redirect('prova.html', {id: `${data_test.idProva}`});
            });

            liDivTempCard.querySelector("div.test-actions.edit").appendChild(editButton);

            element.firstChild.appendChild(liTempCard);
        })

    } catch (error) {
        document.querySelector("#tests-list-container li:first-of-type").textContent = "Não foi possível estabelecer conexão com o banco de dados...";
        console.error("Erro ao carregar provas para exibição: " + error);
    }
}

window.testsCardLoader = testsCardLoader;