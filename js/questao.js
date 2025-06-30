import {postQuestion, getQuestionById, putQuestion, deleteQuestion} from './api.js';

async function setQuest() {
  let params = (new URLSearchParams(window.location.search)).get('id');

  const course = document.getElementById("quest-course").value.trim();
  const subjects = document.getElementById("quest-subjects").value.split(",").map(sub => sub.trim());
  const questHeader = document.getElementById("quest-header").value.trim();
  const correctAltIndex = document.querySelector('input[name="isCorrect"]:checked');
  const alternativeInputs = Array.from(document.querySelectorAll(".alternative-input"));
  const allAlternativesFilled = alternativeInputs.every(alt => alt.value.trim() !== "");

  if (!course || subjects[0] === "" || !questHeader || !correctAltIndex || !allAlternativesFilled) {
    alert("Preencha todos os campos da questão e selecione qual a alternativa correta.");

    if(!course) {
      document.getElementById("quest-course").style.border = '2px solid red';
      document.getElementById("quest-course").placeholder = "Campo 'Disciplina' não pode estar vazio";
    } else {
      document.getElementById("quest-course").style.border = '1px solid #ccc';
    }

    if(subjects[0] === "") {
      document.getElementById("quest-subjects").style.border = '2px solid red';
      document.getElementById("quest-subjects").placeholder = "Campo 'Assunto (s)' não pode estar vazio";
    } else {
      document.getElementById("quest-subjects").style.border = '1px solid #ccc';
    }

    if(!questHeader) {
      document.getElementById("quest-header").style.border = '2px solid red';
      document.getElementById("quest-header").placeholder = "Campo 'Título da Questão' não pode estar vazio";
    } else {
      document.getElementById("quest-header").style.border = '1px solid #ccc';
    }

    if(!correctAltIndex) {
      const inputsRadio = document.querySelectorAll("input[type='radio']");
      inputsRadio.forEach(input => input.style.outline = "2px solid red");      
    } else {
      const inputsRadio = document.querySelectorAll("input[type='radio']");
      inputsRadio.forEach(input => input.style.outline = "none"); 
    }

    if(!allAlternativesFilled) {
      alternativeInputs.forEach(alt => {
        if(alt.value === "") {
          alt.style.border = "2px solid red";
        } else {
          alt.style.border = "1px solid #ccc";
        }
      })
    } else {
      alternativeInputs.forEach(alt => alt.style.border = "1px solid #ccc");
    }

    return;
  }

  const alternatives = alternativeInputs.map((alt, index) => ({
    descricao: alt.value.trim(),
    correta: index === parseInt(correctAltIndex.value) ? true : false,
  }));

  const newQuest = {
    titulo: questHeader,
    disciplina: course,
    assuntos: subjects,
    alternativas: alternatives,
  };

  try {

    if(params) {
      await putQuestion(params, newQuest);
      alert(`Questão editada com sucesso!`);
    } else {
      await postQuestion(newQuest);
      alert(`Questão adicionada com sucesso!`);
    }
    
    document.getElementById("quest-form").reset();
    
  } catch (error) {
    console.error(`Erro ao salvar a questão no banco de dados: ${error}`);
  }
}

async function loadQuestionForEdit() {
  let params = (new URLSearchParams(window.location.search)).get('id');
  
  if(!params) {
    return;
  }

  let buttonForInsert = document.querySelector(".alternative+div.quest-actions > button");
  buttonForInsert.classList.add("edit");
  buttonForInsert.innerHTML = "<img src='/public/img/check-icon.svg' alt='Insert button'> Inserir";

  try {
    const data = await getQuestionById(params);

    if(!data) {
      alert(`Questão de ID ${params} não encontrada!`);
      return;
    }
    
    document.querySelector("h1").textContent = "Edição de Questão";

    document.getElementById('quest-course').value = data.disciplina;
    document.getElementById('quest-subjects').value = (data.assuntos).join(', ');
    document.getElementById('quest-header').value = data.titulo;

    const inputs = Array.from(document.querySelectorAll('.alternative-input'));

    inputs.forEach((input, index) => {
      input.value = data.alternativas[index].descricao;

      if(data.alternativas[index].correta){
        document.querySelector(`input[type='radio'][value='${index}']`).checked = true;
      }
    });

    let buttonForDelete = document.createElement("button"); 
    buttonForDelete.classList.add("delete");

    buttonForDelete.onclick = async () => {
      let deleteConfirmation = confirm("Tem certeza que deseja excluir esta questão?");
      console.log(deleteConfirmation);
    if (deleteConfirmation) {
      try {
        await deleteQuestion(data.idQuestao);
        alert("Questão excluída com sucesso!");
        window.location.href = "questoes.html";
      } catch (error) {
        alert("Erro ao excluir questão!");
        console.error("Erro ao excluir:", error);
      }
    };
};

    buttonForDelete.innerHTML = '<img src="/public/img/delete-svg.svg" alt="Delete button"> Excluir';
    document.querySelector('.quest-actions').appendChild(buttonForDelete);
    
  } catch (error) {
    console.error(`Erro ao carregar questão para edição: ${error}`);
  }
}

document.addEventListener('DOMContentLoaded', loadQuestionForEdit);

window.setQuest = setQuest;