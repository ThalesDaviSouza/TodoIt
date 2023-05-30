import {chooseCategoryModal} from './chooseCategoryModal.js'
import {confirmModal} from './confirmModal.js'
import {warningModal} from './warningModal.js'

const editTaskModal = {
    props: ['categories', 'tasks', 'taskSelectedId'],

    data(){
        return {
            showChooseCategoryModal: false,
            showConfirmDeleteModal: false,
            showWarningModal: false,

            confirmData:{title:'', message:''},
            warning:{title:'', message:''},

            taskTodoBeforeChanges:'',
        }
    },

    computed: {
        task: {
            get(){
                return this.tasks.find(task => task.id == this.taskSelectedId)
            }
        },

        Categories(){
            return this.categories
        },

        endTaskText(){
            return this.task.finished ? 'Unfinish task' : 'Finish Task'
        },
    },

    components: {
        chooseCategoryModal: chooseCategoryModal,
        confirmModal: confirmModal,
        warningModal: warningModal,
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        
        <chooseCategoryModal v-show="showChooseCategoryModal" @closeModal="closeChooseCategoryModal"
            @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="Categories" />

        <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
            :confirm="confirmData" :acceptFunction="deleteTask" />

        <warningModal :warning="warning" v-show="showWarningModal" @closeModal="closeWarningModal" />

        <div id="edit-task-modal" class="modal-body">
            <div>
                <input v-model="task.todo" @click="saveActualName" type="text" placeholder="Insert Task tittle">
                <button @click="endTask">{{ endTaskText }}</button>
            </div>
            <div>
                <h4>Category:</h4>
                <button @click="chooseCategory">{{ btnChooseCategoryText() }}</button>
            </div>
            <button @click="confirmDelete">Delete Task</button>
            <button @click="closeModal">Save Task</button>
        </div>
    </div>
    `,
    
    methods: {
        closeModal: function(){
            if(this.verifyTask()){
                this.saveChanges()
                this.$emit('closeModal')
            }
        },

        closeChooseCategoryModal: function(){
            this.$data.showChooseCategoryModal = false
        },

        closeConfirmDeleteModal: function(){
            this.$data.showConfirmDeleteModal = false
        },

        closeWarningModal: function(){
            this.$data.showWarningModal = false
        },

        showWarning: function(title, message){
            this.$data.warning.title = title
            this.$data.warning.message = message
            this.$data.showWarningModal = true
        },

        saveActualName: function(){
            this.$data.taskTodoBeforeChanges = this.task.todo
        },

        confirmDelete: function(){
            this.$data.confirmData.title = 'Are you sure?'
            this.$data.confirmData.message = 'Are you sure you want to delete this task?'
            this.$data.showConfirmDeleteModal = true
        },

        deleteTask: function(){
            this.closeModal()
            this.$emit('deleteTask', this.task.id)
        },

        selectCategory: function(categoryId){
            this.task.categoryId = categoryId
        },

        saveCategory: function(newCategory){
            this.$emit('saveCategory', newCategory)
        },

        btnChooseCategoryText: function(){
            let categoryToShow = this.Categories.find(category => category.id == this.task.categoryId) 
            
            return categoryToShow.name
        },
        
        chooseCategory: function(){
            this.$data.showChooseCategoryModal = true
        },

        endTask: function(){
            if(this.task.finished){
                this.task.finished = false
            }else{
                this.task.finished = true
            }
            this.saveChanges()
        },

        resetTaskName: function(){
            this.task.todo = this.$data.taskTodoBeforeChanges
        },

        verifyTask: function(){
            if(this.task.todo.replace(/\s/g, '').length == 0){
                this.showWarning('Task Title Empty', 'Please, input something in tasks title')
                this.resetTaskName()
            }else{
                return true
            }
            return false
        },

        saveChanges: function(){
            if(this.verifyTask()){
                this.$emit('saveChanges')
            }else{
                this.resetTaskName()
            }
        },
    }
}

export {editTaskModal}