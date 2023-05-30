import {createTaskModal} from './components/createTaskModal.js'
import {createCategoryModal} from './components/createCategoryModal.js'
import {editTaskModal} from './components/editTaskModal.js'
import {editCategoryModal} from './components/editCategory.js'

const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showCreateCategoryModal: false,
            showEditTaskModal: false,
            showEditCategoryModal: false,

            warning: {
                title:'',
                message:'',
            },

            taskSelectedId: -1,
            selectedCategoryId: -1,
            
            newItem: {task:'', category:''},
            newCategory: '',
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
        editCategoryModal: editCategoryModal,
    },

    template:
        `
        <div class="todo-list-container">
            <createTaskModal v-show="showCreateTaskModal" @closeModal="closeCreateTaskModal"
                @saveTask="saveTask" :categories="categories" @saveCategory="saveCategory" />

            <createCategoryModal v-show="showCreateCategoryModal" @closeModal="closeCreateCategoryModal"
                @saveCategory="saveCategory" :categories="categories" />

            <editCategoryModal v-show="showEditCategoryModal" @closeModal="closeEditCategoryModal"
                :categorySelected="selectedCategoryId" :categoriesList="categories"
                @saveCategories="saveCategories" @deleteCategory="deleteCategory" />

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
                                <button @click="finishTask(task.id)">Finish Task</button>
                            </div>
                        </div>
                        <h3>Finished tasks</h3>
                        <div v-for="task in tasks">
                            <div class="task-item" v-if="task.finished">
                                <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Unfinish Task</button>
                            </div>
                        </div>
                    </div>
                    <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in categories">
                        <div class="category-title">
                            <h2 @click="editCategory(category.id)" class="category-title">{{ category.name }}</h2>
                        </div>
                        <br/>
                        <div class="task-item" :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                            <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Finish Task</button>
                        </div>
                        <br/>
                        <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                        <div class="task-item" v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                            <input type="text" v-model="task.todo"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Unfinish Task</button>
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

        closeEditCategoryModal: function(){
            this.$data.showEditCategoryModal = false
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
                // get the next id
                id: parseInt(this.$data.categories.reduce((biggerId, categoryActual) => {
                    return Math.max(biggerId, categoryActual.id)
                }, -1))+1
            }
            this.$data.categories.push({id: category.id, name: category.name, isSelected:false, openToEdit:false})
            this.saveCategories()
            this.closeCreateCategoryModal()
        },

        editCategory: function(id){
            this.$data.selectedCategoryId = id
            this.$data.showEditCategoryModal = true
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

        selectCategory: function(categoryId){
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
                finished: false,
            })

            this.saveTasks()
            this.closeCreateTaskModal()
        },
        
        finishTask: function(id){
            let task = this.$data.tasks.find(task => task.id === id)
            task.finished = !task.finished

            this.saveTasks()
        },

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