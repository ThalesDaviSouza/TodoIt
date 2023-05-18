const todoList = {
    data(){
        return{
            newItem: {type:'',task:''},
            bora: 'bora',
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
            <div class="add-task">
                <input type="text" id="task-name" v-model="newItem.task">
                <select v-model="newItem.type">
                    <option v-for="category in tasks">
                        {{ category.type }}
                    </option>
                </select>
                <button class="add-task-button" @click="addTask">Add Task</button>
            </div>
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
        <button @click="test">Test</button>
    </div>`,
    
    methods: {
        addTask: function(){
            let newTask = {
                task: this.$data.newItem.task,
                type: this.$data.newItem.type
            }
            
            this.$data.newItem.type = ''
            this.$data.newItem.task = ''
            
            console.log(newTask)

            this.$data.tasks.find(category => category.type === newTask.type).list.todo.push({task:newTask.task, finished:false})
        }
    }
}

export {todoList}