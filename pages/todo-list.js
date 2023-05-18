const todoList = {
    data(){
        return{
            tasks: [{
                    type:'Personal',
                    list: {
                        todo: [{
                            task:'Make a book',
                            finished: false
                        }]
                    }
                },
                {
                    type:'Carrer',
                    list: {
                        todo: [{
                            task:'Write a program',
                            finished: false
                        },
                        {
                            task:'Write 20 lines',
                            finished: true
                        }
                    ]}
                },
            ],
        }
    },
    
    template:
        `<div class="todo-list-container">
            <h1>Todo List</h1>
            <div class="todo-list">
                <input type="text" id="add-task">
                <div v-for="category in tasks">
                    <h1>{{ category.type }}</h1>
                    <div v-for="todo in category.list.todo">
                        <p v-if="!todo.finished">{{ todo.task }}</p>
                    </div>
                    <h3 v-if="category.list.todo.filter(p => p.finished !== false).length > 0">Finished tasks</h3>
                    <div v-for="todo in category.list.todo">
                        <p v-if="todo.finished">{{ todo.task }}</p>
                    </div>
                </div>
            </div>
        </div>`,
    
    mounted(){
        this.$root.tasks = this.tasks;
    },
}

export {todoList}