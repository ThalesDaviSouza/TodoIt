const taskItem = {
    props: ['task'],

    computed:{
        Task(){
            return this.task;
        }
    },

    template:
    `
    <div class="task-item">
        <div class="task-item-header">
            <h3>{{ Task.title }}</h3>
            <span>due date: </span>
        </div>
        <div>
            <p>{{ Task.description }}</p>
        </div>
        <div class="task-item-actions-wrapper">
            <button class="task-item-action" @click="editTask">Edit</button>
            <button class="task-item-action" @click="finishTask">Finish</button>
            <button class="task-item-action" @click="deleteTask">Delete</button>
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
        }
    }

}

export {taskItem}