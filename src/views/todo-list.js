// Classes
import {Task, Category} from '../assets/js/classes.js'

// Modals
import {createTaskModal} from '../common/components/createTaskModal.js'
import {taskViewModal} from '../common/components/taskViewModal.js'
import {editTaskModal} from '../common/components/editTaskModal.js'
import {createCategoryModal} from '../common/components/createCategoryModal.js'
import {editCategoryModal} from '../common/components/editCategory.js'

// Other Components
import { taskItem } from '../common/components/taskItem.js';
import { menu } from '../common/components/menu.js';


const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showEditTaskModal: false,
            showEditCategoryModal: false,
            showTaskViewModal: false,
            showMenu: false,

            warning: {
                title:'',
                message:'',
            },

            taskSelectedId: -1,
            selectedCategoryId: -1,
            editCategoryId: -1,
            
            newCategory: '',
            showAllTasks: true,
            categories: [],
            tasks: [],
        }
    },

    computed: {
        selectedCategory(){
            return this.$data.selectedCategoryId != -1 ? this.$data.categories.find(category => category.id == this.$data.selectedCategoryId) : null
        },

    },

    mounted(){
        if(localStorage.getItem('tasks')){
            try {
                this.$data.tasks = JSON.parse(localStorage.getItem('tasks'))
                this.$data.tasks.forEach(task => {
                    if(task.dueDate){
                        task.dueDate = new Date(task.dueDate)
                    }
                })
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
        taskViewModal: taskViewModal,
        editTaskModal: editTaskModal,
        createCategoryModal: createCategoryModal,
        editCategoryModal: editCategoryModal,
        taskItem: taskItem,
        sideMenu: menu,
    },

    template:
        `
        <div class="todo-list-container">
            <sideMenu v-if="showMenu" @closeMenu="closeMenu" @selectCategory="selectTabCategory" @editCategory="editCategory"
                :categories="categories" :selectedCategoryId="selectedCategoryId"  />

            <createTaskModal v-show="showCreateTaskModal" @closeModal="closeCreateTaskModal"
                @saveTask="saveTask" :categories="categories" @saveCategory="saveCategory" />

            <editCategoryModal v-show="showEditCategoryModal" @closeModal="closeEditCategoryModal"
                :categorySelected="editCategoryId" :categoriesList="categories"
                @saveCategories="saveCategories" @deleteCategory="deleteCategory" />

            <div v-show="showTaskViewModal">
                <taskViewModal @closeModal="closeTaskViewModal" :tasks="tasks" :taskSelectedId="taskSelectedId"
                    @editTask="editTask" @deleteTask="removeTask" @finishTask="finishTask" />
            </div>
            
            <editTaskModal v-if="showEditTaskModal"
                :categories="categories" :tasks="tasks" :taskSelectedId="taskSelectedId"
                @closeModal="closeEditTaskModal" @saveCategory="saveCategory"
                @deleteTask="removeTask" @saveChanges="saveTasks" />

            <div class="todo-list">
                <button class="open-menu-btn" @click="showMenu=true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </button>
                
                <button class="open-modal-btn" @click="showCreateTaskModal=true">Add Task</button>
                
                <section id="todo-wrapper">
                    <div v-if="showAllTasks">
                        <h2>All Tasks</h2>
                        <span>Complete: {{ getAllTasksDone().length }}/{{ tasks.length }}</span>
                        <div v-for="task in tasks">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"
                            @viewTask="viewTask" v-if="!task.finished"/> 
                        </div>
                        <h3>Finished tasks</h3>
                        <div v-for="task in tasks">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"
                            @viewTask="viewTask" v-if="task.finished"/> 
                        </div>
                    </div>
                    <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in categories">
                        <h2 @click="editCategory(category.id)" class="category-title">{{ category.name }}</h2>
                        <span>Complete: {{ getTasksDoneByCategory(category.id).length }}/{{ getTasksByCategory(category.id).length }}</span>
                        <div :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"
                                @viewTask="viewTask"/> 
                        </div>
                        <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                        <div v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"
                            @viewTask="viewTask"/> 
                        </div>
                    </div>
                </section>
                <br/>
                
            </div>
        </div>
    `,
    
    methods: {
        closeMenu: function(){
            this.$data.showMenu = false
        },

        closeCreateTaskModal: function(){
            this.$data.showCreateTaskModal = false
        },

        closeCreateCategoryModal: function(){
            this.$data.showCreateCategoryModal = false
        },

        closeEditTaskModal: function(){
            this.$data.showEditTaskModal = false
        },

        closeEditCategoryModal: function(){
            this.$data.showEditCategoryModal = false
        },

        closeTaskViewModal: function(){
            this.$data.showTaskViewModal = false
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

        getAllTasksDone: function(){
            return this.$data.tasks.filter(task => task.finished)
        },

        getTasksDoneByCategory: function(categoryId){
            return this.getTasksByCategory(categoryId).filter(task => task.finished)
        },

        saveCategory: function(newCategory){
            let nextId = parseInt(this.$data.categories.reduce((biggerId, categoryActual) => {return Math.max(biggerId, categoryActual.id)}, -1)) + 1
            let category = new Category(nextId, newCategory.name, newCategory.description)
            
            this.$data.categories.push(category)
            this.saveCategories()
            this.closeCreateCategoryModal()
        },

        editCategory: function(id){
            this.$data.editCategoryId = id
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
            
            this.$data.selectedTabCategoryId = id
        },

        selectTabCategory: function(id){
            if(id != -1){
                this.$data.showAllTasks = false
            }else{
                this.$data.showAllTasks = true
            }
            this.$data.categories.forEach(category => {
                if(category.id == id){
                    category.isSelected = true
                }else{
                    category.isSelected = false
                }
            })
            this.$data.selectedCategoryId = id
        },

        viewTask: function(id){
            this.$data.taskSelectedId = id
            this.$data.showTaskViewModal = true
        },

        saveTask: function({newItem}){
            let nextId = parseInt(this.$data.tasks.reduce((biggerId, taskActual) => {return Math.max(biggerId, taskActual.id)}, -1)) + 1

            let newTask = new Task(nextId, newItem.title, newItem.categoryId, false, newItem.dueDate, newItem.description)
            
            this.$data.tasks.push(newTask)

            this.saveTasks()
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
            let task = this.$data.tasks.find(task => task.id === id)
            let taskIndex = this.$data.tasks.indexOf(task)
            this.$data.taskSelectedId = -1
            this.$data.tasks.splice(taskIndex, 1)

            this.saveTasks()
        },
    }
}

export {todoList}