let today = [];
let future = [];
let complete = [];

let task_detail = document.querySelector('.task_detail');
let date = document.querySelector('.date');
let priority = document.getElementById('priority');

const iconCheck = `<img src="img/check-circle 1.png" alt="complete">`;
const iconTrash = `<img src="img/trash 1.png" alt="delete">`;
const iconTrashColored = `<img src="img/2.png" alt="delete">`;

function toSortByPriority(task) {
    return task.sort((a, b) => {
        const priority_order = { high: 3, medium: 2, low: 1 };
        return priority_order[b.priority] - priority_order[a.priority];
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateLocalStorage() {
    const todoList = today.concat(future).concat(complete);
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function retrieveFromLocalStorage() {
    const storedData = localStorage.getItem('todoList');
    if (storedData) {
        const storedTodoList = JSON.parse(storedData);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        today = [];
        future = [];
        complete = [];

        storedTodoList.forEach(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            if (!item.completed && itemDate.getTime() === todayDate.getTime()) {
                today.push(item);
            } else if (!item.completed && itemDate.getTime() > todayDate.getTime()) {
                future.push(item);
            } else if (item.completed) {
                complete.push(item);
            }
        });
    }
}

window.addEventListener('load', function () {
    retrieveFromLocalStorage();
    renderTodo();
});

let main_btn = document.getElementById('main_btn');

main_btn.addEventListener('click', function () {
    var selectedDate = new Date(date.value);
    var todayDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    if (task_detail.value === '' || date.value === '' || priority.value === '') {
        alert('Please Enter all detail');
    } else if (selectedDate.getTime() > todayDate.getTime()) {
        let newEntry = { name: task_detail.value, date: selectedDate, priority: priority.value, completed: false };
        future.push(newEntry);
        task_detail.value = '';
        date.value = '';
        priority.value = '';
        renderTodo();
        updateLocalStorage();
    } else if (selectedDate.getTime() === todayDate.getTime()) {
        let newEntry = { name: task_detail.value, date: selectedDate, priority: priority.value, completed: false };
        today.push(newEntry);
        task_detail.value = '';
        date.value = '';
        priority.value = '';
        renderTodo();
        updateLocalStorage();
    } else {
        alert('You Can not Enter past Date');
    }
});

function renderTodo() {
    let Today_box_container1 = document.querySelector('.Today_box_container1');
    let Today_box_container2 = document.querySelector('.Today_box_container2');
    let Today_box_container3 = document.querySelector('.Today_box_container3');

    Today_box_container1.innerHTML = '';
    Today_box_container2.innerHTML = '';
    Today_box_container3.innerHTML = '';

    const sortedToday = toSortByPriority(today);
    const sortedFuture = toSortByPriority(future);
    const sortedComplete = toSortByPriority(complete);

    let todayid = 0;
    let futureid = 0;
    let completeid = 0;

    sortedToday.forEach(item => {
        todayid++;
        Today_box_container1.innerHTML += `
        <div class="box_body1">
            <div class="body_item1"><p>${todayid}. ${item.name}</p></div>
            <div class="body_item2"><p>${formatDate(item.date)}</p></div>
            <div class="body_item3"><p>${capitalizeFirstLetter(item.priority)}</p></div>
            <div class="body_item4">
                <span class="complete" data-task-type="today" data-task-index="${todayid - 1}">${iconCheck}</span>
                <span class="delete" data-task-type="today" data-task-index="${todayid - 1}">${iconTrash}</span>
            </div>
        </div>`;
    });

    sortedFuture.forEach(item => {
        futureid++;
        Today_box_container2.innerHTML += `
        <div class="box_body1">
            <div class="body_item1"><p>${futureid}. ${item.name}</p></div>
            <div class="body_item2"><p>${formatDate(item.date)}</p></div>
            <div class="body_item3"><p>${capitalizeFirstLetter(item.priority)}</p></div>
            <div class="body_item4">
                <span class="complete" data-task-type="future" data-task-index="${futureid - 1}">${iconCheck}</span>
                <span class="delete" data-task-type="future" data-task-index="${futureid - 1}">${iconTrash}</span>
            </div>
        </div>`;
    });

    sortedComplete.forEach(item => {
        completeid++;
        Today_box_container3.innerHTML += `
        <div class="box_body2">
            <div class="body_item1"><p>${completeid}. ${item.name}</p></div>
            <div class="body_item2"><p>${formatDate(item.date)}</p></div>
            <div class="body_item3"><p>${capitalizeFirstLetter(item.priority)}</p></div>
            <div class="body_item4">
                <span class="delete" data-task-type="complete" data-task-index="${completeid - 1}">${iconTrashColored}</span>
            </div>
        </div>`;
    });

    document.querySelectorAll('.complete').forEach(btn => {
        btn.addEventListener('click', function () {
            const task_type = this.getAttribute('data-task-type');
            const task_index = parseInt(this.getAttribute('data-task-index'));

            if (task_type === 'today') {
                let item = today.splice(task_index, 1)[0];
                item.completed = true;
                complete.push(item);
            } else if (task_type === 'future') {
                let item = future.splice(task_index, 1)[0];
                item.completed = true;
                complete.push(item);
            }
            renderTodo();
            updateLocalStorage();
        });
    });

    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', function () {
            const task_type = this.getAttribute('data-task-type');
            const task_index = parseInt(this.getAttribute('data-task-index'));

            if (task_type === 'today') {
                today.splice(task_index, 1);
            } else if (task_type === 'future') {
                future.splice(task_index, 1);
            } else if (task_type === 'complete') {
                complete.splice(task_index, 1);
            }
            renderTodo();
            updateLocalStorage();
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleDateString('en-GB');
}
