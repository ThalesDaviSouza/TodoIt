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

            deletedTask: false,

            confirmData: {title:'', message:''},
        }
    },

    components: {
        confirmModal: confirmModal,
    },

    template:
    `
    <div>
        <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
            :confirm="confirmData" :acceptFunction="deleteTask" />
        
        <div :class="{ 'task-item-card':true, 'overdueTask': isOverdueTask(Task.dueDate), 'deleted-task': deletedTask }" @click="viewTask(Task.id)">
            <div class="task-item-header">
                <h3>{{ Task.title }}</h3>
                <span>Due Date: {{ printDueDate(Task.dueDate) }}</span>
            </div>
            <div class="task-item-body">
                <div class="task-item-description" >
                    <p>{{ getDescriptionToShow() }}</p>
                </div>
                <div class="task-item-actions-wrapper">
                    <button class="task-item-action task-edit-btn" @click.stop="editTask(Task.id)">Edit</button>
                    <button class="task-item-action task-finish-btn" @click.stop="finishTask(Task.id)">{{ FinishMessage }}</button>
                    <button class="task-item-action task-delete-btn" @click.stop="confirmDelete">Delete</button>
                </div>
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
            this.$data.deletedTask = true

            // To apply the deleted-task class to component
            this.$nextTick(() => {
                this.$emit('deleteTask', this.Task.id)
            })
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
            return new Date() > date && !this.Task.finished ? true : false
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