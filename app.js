let task = document.getElementById("task");
let category = document.getElementById("category");
let deadline = document.getElementById("deadline");
let statusElement = document.getElementById("status"); // --- statusElement is to set a variable to refer to the HTML <select> element
let addTaskBtn = document.getElementById("addTaskBtn");
let taskList = document.getElementById("taskList");

// --- Click event with inner function to add task --- //

addTaskBtn.addEventListener("click", function() {
    let taskText = task.value.trim(); // ---Trim added to ignore spaces
    let categoryText = category.value.trim();
    let deadlineDate = deadline.value;
    let statusValue = statusElement.value;

    if (taskText === "" || categoryText === "" || deadlineDate === "") {
         alert("Please fill in all required fields!!!");
    return;
    }

    // --- Event to create list container --- //
    let listItem = document.createElement("li");

    // --- Create the task with information --- //
    listItem.textContent = `${taskText} | ${categoryText} | ${deadlineDate} | ${statusValue}`;

    taskList.appendChild(listItem);

    // --- clear inputs fields after adding tasks
    task.value = "";
    category.value = "",
    deadline.value = "",
    statusElement.value = "";
});

