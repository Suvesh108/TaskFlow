// ==========================================
// STATE MANAGEMENT
// ==========================================

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerTotalSeconds = 25 * 60;
let timerRunning = false;

let stopwatchInterval = null;
let stopwatchSeconds = 0;
let stopwatchRunning = false;
let lapCounter = 0;

// ==========================================
// DOM ELEMENTS
// ==========================================

// Theme
const themeToggle = document.getElementById('themeToggle');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Tasks
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Timer
const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerPause = document.getElementById('timerPause');
const timerReset = document.getElementById('timerReset');
const presetBtns = document.querySelectorAll('.preset-btn');
const customMinutes = document.getElementById('customMinutes');
const setCustomTime = document.getElementById('setCustomTime');
const timerProgress = document.getElementById('timerProgress');

// Stopwatch
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const stopwatchStart = document.getElementById('stopwatchStart');
const stopwatchPause = document.getElementById('stopwatchPause');
const stopwatchReset = document.getElementById('stopwatchReset');
const stopwatchLap = document.getElementById('stopwatchLap');
const lapsList = document.getElementById('lapsList');

// ==========================================
// THEME FUNCTIONALITY
// ==========================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ==========================================
// TAB NAVIGATION
// ==========================================

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab + 'Tab') {
                content.classList.add('active');
            }
        });
    });
});

// ==========================================
// TASK FUNCTIONALITY
// ==========================================

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    totalTasksEl.textContent = total;
    activeTasksEl.textContent = active;
    completedTasksEl.textContent = completed;
}

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
    });

    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <div class="task-checkbox"></div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete">×</button>
        `;

        // Toggle completion
        li.querySelector('.task-checkbox').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            updateStats();
            renderTasks();
        });

        // Delete task
        li.querySelector('.task-delete').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            updateStats();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === '') return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    taskInput.value = '';

    saveTasks();
    renderTasks();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderTasks();
    });
});

// ==========================================
// TIMER FUNCTIONALITY
// ==========================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerSeconds);
    updateTimerProgress();
}

function updateTimerProgress() {
    const circumference = 2 * Math.PI * 140;
    const progress = (timerSeconds / timerTotalSeconds) * circumference;
    const offset = circumference - progress;
    timerProgress.style.strokeDashoffset = offset;
}

function startTimer() {
    if (timerRunning) return;

    timerRunning = true;
    timerStart.disabled = true;
    timerPause.disabled = false;

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            playTimerSound();
            showNotification('Timer Complete!', 'Your timer has finished.');
        }
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    timerStart.disabled = false;
    timerPause.disabled = true;
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    timerSeconds = timerTotalSeconds;
    updateTimerDisplay();
}

function setTimerPreset(minutes) {
    pauseTimer();
    timerSeconds = minutes * 60;
    timerTotalSeconds = minutes * 60;
    updateTimerDisplay();

    // Update preset button states
    presetBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.minutes) === minutes) {
            btn.classList.add('active');
        }
    });
}

function playTimerSound() {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Timer Event Listeners
timerStart.addEventListener('click', startTimer);
timerPause.addEventListener('click', pauseTimer);
timerReset.addEventListener('click', resetTimer);

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        setTimerPreset(minutes);
    });
});

setCustomTime.addEventListener('click', () => {
    const minutes = parseInt(customMinutes.value);
    if (minutes && minutes > 0 && minutes <= 999) {
        setTimerPreset(minutes);
        customMinutes.value = '';

        // Remove active class from all presets
        presetBtns.forEach(btn => btn.classList.remove('active'));
    }
});

customMinutes.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setCustomTime.click();
    }
});

// ==========================================
// STOPWATCH FUNCTIONALITY
// ==========================================

function formatStopwatchTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchSeconds);
}

function startStopwatch() {
    if (stopwatchRunning) return;

    stopwatchRunning = true;
    stopwatchStart.disabled = true;
    stopwatchPause.disabled = false;
    stopwatchLap.disabled = false;

    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        updateStopwatchDisplay();
    }, 1000);
}

function pauseStopwatch() {
    stopwatchRunning = false;
    stopwatchStart.disabled = false;
    stopwatchPause.disabled = true;
    stopwatchLap.disabled = true;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchSeconds = 0;
    lapCounter = 0;
    updateStopwatchDisplay();
    lapsList.innerHTML = '';
}

function recordLap() {
    if (!stopwatchRunning) return;

    lapCounter++;
    const lapDiv = document.createElement('div');
    lapDiv.className = 'lap-item';
    lapDiv.innerHTML = `
        <span class="lap-number">Lap ${lapCounter}</span>
        <span class="lap-time">${formatStopwatchTime(stopwatchSeconds)}</span>
    `;

    lapsList.insertBefore(lapDiv, lapsList.firstChild);
}

// Stopwatch Event Listeners
stopwatchStart.addEventListener('click', startStopwatch);
stopwatchPause.addEventListener('click', pauseStopwatch);
stopwatchReset.addEventListener('click', resetStopwatch);
stopwatchLap.addEventListener('click', recordLap);

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
    initTheme();
    renderTasks();
    updateTimerDisplay();
    updateStopwatchDisplay();
}

// Start the app
init();
