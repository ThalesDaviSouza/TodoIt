import {createTaskModal} from './components/createTaskModal.js'
import {createCategoryModal} from './components/createCategoryModal.js'
import {editTaskModal} from './components/editTaskModal.js'

const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showCreateCategoryModal: false,
            showEditTaskModal: false,

            warning: {
                title:'',
                message:'',
            },

            taskSelectedId: -1,
            
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
        editTaskModal: editTaskModal,
    },
    template:
        `
        <div class="todo-list-container">
            <createTaskModal v-show="showCreateTaskModal" @closeModal="closeCreateTaskModal"
                @saveTask="saveTask" :categories="categories" @saveCategory="saveCategory" @chooseCategory="showChooseCategoryModal = true"/>

            <createCategoryModal v-show="showCreateCategoryModal" @closeModal="closeCreateCategoryModal"
                @saveCategory="saveCategory" :categories="categories" />

            <h2>Todo List</h2>
            <div class="todo-list">
                <div id="add-task">
                    <button id="add-task-button" @click="showCreateTaskModal=true">Add Task</button>
                </div>
                <br/>
                <div id="add-category">
                    <button id="add-category-button" @click="showCreateCategoryModal = true">Add Category</button>
                </div>
                <br/>
                <br/>

                <editTaskModal v-if="showEditTaskModal"
                    :categories="categories" :tasks="tasks" :taskSelectedId="taskSelectedId"
                    @closeModal="closeEditTaskModal" @saveCategory="saveCategory"
                    @deleteTask="removeTask" @saveChanges="saveTasks" />

                <div id="todo-wrapper">
                    <div v-if="showAllTasks">
                        <h2>All Tasks</h2>
                        <div v-for="task in tasks">
                            <div class="task-item" v-if="!task.finished">
                                <input type="text" v-model="task.todo"
                                    :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                            </div>
                        </div>
                        <h3>Finished tasks</h3>
                        <div v-for="task in tasks">
                            <div class="task-item" v-if="task.finished">
                                <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
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
                            <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                        </div>
                        <br/>
                        <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                        <div class="task-item" v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                            <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
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
        </div>
    `,
    
    methods: {
        closeCreateTaskModal: function(){
            this.$data.showCreateTaskModal = false
        },

        closeCreateCategoryModal: function(){
            this.$data.showCreateCategoryModal = false
        },

        closeEditTaskModal: function(){
            this.$data.showEditTaskModal = false
            this.$data.taskSelectedId = -1
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

        saveCategory: function(newCategory){
            let category = {
                name: newCategory.name,
                id: parseInt(this.$data.categories.reduce((biggerId, categoryActual) => {
                    return Math.max(biggerId, categoryActual.id)
                }, -1))+1
            }
            this.$data.categories.push({id: category.id, name: category.name, isSelected:false, openToEdit:false})
            this.saveCategories()
            this.closeCreateCategoryModal()
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
            console.log(this.$data.categories, id)
        },

        selectCategory: function(categoryId){
            console.log(categoryId)
            this.$data.newItem.categoryId = categoryId
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

        // editTask: function(id){
        //     let task = app.querySelector(`#task-${id}`) 

        //     if(task.hasAttribute('readonly')){
        //         task.removeAttribute('readonly')
        //         task.focus()
        //     }else{
        //         task.setAttribute('readonly', 'readonly')
        //         task.blur()
        //         this.saveTasks()
        //     }
        // },

        editTask: function(id){
            this.$data.taskSelectedId = id
            this.showEditTaskModal = true
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