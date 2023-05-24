import {createTaskModal} from './components/createTaskModal.js'
import {createCategoryModal} from './components/createCategoryModal.js'

const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showCreateCategoryModal: false,
            newItem: {task:'', category:''},
            newCategory: '',
            selectedCategoryId: -1,
            showAllTasks: true,
            categories: [],
            tasks: [],
        }
    },
    mounted(){
        if(localStorage.getItem('tasks')){
            try {
                this.$data.tasks = JSON.parse(localStorage.getItem('tasks'))
            } catch (e) {
                localStorage.removeItem('tasks')
            }
        }
        if(localStorage.getItem('categories')){
            try {
                this.$data.categories = JSON.parse(localStorage.getItem('categories'))
                // Making all categories start out hidden
                this.$data.categories.forEach(category => {
                    category.isSelected = false
                    category.openToEdit = false
                })
            } catch (e) {
                localStorage.removeItem('categories')
            }
        }
    },
    components:{
        createTaskModal: createTaskModal,
        createCategoryModal: createCategoryModal,
    },
    template:
        `<div class="todo-list-container">
        <createTaskModal v-show="showCreateTaskModal" @closeModal="closeCreateTaskModal"
            @saveTask="saveTask" :categories="categories" />
        <createCategoryModal v-show="showCreateCategoryModal" @closeModal="closeCreateCategoryModal"
            :categories="categories" />
        <h2>Todo List</h2>
        <div class="todo-list">
            <div id="add-task">
                <button id="add-task-button" @click="showCreateTaskModal=true">Add Task</button>
            </div>
            <br/>
            <div id="add-category">
                <button @click="showCreateCategoryModal = true">Add Category</button>
                <form @submit.prevent="">
                    <input type="text" v-model="newCategory" placeholder="Add a new category...">
                    <button id="add-category-button" @click="addCategory">Add Category</button>
                </form>
            </div>
            <br/>
            <br/>
            <div id="todo-wrapper">
                <div v-if="showAllTasks">
                    <h2>All Tasks</h2>
                    <div v-for="task in tasks">
                        <div class="task-item" v-if="!task.finished">
                            <button @click="endTask(task.id)" class="end-task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                                    <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                                    <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                </svg>
                            </button>
                            <input type="text" v-model="task.todo"
                            :id="'task-'+task.id" @click="editTask(task.id)" @blur="editTask(task.id)"
                                @keydown.enter="editTask(task.id)" readonly>
                            <button :id="'btn-edit-'+task.id" @click="editTask(task.id)" class="task-edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>
                            <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)" class="task-remove">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <h3>Finished tasks</h3>
                    <div v-for="task in tasks">
                        <div class="task-item" v-if="task.finished">
                            <button @click="endTask(task.id)" class="end-task">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                </svg>
                            </button>
                            <input type="text" v-model="task.todo"
                            :id="'task-'+task.id" @click="editTask(task.id)" @blur="editTask(task.id)"
                            @keydown.enter="editTask(task.id)" readonly>
                            <button :id="'btn-edit-'+task.id" @click="editTask(task.id)" class="task-edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>
                            <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)" class="task-remove">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                                </button>
                            </div>
                    </div>
                </div>
                <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in categories">
                    <div class="category-title">
                        <form @submit.prevent="">
                            <h2 v-show="!category.openToEdit" @click="editCategory(category.id)" class="category-title">{{ category.name }}</h2>
                            <input type="text" v-model="category.name" :id="'category-input-'+category.id" v-show="category.openToEdit">
                            <button @click="editCategory(category.id)" :id="'category-edit-'+category.id" class="category-edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                </svg>
                            </button>
                            <button @click="deleteCategory(category.id)" class="category-delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                    <br/>
                    <div class="task-item" :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                        <button @click="endTask(task.id)" class="end-task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
                                <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                                <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                            </svg>
                        </button>
                        <input type="text" v-model="task.todo" 
                        :id="'task-'+task.id" @click="editTask(task.id)" @blur="editTask(task.id)"
                        @keydown.enter="editTask(task.id)" readonly>
                        <button :id="'btn-edit-'+task.id" @click="editTask(task.id)" class="task-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>
                        <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)" class="task-remove">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                    </div>
                    <br/>
                    <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                    <div class="task-item" v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                        <button @click="endTask(task.id)" class="end-task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                        <input type="text" v-model="task.todo"
                        :id="'task-'+task.id" @click="editTask(task.id)" @blur="editTask(task.id)"
                        @keydown.enter="editTask(task.id)" readonly>
                        <button :id="'btn-edit-'+task.id" @click="editTask(task.id)" class="task-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>
                        <button :id="'btn-remove-'+task.id" @click="removeTask(task.id)" class="task-remove">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <br/>
            <ul class="category-tabs">
                <li id="tab--1" v-if="selectedCategoryId !== -1">
                    <button :id="'btn-category-show-'-1" @click="showCategory(-1)">All Tasks</button>
                </li>
                <li :id="'tab-'+category.id" v-for="category in categories.filter(category => category.id != selectedCategoryId)">
                    <button :id="'btn-category-show-'+category.id" @click="showCategory(category.id)">{{ category.name }}</button>
                </li>
            </ul>
        </div>
    </div>`,
    
    methods: {
        closeCreateTaskModal: function(){
            this.$data.showCreateTaskModal = false
        },

        closeCreateCategoryModal: function(){
            this.$data.showCreateCategoryModal = false
        },

        saveCategories: function(){
            let JsonCategories = JSON.stringify(this.$data.categories)
            localStorage.setItem('categories', JsonCategories)
        },

        saveTasks: function(){
            let JsonTasks = JSON.stringify(this.$data.tasks)
            localStorage.setItem('tasks', JsonTasks)
        },

        getTasksByCategory: function(categoryId){
            return this.$data.tasks.filter(task => task.categoryId == categoryId)
        },

        addCategory: function(){
            if(this.$data.newCategory.replace(/\s/g, '').length === 0){
                alert('Insert the name of category')
            }else{
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
                    this.saveCategories()
                }
            }
        },

        editCategory: function(id){
            let category = this.$data.categories.find(category => category.id == id)
            let btn = app.querySelector(`#category-edit-${id}`)
            let input = app.querySelector(`#category-input-${id}`)
            
            if(input.style.display == 'none'){
                category.openToEdit = true
            }else{
                category.openToEdit = false
                btn.blur()
                input.blur()
                this.saveCategories()
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

            this.$data.selectedCategoryId = -1
            this.$data.showAllTasks = true
            this.$data.categories.splice(categoryIndex, 1)

            this.saveCategories()
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
            
            this.$data.selectedCategoryId = id
        },

        saveTask: function({newItem}){
            let newTask = {
                task: newItem.todo,
                categoryId: newItem.categoryId,
                id: parseInt(this.$data.tasks.reduce((biggerId, taskActual) => {
                    return Math.max(biggerId, taskActual.id)
                }, -1))+1,
            }

            this.$data.tasks.push({
                id: newTask.id,
                todo: newTask.task,
                categoryId: newTask.categoryId,
                finished: false
            })

            this.saveTasks()
            this.closeCreateTaskModal()
        },
        
        endTask: function(id){
            let task = this.$data.tasks.find(task => task.id === id)
            task.finished = !task.finished

            this.saveTasks()
        },

        editTask: function(id){
            let task = app.querySelector(`#task-${id}`) 

            if(task.hasAttribute('readonly')){
                task.removeAttribute('readonly')
                task.focus()
            }else{
                task.setAttribute('readonly', 'readonly')
                task.blur()
                this.saveTasks()
            }
        },

        removeTask: function(id){
            //TODO: Make a modal to confirm it
            let task = this.$data.tasks.find(task => task.id === id)
            let taskIndex = this.$data.tasks.indexOf(task)
            this.$data.tasks.splice(taskIndex, 1)

            this.saveTasks()
        },
    }
}

export {todoList}