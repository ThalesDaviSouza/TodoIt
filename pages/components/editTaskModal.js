import {chooseCategoryModal} from './chooseCategoryModal.js'
import {confirmModal} from './confirmModal.js'

const editTaskModal = {
    props: ['categories', 'tasks', 'taskSelectedId'],

    data(){
        return {
            categories: this.categories,
            showChooseCategoryModal: false,
            showConfirmDeleteModal: false,

            confirmData:{title:'', message:''},
        }
    },

    computed: {
        task: {
            get(){
                return this.tasks.find(task => task.id == this.taskSelectedId)
            }
        },

        taskEndOrNot(){
            return this.task.finished ? 'Unfinish task' : 'End Task'
        },
    },

    components: {
        chooseCategoryModal: chooseCategoryModal,
        confirmModal: confirmModal,
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        
        <chooseCategoryModal v-show="showChooseCategoryModal" @closeModal="closeChooseCategoryModal"
            @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="categories" />

        <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
            :confirm="confirmData" :acceptFunction="deleteTask" />

        <div id="edit-task-modal" class="modal-body">
            <div>
                <input v-model="task.todo" @blur="saveChanges" type="text" placeholder="Insert Task tittle">
                <button @click="endTask">{{ taskEndOrNot }}</button>
            </div>
            <div>
                <h4>Category:</h4>
                <button @click="chooseCategory">{{ btnChooseCategoryText() }}</button>
            </div>
            <button @click="confirmDelete">Delete Task</button>
            <button @click="closeModal">Save Task</button>
        </div>
    </div>
    `,
    
    methods: {
        saveChanges: function(){
            this.$emit('saveChanges')
        },

        closeModal: function(){
            this.saveChanges()
            this.$emit('closeModal')
        },

        closeChooseCategoryModal: function(){
            this.$data.showChooseCategoryModal = false
        },

        closeConfirmDeleteModal: function(){
            this.$data.showConfirmDeleteModal = false
        },

        confirmDelete: function(){
            this.$data.confirmData.title = 'Are you sure?'
            this.$data.confirmData.message = 'Are you sure you want to delete this task?'
            this.$data.showConfirmDeleteModal = true
        },

        deleteTask: function(){
            this.closeModal()
            this.$emit('deleteTask', this.task.id)
        },

        selectCategory: function(categoryId){
            this.task.categoryId = categoryId
        },

        saveCategory: function(newCategory){
            this.$emit('saveCategory', newCategory)
        },

        btnChooseCategoryText: function(){
            let taskSelected = this.task
            let categoryToShow = this.categories.find(category => category.id == taskSelected.categoryId) 
            
            return categoryToShow.name
        },
        
        chooseCategory: function(){
            this.$data.showChooseCategoryModal = true
        },

        endTask: function(){
            if(this.task.finished){
                this.task.finished = false
            }else{
                this.task.finished = true
            }
            this.saveChanges()
        }
    }
}

export {editTaskModal}