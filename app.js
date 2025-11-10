// ----- Get elements from the DOM -----//
const taskInput = document.getElementById("task");
const categoryInput = document.getElementById("category");
const deadlineInput = document.getElementById("deadline");
const statusSelect = document.getElementById("status");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const container = document.querySelector(".container");

// --- Category filter --- //
const categoryFilter = document.createElement("select");
categoryFilter.id = "categoryFilter";

const defaultCategoryOption = document.createElement("option");
defaultCategoryOption.value = "";
defaultCategoryOption.textContent = "Filter by Category";
categoryFilter.appendChild(defaultCategoryOption);

// --- Filter before tasks list --- //
container.insertBefore(categoryFilter, taskList);

// --- Status filter --- //
const statusFilter = document.createElement("select");
statusFilter.id = "statusFilter";

const defaultStatusOption = document.createElement("option");
defaultStatusOption.value = "";
defaultStatusOption.textContent = "Filter by Status";
statusFilter.appendChild(defaultStatusOption);

// --- Status options --- //
const statusOptions = ["In Progress", "Completed", "Overdue"];

for (let i = 0; i < statusOptions.length; i++) {
  const option = document.createElement("option");
  option.value = statusOptions[i];
  option.textContent = statusOptions[i];
  statusFilter.appendChild(option);
}
// --- Filter before tasks list --- //
container.insertBefore(statusFilter, taskList);

// --- Set for categories --- //
let categoriesSet = new Set();

// --- Array to save tasks --- //
let tasksArray = [];

// --- Local Storage Function --- //
window.onload = function() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasksArray = JSON.parse(savedTasks);

    for (let i = 0; i < tasksArray.length; i++) {
      addTaskToDOM(tasksArray[i]);
      categoriesSet.add(tasksArray[i].category);
    }

    updateCategoryFilter();
  }
};

// ----- Función que actualiza las opciones del filtro de categorías -----//
function updateCategoryFilter() {
  // --- Limpiar filtro y añadir opción por defecto
  categoryFilter.innerHTML = "";
  categoryFilter.appendChild(defaultCategoryOption);

  // ----- Recorrer las categorías desde el Set y agregarlas como opciones -----//
  let categoriesArray = Array.from(categoriesSet);
  for (let i = 0; i < categoriesArray.length; i++) {
    const option = document.createElement("option");
    option.value = categoriesArray[i];
    option.textContent = categoriesArray[i];
    categoryFilter.appendChild(option);
  }
}

// ----- Function to add tasks ----- //
function addTaskToDOM(taskObj) {
  const li = document.createElement("li");
  li.textContent = taskObj.task + " | " + taskObj.category + " | " + taskObj.deadline + " | ";

  li.setAttribute("data-category", taskObj.category);
  li.setAttribute("data-status", taskObj.status);

  // --- Crear select para status editable
  const statusSelect = document.createElement("select");
  const statuses = ["In Progress", "Completed", "Overdue"];

  for (let i = 0; i < statuses.length; i++) {
    const option = document.createElement("option");
    option.value = statuses[i];
    option.textContent = statuses[i];
    if (statuses[i] === taskObj.status) {
      option.selected = true;
    }
    statusSelect.appendChild(option);
  }

  // --- Escuchar cambio de status
  statusSelect.addEventListener("change", function() {
    const newStatus = this.value;
    li.setAttribute("data-status", newStatus);
    taskObj.status = newStatus;

    // --- Actualizar tasksArray (buscar y modificar)
    for (let i = 0; i < tasksArray.length; i++) {
      const t = tasksArray[i];
      if (t.task === taskObj.task && t.category === taskObj.category &&
          t.deadline === taskObj.deadline) {
        tasksArray[i].status = newStatus;
        break;
      }
    }

    // --- Guardar cambios
    localStorage.setItem("tasks", JSON.stringify(tasksArray));

    // --- Aplicar filtros para actualizar visibilidad si corresponde
    applyFilters();
  });

  li.appendChild(statusSelect);

  // --- Botón eliminar
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginLeft = "10px";

  deleteBtn.addEventListener("click", function() {
    taskList.removeChild(li);
    // --- Eliminar tarea del array
    const newTasks = [];
    for (let i = 0; i < tasksArray.length; i++) {
      const t = tasksArray[i];
      if (!(t.task === taskObj.task && t.category === taskObj.category &&
            t.deadline === taskObj.deadline && t.status === taskObj.status)) {
        newTasks.push(t);
      }
    }
    tasksArray = newTasks;

    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    updateCategoriesAfterDeletion();
    applyFilters();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// ----- Eventlistener to add new tasks -----//
addTaskBtn.addEventListener("click", function() {
  const taskText = taskInput.value.trim();
  const categoryText = categoryInput.value.trim();
  const deadlineDate = deadlineInput.value;
  const statusValue = statusSelect.value;

  if (taskText === "" || categoryText === "" || deadlineDate === "") {
    alert("Please fill in all required fields!!!");
    return;
  }

  const newTask = {
    task: taskText,
    category: categoryText,
    deadline: deadlineDate,
    status: statusValue
  };

  tasksArray.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasksArray));

  addTaskToDOM(newTask);

  categoriesSet.add(categoryText);
  updateCategoryFilter();

  // --- Clear inputs --- //
  taskInput.value = "";
  categoryInput.value = "";
  deadlineInput.value = "";
  statusSelect.value = "";
});

// --- Funtion to updatde categories after deleting tasks --- //
function updateCategoriesAfterDeletion() {
  categoriesSet.clear();

  const items = taskList.querySelectorAll("li");

  for (let i = 0; i < items.length; i++) {
    const cat = items[i].getAttribute("data-category");
    categoriesSet.add(cat);
  }

  updateCategoryFilter();
}

// ----- Function to hide/show filtered tasks -----//
function applyFilters() {
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  const items = taskList.querySelectorAll("li");

  for (let i = 0; i < items.length; i++) {
    const cat = items[i].getAttribute("data-category");
    const stat = items[i].getAttribute("data-status");

    let matchCategory = false;
    if (selectedCategory === "" || selectedCategory === cat) {
      matchCategory = true;
    }

    let matchStatus = false;
    if (selectedStatus === "" || selectedStatus === stat) {
      matchStatus = true;
    }

    if (matchCategory && matchStatus) {
      items[i].style.display = "";
    } else {
      items[i].style.display = "none";
    }
  }
}

// --- Agregar eventos para filtrar mientras se selecciona ---//
categoryFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
