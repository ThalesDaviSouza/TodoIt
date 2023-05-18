const todoList = {
    data(){
        return{
            newItem: {type:'',task:''},
            newCategory: '',
            nextId: 3,
            tasks: [{
                    type:'Personal',
                    todo: 
                    [{
                        id:0,
                        task:'Make a book',
                        finished: false
                    }]
                },
                {
                    type:'Carrer',
                    todo: 
                    [{
                        id:1,
                        task:'Write a program',
                        finished: false
                    },
                    {
                        id:2,
                        task:'Write 20 lines',
                        finished: true
                    }]
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
    
            <input type="text" v-model="newCategory">
            <button @click="addCategory">Add Category</button>
            
            <div v-for="category in tasks">
                <h1>{{ category.type }}</h1>
                <div v-for="todo in category.todo" >
                    <input type="text" v-if="!todo.finished"
                        v-model="todo.task" :id="'task-'+todo.id"
                        readonly>
                    <button @click="editTask(todo.id)" v-if="!todo.finished">Edit</button>
                </div>
                <h3 v-if="category.todo.filter(p => p.finished !== false).length > 0">Finished tasks</h3>
                <div v-for="todo in category.todo">
                    <p :id="'task-'+todo.id" v-if="todo.finished">{{ todo.task }}</p>
                </div>
            </div>
        </div>
    </div>`,
    
    methods: {
        addCategory: function(){
            let category = this.$data.newCategory
            this.$data.newCategory = ''

            if(this.$data.tasks.find(item => item.type.toLocaleUpperCase() === category.toLocaleUpperCase())){
                alert('This category already exist')
            }else{
                this.$data.tasks.push({type:category, todo:[]})
            }
        },

        addTask: function(){
            let newTask = {
                task: this.$data.newItem.task,
                type: this.$data.newItem.type,
                id: this.$data.nextId,
            }
            
            this.$data.newItem.type = ''
            this.$data.newItem.task = ''
            this.$data.nextId++

            this.$data.tasks.find(category => category.type === newTask.type)
                .todo.push({id:newTask.id, task:newTask.task, finished:false})
        },

        editTask: function(id){
            console.log(id)
            app.querySelector(`#task-${id}`).removeAttribute('readonly')

        },
    }
}

export {todoList}