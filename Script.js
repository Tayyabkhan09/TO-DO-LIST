// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            text: taskText,
            completed: false
        };

        const li = createTaskElement(task);

        taskList.appendChild(li);
        saveTask(task);

        taskInput.value = '';
        taskInput.focus();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = task.text;
        span.addEventListener('click', () => toggleTaskCompletion(li, task));
        li.appendChild(span);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('editButton');
        editButton.addEventListener('click', () => editTask(li, span, task));
        li.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('deleteButton');
        deleteButton.addEventListener('click', () => deleteTask(li, task));
        li.appendChild(deleteButton);

        return li;
    }

    function toggleTaskCompletion(li, task) {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        updateTaskStorage();
    }

    function editTask(li, span, task) {
        const newTaskText = prompt('Edit task:', span.textContent);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            span.textContent = newTaskText.trim();
            task.text = newTaskText.trim();
            updateTaskStorage();
        }
    }

    function deleteTask(li, task) {
        if (confirm('Are you sure you want to delete this task?')) {
            taskList.removeChild(li);
            removeTaskFromStorage(task);
        }
    }

    function saveTask(task) {
        const tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    }

    function updateTaskStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const span = li.querySelector('span');
            const task = {
                text: span.textContent,
                completed: li.classList.contains('completed')
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function removeTaskFromStorage(task) {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(t => t.text !== task.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
