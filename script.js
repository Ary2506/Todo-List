const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const todayTasks = document.getElementById("todayTasks");
const futureTasks = document.getElementById("futureTasks");
const completedTasks = document.getElementById("completedTasks");

let todos =
JSON.parse(localStorage.getItem("todos")) || [];

document
.getElementById("addBtn")
.addEventListener("click", addTask);

function addTask(){

    const name = taskName.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;

    if(!name || !date || !priority){
        alert("Please fill all fields");
        return;
    }

    const task = {
        name,
        date,
        priority,
        completed:false
    };

    todos.push(task);

    saveTasks();

    taskName.value = "";
    taskDate.value = "";
    taskPriority.value = "";

    renderTasks();
}

function saveTasks(){
    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );
}

function deleteTask(index){

    todos.splice(index,1);

    saveTasks();

    renderTasks();
}

function toggleTask(index){

    todos[index].completed =
    !todos[index].completed;

    saveTasks();

    renderTasks();
}

function createTaskCard(task,index){

    return `
        <div class="task ${task.completed ? "completed" : ""}">
            <div>
                <h3>${task.name}</h3>

                <p>
                    ${task.date}
                </p>

                <p class="${task.priority.toLowerCase()}">
                    ${task.priority}
                </p>
            </div>

            <div class="actions">
                <button onclick="toggleTask(${index})">
                    ${task.completed ? "↩" : "✓"}
                </button>

                <button onclick="deleteTask(${index})">
                    🗑
                </button>
            </div>
        </div>
    `;
}

function renderTasks(){

    todayTasks.innerHTML = "";
    futureTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const today =
    new Date().toISOString().split("T")[0];

    todos.forEach((task,index)=>{

        const card =
        createTaskCard(task,index);

        if(task.completed){

            completedTasks.innerHTML += card;

        }
        else if(task.date === today){

            todayTasks.innerHTML += card;

        }
        else{

            futureTasks.innerHTML += card;
        }

    });
}

renderTasks();