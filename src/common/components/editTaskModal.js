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
                <svg v-if="!task.finished" @click="endTask" xmlns="http://www.w3.org/2000/svg" width="56" height="56" class="bi bi-check2-circle edit-task-finish" viewBox="0 0 16 16">
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
                </svg>
                <svg v-if="task.finished" @click="endTask" xmlns="http://www.w3.org/2000/svg" width="56" height="56" class="bi bi-x-octagon-fill edit-task-finish" viewBox="0 0 16 16">
                    <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                </svg>
            </div>
            <div class="edit-task-body">
                <h4>Task Description:</h4>
                <textarea class="edit-task-description" name="task-edit-description" v-model="task.description" placeholder="Insert here the task's description">
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