const todoList = {
    data(){
        return{
            newItem: {type:'',task:''},
            newCategory: '',
            showAllTasks: true,
            //TODO: start id in 0
            nextId: 3,
            //TODO: start without tasks
            tasks: [{
                    id: 0,
                    isSelected: false,
                    openToEdit: false,
                    type:'Personal',
                    todo: 
                    [{
                        id:0,
                        task:'Make a book',
                        finished: false
                    }]
                },
                {
                    id: 1,
                    isSelected: false,
                    openToEdit: false,
                    type:'Carrer',
                    todo: 
                    [{
                        id:1,
                        task:'Write a program',
                        finished: false
                    },
                    {
                        id:2,
                        task:'Write 20 lines',
                        finished: true
                    }]
                },
            ],
        }
    },
    
    template:
        `<div class="todo-list-container">
        <h1>Todo List</h1>
        <div class="todo-list">
            <div class="add-task">
                <input type="text" id="task-name" v-model="newItem.task">
                <select v-model="newItem.type">
                    <option v-for="category in tasks">
                        {{ category.type }}
                    </option>
                </select>
                <button class="add-task-button" @click="addTask">Add Task</button>
            </div>
            <br/>
            <input type="text" v-model="newCategory">
            <button @click="addCategory">Add Category</button>
            <br/>
            <br/>
            <ul id="category-tabs">
                <li id="tab--1" class="active">
                    <button @click="showCategory(-1)">All Tasks</button>
                </li>
                <li :id="'tab-'+category.id" v-for="category in tasks">
                    <button :id="'btn-category-show-'+category.id" @click="showCategory(category.id)">{{ category.type }}</button>
                </li>
            </ul>
            
            <div v-show="showAllTasks">
                <h1>All Tasks</h1>
                <div v-for="category in tasks">
                    <div :id="'container-'+todo.id" v-for="todo in category.todo" >
                        <input type="checkbox" :id="'check-'+todo.id"
                            @click="endTask(todo.id)" v-if="!todo.finished">
                        <input type="text" v-if="!todo.finished"
                            v-model="todo.task" :id="'task-'+todo.id"
                            readonly>
                        <button :id="'btn-edit-'+todo.id" @click="editTask(todo.id)" v-if="!todo.finished">Edit</button>
                        <button :id="'btn-remove-'+todo.id" @click="removeTask(todo.id)" v-if="!todo.finished">Remove</button>
                    </div>
                </div>
                <h3>Finished tasks</h3>
                <div v-for="category in tasks">
                    <div v-for="todo in category.todo">
                        <input type="checkbox" :id="'check-'+todo.id"
                            @click="endTask(todo.id)" v-if="todo.finished" checked>
                        <input type="text" v-if="todo.finished"
                            v-model="todo.task" :id="'task-'+todo.id"
                            readonly>
                        <button :id="'btn-edit-'+todo.id" @click="editTask(todo.id)" v-if="todo.finished">Edit</button>
                        <button :id="'btn-remove-'+todo.id" @click="removeTask(todo.id)" v-if="todo.finished">Remove</button>
                    </div>
                </div>
            </div>
            <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in tasks">
                <div>
                    <h1 v-if="!category.openToEdit">{{ category.type }}</h1>
                    <input type="text" v-model="category.type" v-if="category.openToEdit">
                    <button @click="editCategory(category.id)" :id="'category-edit-'+category.id">Edit Category</button>
                </div>
                <br/>
                <div :id="'container-'+todo.id" v-for="todo in category.todo" >
                    <input type="checkbox" :id="'check-'+todo.id"
                        @click="endTask(todo.id)" v-if="!todo.finished">
                    <input type="text" v-if="!todo.finished"
                        v-model="todo.task" :id="'task-'+todo.id"
                        readonly>
                    <button :id="'btn-edit-'+todo.id" @click="editTask(todo.id)" v-if="!todo.finished">Edit</button>
                    <button :id="'btn-remove-'+todo.id" @click="removeTask(todo.id)" v-if="!todo.finished">Remove</button>
                </div>
                <br/>
                <h3 v-if="category.todo.filter(p => p.finished !== false).length > 0">Finished tasks</h3>
                <div v-for="todo in category.todo">
                    <input type="checkbox" :id="'check-'+todo.id"
                        @click="endTask(todo.id)" v-if="todo.finished" checked>
                    <input type="text" v-if="todo.finished"
                        v-model="todo.task" :id="'task-'+todo.id"
                        readonly>
                    <button :id="'btn-edit-'+todo.id" @click="editTask(todo.id)" v-if="todo.finished">Edit</button>
                    <button :id="'btn-remove-'+todo.id" @click="removeTask(todo.id)" v-if="todo.finished">Remove</button>
                </div>
            </div>
            <br/>
        </div>
    </div>`,
    
    methods: {
        findTask: function(id){
            return this.$data.tasks.filter(categ => categ.todo.find(task => task.id == id))[0].todo.find(task => task.id === id)
        },

        nextCategoryId: function(){
            let nextId = 0
            this.$data.tasks.forEach(category => {
                nextId = Math.max(category.id, nextId)
            })
            nextId++
            return nextId
        },

        addCategory: function(){
            let category = {
                type: this.$data.newCategory,
                id: this.nextCategoryId()
            }
            this.$data.newCategory = ''
            
            if(this.$data.tasks.find(item => item.type.toLocaleUpperCase() === category.type.toLocaleUpperCase())){
                alert('This category already exist')
            }else{
                this.$data.tasks.push({id: category.id, isSelected:false, openToEdit:false, type:category.type, todo:[]})
            }
        },

        editCategory: function(id){
            let category = this.$data.tasks.find(category => category.id == id)
            let btn = app.querySelector(`#category-edit-${id}`)
            if(btn.innerText.toLocaleLowerCase() !== 'save category'){
                category.openToEdit = true
                app.querySelector(`#category-edit-${id}`).innerText = 'Save Category'
            }else{
                category.openToEdit = false
                app.querySelector(`#category-edit-${id}`).innerText = 'Edit Category'
            }

        },

        showCategory: function(id){
            if(id !== -1){
                this.$data.showAllTasks = false
            }else{
                this.$data.showAllTasks = true
            }
            this.$data.tasks.forEach(category => {
                category.isSelected = (category.id === id)
            })
            Array.from(app.querySelector('#category-tabs').children).forEach(li => {
                li.className = (li.id === `tab-${id}`) ? 'active' : '' 
            })

        },

        addTask: function(){
            //TODO: start id in 0
            let newTask = {
                task: this.$data.newItem.task,
                type: this.$data.newItem.type,
                id: this.$data.nextId,
            }
            
            this.$data.newItem.type = ''
            this.$data.newItem.task = ''
            this.$data.nextId++

            this.$data.tasks.find(category => category.type === newTask.type)
                .todo.push({id:newTask.id, task:newTask.task, finished:false})
        },

        endTask: function(id){
            let task = this.findTask(id)
            task.finished = !task.finished
        },

        editTask: function(id){
            let btn = app.querySelector(`#btn-edit-${id}`)
            let task = app.querySelector(`#task-${id}`) 
            if(btn.innerText.toLocaleLowerCase() !== 'save'){
                task.removeAttribute('readonly')
                task.focus()
                btn.innerText = 'Save'
            }else{
                btn.innerText = 'Edit'
                task.setAttribute('readonly', 'readonly')
            }
        },

        removeTask: function(id){
            //TODO: Make a modal to confirm it
            let task = this.findTask(id)
            let category = this.$data.tasks.find(categ => categ.todo.find(task => task.id == id))
            let taskIndex = category.todo.indexOf(task)
            category.todo.splice(taskIndex, 1)
        },
    }
}

export {todoList}