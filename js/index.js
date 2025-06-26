// Lógica página home
function homeLoader() {
  syncLocalStorage();
  cardLoader(matters, 'Disciplinas', '.dashboard');
  cardLoader(contents, 'Assuntos', '.dashboard');
  cardLoader(courses, 'Cursos', '.dashboard');
  inputOptionsLoad('#type-content', ["Disciplina", "Assunto", "Curso"], 'Adicionar um(a) novo(a)...');
  
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
      alert("Disciplina adicionada com sucesso!");
      cardLoader(matters, 'Disciplinas', '.dashboard', true);
    break;
    case 1:
      contents.push(objValue);
      localStorage.setItem("contents", JSON.stringify(contents));
      alert("Assunto adicionado com sucesso!");
      cardLoader(contents, 'Assunto(s)', '.dashboard', true);
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