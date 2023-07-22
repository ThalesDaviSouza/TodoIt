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
        task(){
            return this.tasks.find(task => task.id == this.taskSelectedId)
        },

        taskCategory(){
            if(this.task){
                return this.Categories.find(category => category.id == this.task.categoryId)
            }else{
                return false
            }
        },

        getDueDate(){
            if(this.task.dueDate){
                let date = new Date(this.task.dueDate) 
                return `${date.getFullYear()}-` +
                    `${date.getMonth() >= 10 ? date.getMonth()+1 : '0' + (date.getMonth()+1).toString()}-`+ 
                    `${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate().toString()}T` +
                    `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours().toString()}:` +
                    `${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes().toString()}:00`
            }else{
                return 
            }
        },

        Categories(){
            return this.categories
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
            @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="Categories" :selectedCategory="taskCategory" />

        <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
            :confirm="confirmData" :acceptFunction="deleteTask" />

        <warningModal :warning="warning" v-show="showWarningModal" @closeModal="closeWarningModal" />

        <div id="edit-task-modal" class="modal-body">
            <div class="close-modal">
                <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div class="edit-task-header">
                <input v-model="task.title" @click="saveActualName" type="text" placeholder="Insert Task tittle">
            </div>
            <div class="edit-task-body">
                <div class="edit-task-finished">
                    <h4>Task Finished?</h4>
                    <svg v-if="!task.finished" @click="endTask" xmlns="http://www.w3.org/2000/svg" width="28" height="28" class="bi bi-square edit-task-finish" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    </svg>
                    <svg v-if="task.finished" @click="endTask" xmlns="http://www.w3.org/2000/svg" width="28" height="28" class="bi bi-check-square edit-task-finish" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                    </svg>
                </div>
                <h4>Task Description:</h4>
                <textarea class="task-description-input" name="task-edit-description" v-model="task.description" placeholder="Insert here the task's description">
                </textarea>
                <h4>Category:</h4>
                <button class="open-select-modal-btn" @click="chooseCategory">{{ btnChooseCategoryText() }}</button>
                <h4>Due Date:</h4>
                <input id="task-edit-duedate" type="datetime-local" :value="getDueDate" @input="saveNewDueDate" />
            </div>
            <div class="edit-task-footer">
                <button class="btn-action" @click="confirmDelete">Delete Task</button>
                <button class="btn-action" @click="closeModal">Save Task</button>
            </div>
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

        saveNewDueDate: function(){
            this.task.dueDate = document.querySelector('#task-edit-duedate').value
        },

        saveActualName: function(){
            this.$data.taskTodoBeforeChanges = this.task.title
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
            if(categoryToShow){
                return categoryToShow.name
            }else{
                return 'Choose a Category'
            }
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
            this.task.title = this.$data.taskTodoBeforeChanges
        },

        verifyTask: function(){
            if(this.task.title.replace(/\s/g, '').length == 0){
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