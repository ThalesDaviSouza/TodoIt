import { confirmModal } from "./confirmModal.js"

const taskViewModal = {
    props: ['tasks', 'taskSelectedId'],
    emits: ['editTask', 'deleteTask', 'finishTask', 'closeModal'],

    data(){
        return{
            showConfirmDeleteModal: false,

            confirmData: {title:'', message:''}
        }
    },

    computed: {
        Tasks(){
            return this.tasks
        },

        Task(){
            if(this.taskSelectedId != -1){
                return this.Tasks.find(task => task.id == this.taskSelectedId)
            }
            return {}
        },
    },

    components:{
        confirmModal: confirmModal,
    },

    template:
    `
    
    <div class="modal-overlay" @click.self="closeModal">
        <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
            :confirm="confirmData" :acceptFunction="deleteTask" />
        <div id="view-task-modal" class="modal-body">
            <div id="task-view-header">
                <div class="task-view-header-main-section">
                    <div class="task-view-title">
                        <h1>{{ Task.title }}</h1>
                        <span>{{ printDueDate(Task.dueDate) }}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </div>
                <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>

            <div id="task-view-body">
                <p>{{ Task.description }}</p>
            </div>

            <div id="task-item-footer">
                <button class="task-item-action btn-action" @click="confirmDelete()">Delete</button>
                <button class="task-item-action btn-action" @click="editTask(Task.id)">Edit</button>
            </div>
        </div>
    </div>
    `,

    methods:{
        closeModal: function(){
            this.$emit('closeModal')
        },

        closeConfirmDeleteModal: function(){
            this.$data.showConfirmDeleteModal = false
        },

        editTask: function(id){
            this.$emit('editTask', id)
        },

        confirmDelete: function(){
            this.$data.confirmData.title = 'Are you sure?'
            this.$data.confirmData.message = 'Are you sure you want to delete this task?'
            this.$data.showConfirmDeleteModal = true
        },

        deleteTask: function(){
            this.closeConfirmDeleteModal()
            this.closeModal()
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
    }

}

export {taskViewModal}