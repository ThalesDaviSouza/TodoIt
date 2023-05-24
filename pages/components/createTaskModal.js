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
    <div class="modal-overlay">
        <div class="modal-body">
            <h1>Create Task</h1>
            <form action="">
                <input type="text" v-model="newItem.todo" id="task-modal-todo" placeholder="Input your task">
                <h3>Choose your Task:</h3>
                <select v-model="newItem.categoryId">
                    <option :value="category.id" v-for="category in categories">
                        {{ category.name }}
                    </option>
                </select>
                <h3>Due Date:</h3>
                <input type="date">
                <button @click="addTask(newItem)">Save Task</button>
            </form>
        </div>
    </div>
    `,
    methods: {
        test: function(obj){
            console.log(obj)
        },

        addTask: function(newItem){
            if(newItem){
                if(newItem.todo.replace(/\s/g, '').length == 0){
                    alert('Please, add a title to your task')
                }else if(newItem.categoryId == -1){
                    alert('Select a category to your task')
                }else{
                    this.$emit('saveTask', {newItem})
                }
            }
        }
    }
}

export {createTaskModal}