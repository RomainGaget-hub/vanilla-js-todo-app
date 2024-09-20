const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom;
let document;

beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    global.window = dom.window;
    global.document = document;
    require('./app.js');
});

afterEach(() => {
    jest.resetModules();
});

describe('To-Do List App', () => {
    test('should add a new task', () => {
        const taskInput = document.getElementById('new-task');
        const addButton = document.getElementById('add-task-button');
        taskInput.value = 'Test Task';
        addButton.click();

        const taskList = document.getElementById('task-list');
        const tasks = taskList.querySelectorAll('li');
        expect(tasks.length).toBe(1);
        expect(tasks[0].querySelector('span').textContent).toBe('Test Task');
    });

    test('should mark a task as completed', () => {
        const taskInput = document.getElementById('new-task');
        const addButton = document.getElementById('add-task-button');
        taskInput.value = 'Test Task';
        addButton.click();

        const taskList = document.getElementById('task-list');
        const checkbox = taskList.querySelector('input[type="checkbox"]');
        checkbox.click();

        expect(checkbox.checked).toBe(true);
        expect(taskList.querySelector('span').classList.contains('completed')).toBe(true);
    });

    test('should delete a task', () => {
        const taskInput = document.getElementById('new-task');
        const addButton = document.getElementById('add-task-button');
        taskInput.value = 'Test Task';
        addButton.click();

        const taskList = document.getElementById('task-list');
        const deleteButton = taskList.querySelector('button');
        deleteButton.click();

        const tasks = taskList.querySelectorAll('li');
        expect(tasks.length).toBe(0);
    });

    test('should edit a task', () => {
        const taskInput = document.getElementById('new-task');
        const addButton = document.getElementById('add-task-button');
        taskInput.value = 'Test Task';
        addButton.click();

        const taskList = document.getElementById('task-list');
        const editButton = taskList.querySelector('button:nth-of-type(2)');
        editButton.click();

        const taskInputField = taskList.querySelector('input[type="text"]');
        taskInputField.value = 'Updated Task';
        const saveButton = taskList.querySelector('button:nth-of-type(2)');
        saveButton.click();

        expect(taskList.querySelector('span').textContent).toBe('Updated Task');
    });

    test('should filter tasks', () => {
        const taskInput = document.getElementById('new-task');
        const addButton = document.getElementById('add-task-button');
        taskInput.value = 'Task 1';
        addButton.click();
        taskInput.value = 'Task 2';
        addButton.click();

        const taskList = document.getElementById('task-list');
        const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
        checkboxes[0].click();

        const filterCompleted = document.getElementById('filter-completed');
        filterCompleted.click();
        expect(taskList.querySelectorAll('li').length).toBe(1);
        expect(taskList.querySelector('span').textContent).toBe('Task 1');

        const filterActive = document.getElementById('filter-active');
        filterActive.click();
        expect(taskList.querySelectorAll('li').length).toBe(1);
        expect(taskList.querySelector('span').textContent).toBe('Task 2');

        const filterAll = document.getElementById('filter-all');
        filterAll.click();
        expect(taskList.querySelectorAll('li').length).toBe(2);
    });
});