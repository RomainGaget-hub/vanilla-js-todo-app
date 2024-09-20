// Helper Functions

// Function to create a task element
function createTaskElement(text, completed) {
    const newTask = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = text;
    if (completed) {
        taskText.classList.add('completed');
    }

    const deleteButton = createDeleteButton(newTask);
    const checkbox = createCheckbox(taskText, completed);
    const editButton = createEditButton(taskText, newTask);

    newTask.appendChild(checkbox);
    newTask.appendChild(taskText);
    newTask.appendChild(editButton);
    newTask.appendChild(deleteButton);

    return newTask;
}

// Function to create a delete button
function createDeleteButton(taskElement) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.id = 'delete-task-button';
    deleteButton.addEventListener('click', function () {
        taskElement.remove();
        saveTasks();
    });
    return deleteButton;
}

// Function to create a checkbox
function createCheckbox(taskText, completed) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', function () {
        taskText.classList.toggle('completed', checkbox.checked);
        saveTasks();
    });
    return checkbox;
}

// Function to create an edit button
function createEditButton(taskText, taskElement) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.id = 'edit-task-button';
    editButton.addEventListener('click', function () {
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.value = taskText.textContent;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', function () {
            taskText.textContent = taskInput.value;
            taskElement.replaceChild(taskText, taskInput);
            taskElement.replaceChild(editButton, saveButton);
            saveTasks();
        });

        taskElement.replaceChild(taskInput, taskText);
        taskElement.replaceChild(saveButton, editButton);
    });
    return editButton;
}

// Function to save tasks to local storage
function saveTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const completed = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed: completed });
    });
    localStorage.setItem("taskList", JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getTasks() {
    const taskList = document.getElementById('task-list');
    const tasks = JSON.parse(localStorage.getItem("taskList")) || [];
    tasks.forEach(task => {
        const newTask = createTaskElement(task.text, task.completed);
        taskList.appendChild(newTask);
    });
}

// Function to clear tasks
const clearTasks = () => {
    localStorage.removeItem('taskList');
    document.getElementById('task-list').innerHTML = '';
}

// Function to filter tasks
function filterTasks(filter) {
    const taskList = document.getElementById('task-list');
    const tasks = JSON.parse(localStorage.getItem("taskList")) || [];
    taskList.innerHTML = '';

    tasks.forEach(task => {
        if (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'active' && !task.completed)) {
            const newTask = createTaskElement(task.text, task.completed);
            taskList.appendChild(newTask);
        }
    });
}

// Main Logic

// Function to capture user input (task name) when they submit
const addTask = () => {
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    if (taskInput.value.trim() !== '') {
        const newTask = createTaskElement(taskInput.value, false);
        taskList.appendChild(newTask);
        saveTasks();
        taskInput.value = '';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', getTasks);
document.getElementById('add-task-button').addEventListener('click', addTask);
// document.getElementById('clear-tasks').addEventListener('click', clearTasks);
document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});


// Dark mode
document.getElementById('toggle-dark-mode').addEventListener('click', function () {
    // Toggles the 'dark-mode' class on the body element, switching between dark mode and light mode
    document.body.classList.toggle('dark-mode');
});




// Filter Event Listeners
document.getElementById('filter-all').addEventListener('click', function () {
    filterTasks('all');
});
document.getElementById('filter-completed').addEventListener('click', function () {
    filterTasks('completed');
});
document.getElementById('filter-active').addEventListener('click', function () {
    filterTasks('active');
});