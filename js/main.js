// DATE ELEMENT
const date = {
    element: document.getElementById('date'),

    dateOptions: {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    },

    today: new Date(),

    setDate() {
        this.element.innerHTML = this.today.toLocaleDateString('en-US', date.dateOptions);
    }
};


const taskManager = {
    taskList : [],
    id: 0,

    iconClasses: {
        checked: 'fa-check-square',
        unchecked: 'fa-square',
        faded: 'fade'
    },

    selectElements: function() {
        this.list = document.querySelector('.list');
        this.input = document.getElementById('input');
        this.refresh = document.querySelector('.refresh');
    },

    createTask: function(content, id, done, removed) {
        if (removed) {return;}

        const active = done ? this.iconClasses.checked : this.iconClasses.unchecked;
        const fade = done ? this.iconClasses.faded : '';

        const item = `
        <li class="item">
        <i class="fa ${active} co" data-status='complete' id=${id}></i>
        <p class="item__text ${fade}">${content}</p>
        <i class="fa fa-trash-o de trashbin" data-status="delete" id=${id}></i>
        </li>
        `;

        this.list.insertAdjacentHTML('beforeend', item);
    },

    addTask: function(e) {
        if (e.keyCode === 13 || e.which === 13) {
            const content = this.input.value;
            if (content) {
                this.createTask(content, this.id, false, false);
                this.taskList.push({
                    content: content,
                    id: this.id,
                    done: false,
                    removed: false
                });
                this.input.value = '';
                localStorage.setItem('task', JSON.stringify(this.taskList));
                this.id++;
            }
        }
    },

    completeTask(element) {
        element.classList.toggle(this.iconClasses.checked);
        element.parentNode.querySelector('.item__text').classList.toggle(this.iconClasses.faded);
        element.classList.toggle(this.iconClasses.unchecked);
        if (element.classList.contains(this.iconClasses.checked)) {
            this.taskList[element.id].done = true;
        } else if (element.classList.contains(this.iconClasses.unchecked)) {
            this.taskList[element.id].done = false;
        }
        localStorage.setItem('task', JSON.stringify(this.taskList));
    },

    deleteTask(element) {
        element.parentNode.parentNode.removeChild(element.parentNode);
        this.taskList[element.id].removed = true;
        localStorage.setItem('task', JSON.stringify(this.taskList));
    },

    manageItems(e) {
            const element = e.target;
            const status = element.dataset.status;

            if (status === 'complete') {
                this.completeTask(element);
            } else if (status === 'delete') {
                this.deleteTask(element);
            }
    },

    manageStorage() {
        let storage = localStorage.getItem('task');

        if (storage) {
            this.taskList = JSON.parse(storage);
            this.id = this.taskList.length;
            this.taskList.forEach(val => {
                taskManager.createTask(val.content, val.id, val.done, val.removed);
            });
        } else {
            this.taskList = [];
            this.id = 0;
        }
    },

    clearList() {
        this.refresh.addEventListener('click', function() {
            localStorage.clear();
            location.reload();
        });
    }
}

//INITIALIZE

date.setDate();

taskManager.selectElements();

document.addEventListener('keyup', e => {
    taskManager.addTask(e);
});

taskManager.clearList();

taskManager.list.addEventListener('click', e => {
    taskManager.manageItems(e);
});

window.addEventListener('load', function() {
    taskManager.manageStorage();
});

