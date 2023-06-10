// Classes
import {Task, Category} from '../assets/js/classes.js'

// Modals
import {createTaskModal} from '../common/components/createTaskModal.js'
import {createCategoryModal} from '../common/components/createCategoryModal.js'
import {editTaskModal} from '../common/components/editTaskModal.js'
import {editCategoryModal} from '../common/components/editCategory.js'
import {tabCategoryModal} from '../common/components/tabCategoryModal.js'

// Other Components
import { taskItem } from '../common/components/taskItem.js';


const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showEditTaskModal: false,
            showEditCategoryModal: false,
            showTabCategoryModal: false,

            warning: {
                title:'',
                message:'',
            },

            taskSelectedId: -1,
            selectedCategoryId: -1,
            
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
        createCategoryModal: createCategoryModal,
        editTaskModal: editTaskModal,
        editCategoryModal: editCategoryModal,
        tabCategoryModal: tabCategoryModal,
        taskItem: taskItem,
    },

    template:
        `
        <div class="todo-list-container">
            <createTaskModal v-show="showCreateTaskModal" @closeModal="closeCreateTaskModal"
                @saveTask="saveTask" :categories="categories" @saveCategory="saveCategory" />

            <editCategoryModal v-show="showEditCategoryModal" @closeModal="closeEditCategoryModal"
                :categorySelected="selectedCategoryId" :categoriesList="categories"
                @saveCategories="saveCategories" @deleteCategory="deleteCategory" />

            <tabCategoryModal v-show="showTabCategoryModal" @closeModal="closeTabCategoryModal"
                @selectCategory="selectTabCategory" @saveCategory="saveCategory" :categories="categories" :selectedCategory="selectedCategory" />

            <h2>Todo List</h2>
            <div class="todo-list">
                
                <button class="open-modal-btn" @click="showCreateTaskModal=true">Add Task</button>

                <editTaskModal v-if="showEditTaskModal"
                    :categories="categories" :tasks="tasks" :taskSelectedId="taskSelectedId"
                    @closeModal="closeEditTaskModal" @saveCategory="saveCategory"
                    @deleteTask="removeTask" @saveChanges="saveTasks" />
                
                <button class="open-modal-btn" @click="selectCategoryToShow()">Show Tasks by Category</button>

                <section id="todo-wrapper">
                    <div v-if="showAllTasks">
                        <h2>All Tasks</h2>
                        <span>Complete: {{ getAllTasksDone().length }}/{{ tasks.length }}</span>
                        <div v-for="task in tasks">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask" v-if="!task.finished"/> 
                        </div>
                        <h3>Finished tasks</h3>
                        <div v-for="task in tasks">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask" v-if="task.finished"/> 
                        </div>
                    </div>
                    <div v-show="category.isSelected" :id="'category-wrapper-'+category.id" v-for="category in categories">
                        <h2 @click="editCategory(category.id)" class="category-title">{{ category.name }}</h2>
                        <span>Complete: {{ getTasksDoneByCategory(category.id).length }}/{{ getTasksByCategory(category.id).length }}</span>
                        <div :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"/> 
                        </div>
                        <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                        <div v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                            <taskItem :task="task" @editTask="editTask" @finishTask="finishTask" @deleteTask="removeTask"/> 
                        </div>
                    </div>
                </section>
                <br/>
                
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

        closeTabCategoryModal: function(){
            this.$data.showTabCategoryModal = false
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
            let category = new Category(nextId, newCategory.name)
            
            this.$data.categories.push(category)
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
            
            this.$data.selectedTabCategoryId = id
        },

        selectCategoryToShow: function(){
            this.$data.showTabCategoryModal = true
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
        },

        saveTask: function({newItem}){
            let nextId = parseInt(this.$data.tasks.reduce((biggerId, taskActual) => {return Math.max(biggerId, taskActual.id)}, -1)) + 1

            let newTask = new Task(nextId, newItem.title, newItem.categoryId, false, newItem.dueDate, newItem.description)
            
            this.$data.tasks.push(newTask)

            this.saveTasks()
            // this.closeCreateTaskModal()
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
            this.$data.tasks.splice(taskIndex, 1)

            this.saveTasks()
        },
    }
}

export {todoList}