const createTaskModal = {
    props: [
        'categories'
    ],

    data(){
        return {
            newItem:{
                todo: '',
                categoryId: -1,
                date: new Date(),
            },
            categories: this.categories,
        }
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="create-task-modal" class="modal-body">
            <h1>Create Task</h1>
            <form @submit.prevent="addTask(newItem)">
                <input type="text" v-model="newItem.todo" id="task-modal-todo" placeholder="Input your task">
                <h3>Choose category:</h3>
                <button @click.prevent="chooseCategory">Choose Category</button>
                <select v-model="newItem.categoryId">
                    <option :value="category.id" v-for="category in categories">
                        {{ category.name }}
                    </option>
                </select>
                <h3>Due Date:</h3>
                <input type="date">
                <button>Save Task</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        closeModal: function(){
            this.$emit('closeModal')
        },

        chooseCategory: function(){
            this.$emit('chooseCategory')
        },

        addTask: function(newItem){
            //TODO: Add due date to tasks
            if(newItem){
                if(newItem.todo.replace(/\s/g, '').length == 0){
                    alert('Please, add a title to your task')
                }else if(newItem.categoryId == -1){
                    alert('Select a category to your task')
                }else{
                    this.$emit('saveTask', {newItem})
                    this.closeModal()
                    this.$data.newItem = {}
                }
            }
        }
    }
}

export {createTaskModal}