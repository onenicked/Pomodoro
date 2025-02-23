let currentLanguage = localStorage.getItem('language') || 'ru';

const translations = {
    'ru': {
        title: 'Помодоро Таймер',
        subtitle: 'Управляйте своим временем и работайте продуктивнее!',
        startTimer: 'Запустить Таймер',
        settingsButton: 'Настройки',
        timerTitle: 'Таймер Помодоро',
        tasksTitle: 'Задачи',
        addTaskButton: 'Добавить',
        settingsTitle: 'Настройки Таймера',
        setTimer25: '25 минут (Обычная)',
        setTimer5: '5 минут (Короткая пауза)',
        setTimer15: '15 минут (Длинная пауза)',
        sessionLengthLabel: 'Длительность сессии:',
        start: 'Начать',
        reset: 'Сбросить',
        bgColorLabel: 'Цвет фона:',
        bgImageLabel: 'Фоновое изображение (URL):',
        applySettings: 'Применить'
    },
    'en': {
        title: 'Pomodoro Timer',
        sessionLengthLabel: 'Session Length:',
        subtitle: 'Manage your time and work more productively!',
        startTimer: 'Start Timer',
        settingsButton: 'Settings',
        timerTitle: 'Pomodoro Timer',
        tasksTitle: 'Tasks',
        addTaskButton: 'Add',
        settingsTitle: 'Timer Settings',
        setTimer25: '25 min (Standard)',
        setTimer5: '5 min (Short Break)',
        setTimer15: '15 min (Long Break)',
        start: 'Start',
        reset: 'Reset',
        bgColorLabel: 'Background Color:',
        bgImageLabel: 'Background Image (URL):',
        applySettings: 'Apply'
    }
};

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'ru') ? 'en' : 'ru';

    localStorage.setItem('language', currentLanguage);

    updateText();
}

function updateText() {
    document.getElementById('title').innerText = translations[currentLanguage].title;
    document.getElementById('subtitle').innerText = translations[currentLanguage].subtitle;
    document.getElementById('startTimer').innerText = translations[currentLanguage].startTimer;
    document.getElementById('settingsButton').innerText = translations[currentLanguage].settingsButton;
    document.getElementById('timerTitle').innerText = translations[currentLanguage].timerTitle;
    document.getElementById('tasksTitle').innerText = translations[currentLanguage].tasksTitle;
    document.getElementById('addTaskButton').innerText = translations[currentLanguage].addTaskButton;
    document.getElementById('settingsTitle').innerText = translations[currentLanguage].settingsTitle;
    document.getElementById('setTimer25').innerText = translations[currentLanguage].setTimer25;
    document.getElementById('setTimer5').innerText = translations[currentLanguage].setTimer5;
    document.getElementById('setTimer15').innerText = translations[currentLanguage].setTimer15;
    document.getElementById('sessionLengthLabel').innerText = translations[currentLanguage].sessionLengthLabel
    document.getElementById('start').innerText = translations[currentLanguage].start;
    document.getElementById('reset').innerText = translations[currentLanguage].reset;
    document.getElementById('bgColorLabel').innerText = translations[currentLanguage].bgColorLabel;
    document.getElementById('bgImageLabel').innerText = translations[currentLanguage].bgImageLabel;
    document.getElementById('applySettings').innerText = translations[currentLanguage].applySettings;
}

document.addEventListener('DOMContentLoaded', () => {
    updateText();

    const buttonClickSound = new Audio('assets/audio/click.mp3');
    buttonClickSound.volume = 0.1;

    document.querySelectorAll('button, a.button').forEach(button => {
        button.addEventListener('click', () => {
            buttonClickSound.currentTime = 0;
            buttonClickSound.play();
        });
    });

    // Таймер
    let timer;
    let isRunning = false;
    let timeLeft = 1500;

    const timeDisplay = document.getElementById('time');
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const sessionLengthInput = document.getElementById('sessionLength');

    function updateTimeDisplay() {
        if (!timeDisplay) return;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function setTimer(minutes) {
        timeLeft = minutes * 60;
        updateTimeDisplay();
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimeDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    alert("Сессия завершена!");
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = Number(sessionLengthInput.value) * 60 || 1500;
        updateTimeDisplay();
    }

    if (startButton) startButton.addEventListener('click', startTimer);
    if (resetButton) resetButton.addEventListener('click', resetTimer);

    window.setTimer = setTimer;

    // Задачи
    const taskInput = document.getElementById('newTask');
    const taskList = document.getElementById('taskList');

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = "";
        tasks.forEach(task => addTaskToDOM(task));
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.classList.add('task-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            if (checkbox.checked) {
                removeTask(task);
            }
        });

        const span = document.createElement('span');
        span.textContent = task;
        span.classList.add('task-text');

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Удалить';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            removeTask(task);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(taskText);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            addTaskToDOM(taskText);
            taskInput.value = "";
        }
    }

    function removeTask(taskToRemove) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task !== taskToRemove);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadTasks();
    }

    // Слушатель для кнопки добавления задачи
    document.querySelector("button[onclick='addTask()']").addEventListener("click", addTask);

    loadTasks();
});

// Настройки
function applySettings() {
    const bgColor = document.getElementById('bgColor').value;
    const bgImage = document.getElementById('bgImage').value;

    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
    }

    if (bgImage) {
        document.body.style.backgroundImage = `url('${bgImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }
}

window.applySettings = applySettings;