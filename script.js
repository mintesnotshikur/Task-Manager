const taskInput = document.querySelector('.taskInput');
const taskBtn = document.querySelector('.taskBtn');
const tasks = document.querySelector('#tasks');
const warning = document.querySelector('.warning');

const colors = ['#FFEBEE', '#E3F2FD', '#E8F5E9', '#FFF3E0', '#F3E5F5'];

let usedColors = [];

function getRandomColor() {
    if (usedColors.length === colors.length) {
        usedColors = [];
    }
    let color;
    do {
        color = colors[Math.floor(Math.random() * colors.length)];
    } while (usedColors.includes(color));
    usedColors.push(color);
    return color;
}

let allTasks = JSON.parse(localStorage.getItem("task")) || [];

if(allTasks) {
    allTasks.map((task, index) => {
        tasks.innerHTML += taskList(task.date, task.task, task.bgColor);
    });
    if(allTasks.length === 0) {
        tasks.innerHTML += '<p>No task available</p>';
    }
}

function addTask (e) {
    e.preventDefault();
    let task = taskInput.value;
    const bg_color = getRandomColor();

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const date = `${day}/${month}/${year}`;

    if (allTasks.length === 0) {
        tasks.innerHTML = "";
    }

    if(task.length != 0) {
        allTasks.push({
            date: date,
            task: task,
            bgColor: bg_color
        });
        console.log("allTasks: ", allTasks);
        localStorage.setItem("task", JSON.stringify(allTasks));
        tasks.innerHTML += taskList(date, task, bg_color);
        taskInput.value = '';
    } else {
        warning.classList.add('show');
        setTimeout(() => {
            warning.classList.remove('show');
        }, 2000);
        return
    }
}
taskBtn.addEventListener('click', (e) => addTask(e));


function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        const some = document.querySelector(`#ID${index}`);

        some.style.animationName = "fade-out";
        some.style.animationDuration = "1.3s";
        some.style.animationTimingFunction = "ease-in-out";
        some.style.animationIterationCount = "infinite"

        setTimeout(() => {
            allTasks.splice(index, 1);
            localStorage.setItem("task", JSON.stringify(allTasks));
            renderTasks();
        }, 1300);
    }
}

function editTask(index) {
    const task = allTasks[index];
    const newTask = prompt("Edit your task:", task.task);
    if (newTask !== null && newTask.trim() !== "") {
        allTasks[index].task = newTask;
        localStorage.setItem("task", JSON.stringify(allTasks));
        renderTasks();
    }
}


function taskList(time, text, bgColor, index) {
    return `
        <div class="task-list" id="ID${index}" style="background-color: ${bgColor};">
            <div class="task-header">
                <p class="task-date">${time}</p>
                <p>
                    <span class="material-symbols-outlined" onclick="deleteTask(${index})" style="cursor: pointer;">
                        delete
                    </span>
                </p>
            </div>
            <div class="task-body">
                <p class="task-text">${text}</p>
                <p>
                    <span class="material-symbols-outlined" onclick="editTask(${index})" style="cursor: pointer;">
                        edit
                    </span>
                </p>
            </div>
        </div>
    `;
}

function renderTasks() {
    tasks.innerHTML = "";
    if (allTasks.length === 0) {
        tasks.innerHTML = "<p>No task available</p>";
    } else {
        allTasks.slice().reverse().forEach((task, index) => {
            tasks.innerHTML += taskList(task.date, task.task, task.bgColor, allTasks.length - 1 - index);
        });
    }
}

renderTasks();
