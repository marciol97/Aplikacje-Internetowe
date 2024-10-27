class Todo {
    constructor() {

        const savedTasks = localStorage.getItem('tasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [
            { text: 'Zrobić zakupy', deadline: '2024-10-31' },
            { text: 'Napisać raport', deadline: '2024-11-05' },
            { text: 'Odwiedzić siostrę', deadline: '2024-12-01' }
        ];

        this.term = '';
        this.draw();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    getFilteredTasks(){
        if(!this.term) return this.tasks;

        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    // Metoda renderująca listę zadań
    draw() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        const tasksToDisplay = this.getFilteredTasks();

        tasksToDisplay.forEach((task, index) => {
            const taskItem = document.createElement('li');

            // Zmieniamy text zadania, aby zawierał podświetlony term
            let highlightedText = task.text;
            if (this.term) {
                const regex = new RegExp(`(${this.term})`, 'gi');
                highlightedText = task.text.replace(regex, '<span class="highlight">$1</span>');
            }

            taskItem.innerHTML = `
            <span class="task-text">${highlightedText}</span>
            <span class="task-deadline">${task.deadline}</span>
            <button class="delete-task" data-index="${index}">❌</button>
        `;
            taskList.appendChild(taskItem);

            // Obsługa usunięcia zadania
            taskItem.querySelector('.delete-task').addEventListener('click', () => {
                this.removeTask(index);
            });

            // Obsługa edycji zadania
            taskItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-task')) {
                    this.editTask(index);
                }
            });
        });
    }


    // Metoda dodająca nowe zadanie
    addTask(taskText, taskDeadline) {
        const formatchange = taskDeadline ? taskDeadline.split('T')[0] : '';
        this.tasks.push({ text: taskText, deadline: formatchange });
        this.saveTasks();
        this.draw();  // Odśwież listę zadań
    }

    // Metoda usuwająca zadanie
    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();  // Odśwież listę zadań
    }

    // Metoda edytująca zadanie
    editTask(index) {
        const newTaskText = prompt("Edytuj zadanie:", this.tasks[index].text);
        const newTaskDeadline = prompt("Edytuj termin zadania (YYYY-MM-DD):", this.tasks[index].deadline);

        if (newTaskText && newTaskText.length >= 3 && newTaskText.length <= 255) {
            this.tasks[index].text = newTaskText;
            this.saveTasks();
            this.draw();
        } else {
            alert("Zadanie musi mieć od 3 do 255 znaków.");
        }

        if (newTaskDeadline) {
            const deadlineDate = new Date(newTaskDeadline);
            const today = new Date();
            if (deadlineDate > today) {
                this.tasks[index].deadline = newTaskDeadline;
                this.saveTasks();
                this.draw();
            } else {
                alert("Termin musi być datą w przyszłości.");
                return;
            }
        }
    }
}

// Inicjalizacja obiektu Todo
const todo = new Todo();

// Obsługa dodawania nowego zadania
document.getElementById('add-task').addEventListener('click', () => {
    const newTaskInput = document.getElementById('new-task');
    const taskDeadlineInput = document.getElementById('task-deadline');

    const taskText = newTaskInput.value.trim();
    const taskDeadline = taskDeadlineInput.value;

    if (taskText.length < 3 || taskText.length > 255) {
        alert('Zadanie musi mieć od 3 do 255 znaków.');
        return;
    }

    if (taskDeadline && new Date(taskDeadline) <= new Date()) {
        alert('Termin musi być pusty lub w przyszłości.');
        return;
    }

    todo.addTask(taskText, taskDeadline);

    newTaskInput.value = '';
    taskDeadlineInput.value = '';
});

document.getElementById('search').addEventListener('input', (e) => {
    todo.term = e.target.value;
    todo.draw();
})
