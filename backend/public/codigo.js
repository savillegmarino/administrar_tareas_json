document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://administrar-tareas-json.onrender.com';


// Cargar tareas del servidor
function loadTasks() {
    console.log('Cargando tareas...');
    fetch(`${apiBaseUrl}/tasks`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar tareas');
            return response.json();
        })
        .then(tasks => {
            tasks.forEach(task => {
                displayTask(task);
            });
        })
        .catch(error => {
            console.error('Error al cargar tareas:', error);
            alert('No se pudieron cargar las tareas. Inténtalo más tarde.');
        });
}

// Mostrar tarea en la lista
function displayTask(task) {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'X';
    deleteButton.onclick = () => deleteTask(task);

    taskText.onclick = () => toggleCompletion(task);

    li.appendChild(taskText);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

// Agregar tarea
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = input.value.trim();
    if (!taskText) {
        alert('El campo de tarea no puede estar vacío');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    fetch('/tasks')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener tareas');
            return response.json();
        })
        .then(tasks => {
            tasks.push(newTask); // Agregar la nueva tarea a la lista
            updateTasksFile(tasks); // Actualizar el archivo con la nueva tarea
            displayTask(newTask); // Mostrar la nueva tarea en el DOM
            input.value = ''; // Limpiar el campo de entrada
        })
        .catch(error => {
            console.error('Error al agregar tarea:', error);
            alert('No se pudo agregar la tarea. Inténtalo más tarde.');
        });
});

// Marcar tarea como completada
function toggleCompletion(task) {
    fetch('/tasks')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener tareas');
            return response.json();
        })
        .then(tasks => {
            const updatedTasks = tasks.map(t =>
                t.id === task.id ? { ...t, completed: !t.completed } : t
            );
            updateTasksFile(updatedTasks);

            // Actualizar solo el elemento actual en el DOM
            const taskItem = Array.from(taskList.children).find(
                (li) => li.firstChild.textContent === task.text
            );
            if (taskItem) {
                taskItem.classList.toggle('completed', !task.completed);
            }
        })
        .catch(error => {
            console.error('Error al marcar tarea como completada:', error);
            alert('No se pudo actualizar la tarea. Inténtalo más tarde.');
        });
}

// Eliminar tarea
function deleteTask(task) {
    fetch('/tasks')
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener tareas');
            return response.json();
        })
        .then(tasks => {
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            updateTasksFile(updatedTasks);

            // Eliminar solo el elemento actual del DOM
            const taskItem = Array.from(taskList.children).find(
                (li) => li.firstChild.textContent === task.text
            );
            if (taskItem) {
                taskList.removeChild(taskItem);
            }
        })
        .catch(error => {
            console.error('Error al eliminar tarea:', error);
            alert('No se pudo eliminar la tarea. Inténtalo más tarde.');
        });
}

// Actualizar archivo JSON (simulado con un servidor)
function updateTasksFile(tasks) {
    fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar las tareas en el servidor');
            }
        })
        .catch(error => {
            console.error('Error al actualizar archivo:', error);
            alert('Hubo un problema al guardar las tareas. Inténtalo más tarde.');
        });
}
