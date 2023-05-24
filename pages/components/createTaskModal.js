const createTaskModal = {
    props: [
        'categories'
    ],

    data(){
        return {
            categories: this.categories,
        }
    },

    template: 
    `
    <div class="modal-overlay">
        <div class="modal-body">
            <h1>Create Task</h1>
            <form action="">
                <input type="text" id="task-modal-todo" placeholder="Input your task">
                <h3>Choose your Task:</h3>
                <select>
                    <option :value="category.id" v-for="category in categories">
                        {{ category.name }}
                    </option>
                </select>
                <h3>Due Date:</h3>
                <input type="date">
                <button @click="test('Message from modal')">Save Task</button>
            </form>
        </div>
    </div>
    `,
    methods: {
    }
}

export {createTaskModal}