const taskItem = {
    props: ['task'],

    computed:{
        Task(){
            return this.task;
        }
    },

    template:
    `
    <div :class="'task-item-card ' + overdueTask(Task.dueDate)">
        <div class="task-item-header">
            <h3>{{ Task.title }}</h3>
            <span>Due Date: {{ printDueDate(Task.dueDate) }}</span>
        </div>
        <div class="task-item-body">
            <div class="task-item-description">
                <p>{{ Task.description }}</p>
            </div>
            <div class="task-item-actions-wrapper">
                <button class="task-item-action" @click="editTask">Edit</button>
                <button class="task-item-action" @click="finishTask">Finish</button>
                <button class="task-item-action task-delete-btn" @click="deleteTask">Delete</button>
            </div>
        </div>
    </div>
    `,

    methods:{
        editTask: function(){
            this.$emit('editTask')
        },

        finishTask: function(){
            this.$emit('finishTask')
        },

        deleteTask: function(){
            this.$emit('deleteTask')
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
    }

}

export {taskItem}