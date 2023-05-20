const todoList = {
    data(){
        return{
            newItem: {task:'', category:''},
            newCategory: '',
            showAllTasks: true,
            //TODO: start id in 0
            nextId: 3,
            categories: 
            [{
                id: 0,
                name: 'Personal',
                isSelected: false,
                openToEdit: false,
            },
            {
                id: 1,
                name: 'Carrer',
                isSelected: false,
                openToEdit: false,
            }],

            //TODO: start without tasks
            tasks: 
            [{
                id: 0,
                todo: 'Read the book about squids',
                categoryId: 0,
                finished: false,
            },
            {
                id: 1,
                todo: 'Write code',
                categoryId: 1,
                finished: false, 
            }],
        }
    },
    
    template:
        `<div class="todo-list-container">
        <h1>Todo List</h1>
        <div class="todo-list">
            <div class="add-task">
                <input type="text" id="task-name" v-model="newItem.task">
                <select v-model="newItem.category">
                    <option :value="category.id" v-for="category in categories">
                        {{ category.name }}
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
                <li :id="'tab-'+category.id" v-for="category in categories">
                    <button :id="'btn-category-show-'+category.id" @click="showCategory(category.id)">{{ category.name }}</button>
                </li>
            </ul>
            
            <div v-show="showAllTasks">
                <h1>All Tasks</h1>
                <div v-for="task in tasks">
                    <div v-if="!task.finished">
                        <input type="checkbox" :id="'check-'+task.id"
                            @click="endTask(task.id)">
                        <input type="text" v-model="task.todo"
                            :id="'task-'+task.id" readonly>
                        <button :id="'btn-edit-'+task.id" @click="editTask(task.id)">Edit</button>
                        <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)">Remove</button>
                    </div>
                </div>
                <h3>Finished tasks</h3>
                <div v-for="task in tasks">
                    <div v-if="task.finished">
                        <input type="checkbox" :id="'check-'+task.id"
                            @click="endTask(task.id)" checked>
                        <input type="text" v-model="task.todo"
                            :id="'task-'+task.id" readonly>
                        <button :id="'btn-edit-'+task.id" @click="editTask(task.id)">Edit</button>
                        <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)">Remove</button>
                    </div>
                </div>
            </div>
            <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in categories">
                <div>
                    <h1 v-if="!category.openToEdit">{{ category.name }}</h1>
                    <input type="text" v-model="category.name" v-if="category.openToEdit">
                    <button @click="editCategory(category.id)" :id="'category-edit-'+category.id">Edit Category</button>
                    <button @click="deleteCategory(category.id)">Delete Category</button>
                </div>
                <br/>
                <div :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                    <input type="checkbox" :id="'check-'+task.id"
                        @click="endTask(task.id)">
                    <input type="text" v-model="task.todo"
                        :id="'task-'+task.id" readonly>
                    <button :id="'btn-edit-'+task.id" @click="editTask(task.id)">Edit</button>
                    <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)">Remove</button>
                </div>
                <br/>
                <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                <div v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                    <input type="checkbox" :id="'check-'+task.id"
                        @click="endTask(task.id)" checked>
                    <input type="text"
                        v-model="task.todo" :id="'task-'+task.id"
                        readonly>
                    <button :id="'btn-edit-'+task.id" @click="editTask(task.id)">Edit</button>
                    <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)">Remove</button>
                </div>
            </div>
            <br/>
        </div>
    </div>`,
    
    methods: {
        getTasksByCategory: function(categoryId){
            return this.$data.tasks.filter(task => task.categoryId == categoryId)
        },

        addCategory: function(){
            let category = {
                type: this.$data.newCategory,
                id: parseInt(this.$data.categories.reduce((biggerId, categoryActual) => {
                    return Math.max(biggerId, categoryActual.id)
                }, -1))+1
            }
            this.$data.newCategory = ''

            if(this.$data.categories.find(cat => cat.name.toLocaleLowerCase() == category.type.toLocaleLowerCase())){
                //TODO: Make a modal to alert it
                alert('This category already exist')
            }else{
                this.$data.categories.push({id: category.id, name: category.type, isSelected:false, openToEdit:false})
            }
        },

        editCategory: function(id){
            let category = this.$data.categories.find(category => category.id == id)
            let btn = app.querySelector(`#category-edit-${id}`)

            if(btn.innerText.toLocaleLowerCase() !== 'save category'){
                category.openToEdit = true
                app.querySelector(`#category-edit-${id}`).innerText = 'Save Category'
            }else{
                category.openToEdit = false
                app.querySelector(`#category-edit-${id}`).innerText = 'Edit Category'
            }
        },

        deleteCategory: function(id){
            let category = this.$data.categories.find(category => category.id === id)
            let categoryIndex = this.$data.categories.indexOf(category)
            
            let tasksToRemove = this.$data.tasks.filter(task => task.categoryId == category.id)

            tasksToRemove.forEach(task => {
                if(task.categoryId === category.id){
                    this.removeTask(task.id)
                }
            })
            this.$data.categories.splice(categoryIndex, 1)
        },

        showCategory: function(id){
            if(id !== -1){
                this.$data.showAllTasks = false
            }else{
                this.$data.showAllTasks = true
            }

            this.$data.categories.forEach(category => {
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
                category: this.$data.newItem.category,
                id: parseInt(this.$data.tasks.reduce((biggerId, taskActual) => {
                    return Math.max(biggerId, taskActual.id)
                }, -1))+1,
            }

            this.$data.newItem.task = ''
            this.$data.newItem.category = ''

            this.$data.tasks.push({
                id: newTask.id,
                todo: newTask.task,
                categoryId: newTask.category,
                finished: false
            })
        },

        endTask: function(id){
            let task = this.$data.tasks.find(task => task.id === id)
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
            let task = this.$data.tasks.find(task => task.id === id)
            let taskIndex = this.$data.tasks.indexOf(task)
            this.$data.tasks.splice(taskIndex, 1)
        },
    }
}

export {todoList}