// Classes
import {Task, Category} from '../assets/js/classes.js'

// Modals
import {createTaskModal} from '../common/components/createTaskModal.js'
import {createCategoryModal} from '../common/components/createCategoryModal.js'
import {editTaskModal} from '../common/components/editTaskModal.js'
import {editCategoryModal} from '../common/components/editCategory.js'
import {tabCategoryModal} from '../common/components/tabCategoryModal.js'


const todoList = {
    data(){
        return{
            showCreateTaskModal: false,
            showCreateCategoryModal: false,
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
        }
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

            <tabCategoryModal v-show="showTabCategoryModal" @closeModal="closeTabCategoryModal"
                @selectCategory="selectTabCategory" @saveCategory="saveCategory" :categories="categories" :selectedCategory="selectedCategory" />

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
                
                <ul class="category-tabs">
                    <button @click="selectCategoryToShow()">Show Tasks by Category</button>
                </ul>

                <div id="todo-wrapper">
                    <div v-if="showAllTasks">
                        <h2>All Tasks</h2>
                        <div v-for="task in tasks">
                            <div :class="'task-item ' + overdueTask(task.dueDate)" v-if="!task.finished">
                                <input type="text" :value="task.title + printDueDate(task.dueDate)"
                                    :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Finish Task</button>
                            </div>
                        </div>
                        <h3>Finished tasks</h3>
                        <div v-for="task in tasks">
                            <div class="task-item" v-if="task.finished">
                                <input type="text" :value="task.title + printDueDate(task.dueDate)"
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
                        <div :class="'task-item ' + overdueTask(task.dueDate)" :id="'container-'+task.id" v-for="task in getTasksByCategory(category.id).filter(task => !task.finished)">
                            <input type="text" :value="task.title + printDueDate(task.dueDate)"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Finish Task</button>
                        </div>
                        <br/>
                        <h3 v-if="getTasksByCategory(category.id).filter(task => task.finished).length > 0">Finished tasks</h3>
                        <div class="task-item" v-for="task in getTasksByCategory(category.id).filter(task => task.finished)">
                            <input type="text" :value="task.title + printDueDate(task.dueDate)"
                                :id="'task-'+task.id" @click="editTask(task.id)" readonly>
                                <button @click="finishTask(task.id)">Unfinish Task</button>
                        </div>
                    </div>
                </div>
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

        getDueDate: function(dueDate){
            return new Date(dueDate)
        },

        printDueDate: function(dueDate){
            if(dueDate){
                let date = this.getDueDate(dueDate)
                return ` - ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
            }else{
                return ''
            }
        },

        isOverdueTask: function(dueDate){
            let date = this.getDueDate(dueDate)
            return new Date() > date ? true : false
        },

        overdueTask: function(dueDate){
            // If the due date is empty
            if(!dueDate){
                return ''
            }

            if(this.isOverdueTask(dueDate)){
                return 'overdueTask'
            }else{
                return ''
            }
            
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
            //TODO: Make a modal to confirm it
            let task = this.$data.tasks.find(task => task.id === id)
            let taskIndex = this.$data.tasks.indexOf(task)
            this.$data.tasks.splice(taskIndex, 1)

            this.saveTasks()
        },
    }
}

export {todoList}