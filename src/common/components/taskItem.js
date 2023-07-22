import { confirmModal } from "./confirmModal.js";

const taskItem = {
    props: ['task'],

    emits: ["viewTask", "editTask", "finishTask", "deleteTask"],

    computed:{
        Task(){
            return this.task;
        },

        FinishMessage(){
            return (!this.Task.finished) ? 'Finish' : 'Unfinish' 
        }
    },

    data(){
        return{
            showConfirmDeleteModal: false,

            confirmData: {title:'', message:''},
        }
    },

    components: {
        confirmModal: confirmModal,
    },

    template:
    `
    <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
        :confirm="confirmData" :acceptFunction="deleteTask" />

    <div :class="'task-item-card ' + overdueTask(Task.dueDate)">
        <div class="task-item-header" @click="viewTask(Task.id)">
            <h3>{{ Task.title }}</h3>
            <span>Due Date: {{ printDueDate(Task.dueDate) }}</span>
        </div>
        <div class="task-item-body">
            <div class="task-item-description" @click="viewTask(Task.id)">
                <p>{{ getDescriptionToShow() }}</p>
            </div>
            <div class="task-item-actions-wrapper">
                <button class="task-item-action task-edit-btn" @click="editTask(Task.id)">Edit</button>
                <button class="task-item-action task-finish-btn" @click="finishTask(Task.id)">{{ FinishMessage }}</button>
                <button class="task-item-action task-delete-btn" @click="confirmDelete">Delete</button>
            </div>
        </div>
    </div>
    `,

    methods:{
        closeConfirmDeleteModal: function(){
            this.$data.showConfirmDeleteModal = false
        },

        viewTask: function(id){
            this.$emit('viewTask', id)
        },

        editTask: function(id){
            this.$emit('editTask', id)
        },

        finishTask: function(id){
            this.$emit('finishTask', id)
        },

        confirmDelete: function(){
            this.$data.confirmData.title = 'Are you sure?'
            this.$data.confirmData.message = 'Are you sure you want to delete this task?'
            this.$data.showConfirmDeleteModal = true
        },

        deleteTask: function(){
            this.closeConfirmDeleteModal()
            this.$emit('deleteTask', this.Task.id)
        },

        getDueDate: function(dueDate){
            return new Date(dueDate)
        },

        printDueDate: function(dueDate){
            if(dueDate){
                let date = this.getDueDate(dueDate)
                return ` ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
            }else{
                return ''
            }
        },

        isOverdueTask: function(dueDate){
            let date = this.getDueDate(dueDate)
            return new Date() > date ? true : false
        },

        overdueTask: function(dueDate){
            // If the due date is empty or task is finished
            if(!dueDate || this.Task.finished){
                return ''
            }

            if(this.isOverdueTask(dueDate)){
                return 'overdueTask'
            }else{
                return ''
            }
            
        },

        getDescriptionToShow: function(){
            if(this.Task.description){
                return this.Task.description.slice(0,150)
            }else{
                return ''
            }
        }
    }

}

export {taskItem}