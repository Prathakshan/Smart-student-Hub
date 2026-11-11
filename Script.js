// Smart Student Hub - JavaScript

// Get elements
const $ = (id) => document.getElementById(id);

// Safe HTML text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Load saved data
let notes = JSON.parse(localStorage.getItem("hubNotes")) || [];
let assignments = JSON.parse(localStorage.getItem("hubAssignments")) || [];
let tasks = JSON.parse(localStorage.getItem("hubTasks")) || [];

// Save data
function saveData() {
    localStorage.setItem("hubNotes", JSON.stringify(notes));
    localStorage.setItem("hubAssignments", JSON.stringify(assignments));
    localStorage.setItem("hubTasks", JSON.stringify(tasks));
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-link").forEach(button => {
        button.classList.remove("active");
    });

    $(pageId).classList.add("active");

    const selected = document.querySelector(
        `.nav-link[data-page="${pageId}"]`
    );

    if (selected) selected.classList.add("active");

    const titles = {
        dashboard: "Dashboard",
        notes: "My Notes",
        assignments: "Assignments",
        timetable: "Timetable",
        tasks: "To-Do List",
        timer: "Study Timer"
    };

    $("pageTitle").textContent = titles[pageId];
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// Current date
$("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

// Add Notes
$("addNoteBtn").addEventListener("click", () => {
    const title = $("noteTitle").value.trim();
    const content = $("noteContent").value.trim();

    if (!title || !content) {
        alert("Please enter both note title and content!");
        return;
    }

    notes.unshift({
        id: Date.now(),
        title,
        content
    });

    saveData();

    $("noteTitle").value = "";
    $("noteContent").value = "";

    renderAll();
});

// Display Notes
function renderNotes() {
    const list = $("notesList");
    const recent = $("recentNotes");

    if (notes.length === 0) {
        list.innerHTML = '<p class="empty">No notes added yet.</p>';
        recent.innerHTML = "No notes added yet.";
        return;
    }

    list.innerHTML = notes.map(note => `
        <div class="item">
            <div>
                <strong>${escapeHTML(note.title)}</strong>
                <p>${escapeHTML(note.content)}</p>
            </div>
            <button class="delete-btn"
                onclick="deleteNote(${note.id})">✕</button>
        </div>
    `).join("");

    recent.innerHTML = notes.slice(0, 3).map(note => `
        <div class="item">
            <div>
                <strong>${escapeHTML(note.title)}</strong>
                <p>${escapeHTML(note.content)}</p>
            </div>
        </div>
    `).join("");
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveData();
    renderAll();
}

// Add Assignments
$("addAssignmentBtn").addEventListener("click", () => {
    const title = $("assignmentTitle").value.trim();
    const subject = $("assignmentSubject").value.trim();
    const date = $("assignmentDate").value;

    if (!title || !subject || !date) {
        alert("Please fill all assignment details!");
        return;
    }

    assignments.unshift({
        id: Date.now(),
        title,
        subject,
        date
    });

    saveData();

    $("assignmentTitle").value = "";
    $("assignmentSubject").value = "";
    $("assignmentDate").value = "";

    renderAll();
});

// Display Assignments
function renderAssignments() {
    const list = $("assignmentsList");

    if (assignments.length === 0) {
        list.innerHTML =
            '<p class="empty">No assignments added yet.</p>';
        return;
    }

    list.innerHTML = assignments.map(item => `
        <div class="item">
            <div>
                <strong>${escapeHTML(item.title)}</strong>
                <p>Subject: ${escapeHTML(item.subject)}</p>
                <p>Due: ${escapeHTML(item.date)}</p>
            </div>
            <button class="delete-btn"
                onclick="deleteAssignment(${item.id})">✕</button>
        </div>
    `).join("");
}

function deleteAssignment(id) {
    assignments = assignments.filter(item => item.id !== id);
    saveData();
    renderAll();
}

// Add Tasks
$("addTaskBtn").addEventListener("click", addTask);

$("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

function addTask() {
    const input = $("taskInput");
    const text = input.value.trim();

    if (!text) {
        alert("Please enter a task!");
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text,
        completed: false
    });

    input.value = "";
    saveData();
    renderAll();
}

// Display Tasks
function renderTasks() {
    const list = $("taskList");

    if (tasks.length === 0) {
        list.innerHTML =
            '<p class="empty">No tasks added yet.</p>';
        return;
    }

    list.innerHTML = tasks.map(task => `
        <div class="item">
            <div class="${task.completed ? "done" : ""}">
                <strong>${escapeHTML(task.text)}</strong>
                <p>${task.completed ? "Completed" : "Pending"}</p>
            </div>
            <div>
                <button class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Done"}
                </button>
                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">✕</button>
            </div>
        </div>
    `).join("");
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveData();
    renderAll();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
    renderAll();
}

// Dashboard Statistics
function updateStats() {
    $("noteCount").textContent = notes.length;
    $("assignmentCount").textContent = assignments.length;

    $("completedCount").textContent =
        tasks.filter(task => task.completed).length;
}

// Render all sections
function renderAll() {
    renderNotes();
    renderAssignments();
    renderTasks();
    updateStats();
}

// Dark Mode
const themeBtn = $("themeBtn");

function updateThemeButton() {
    themeBtn.textContent = document.body.classList.contains("dark")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

if (localStorage.getItem("hubTheme") === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "hubTheme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );

    updateThemeButton();
});

// Study Timer
let timeLeft = 25 * 60;
let timerInterval = null;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    $("timerDisplay").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

$("startTimer").addEventListener("click", () => {
    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Study session completed! Great work!");
        }
    }, 1000);
});

$("pauseTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

$("resetTimer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// Initial setup
renderAll();
updateTimerDisplay();
