import {chooseCategoryModal} from './chooseCategoryModal.js'

const createTaskModal = {
    props: [
        'categories',
    ],

    data(){
        return {
            newItem:{
                todo: '',
                categoryId: -1,
                date: new Date(),
            },
            categories: this.categories,
            showChooseCategoryModal: false,
        }
    },

    components: {
        chooseCategoryModal: chooseCategoryModal
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="create-task-modal" class="modal-body">

            <chooseCategoryModal v-show="showChooseCategoryModal" @closeModal="closeChooseCategoryModal"
                @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="categories" />

            <h1>Create Task</h1>
            <form @submit.prevent="addTask(newItem)">
                <input type="text" v-model="newItem.todo" id="task-modal-todo" placeholder="Input your task">
                <h3>Choose category:</h3>
                <button @click.prevent="showChooseCategoryModal = true">{{ btnChooseCategoryText() }}</button>
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

        closeChooseCategoryModal: function(){
            this.$data.showChooseCategoryModal = false
        },

        saveCategory: function(newCategory){
            this.$emit('saveCategory', newCategory)
        },

        btnChooseCategoryText: function(){
            let categoryToShow = this.categories.find(category => category.id == this.$data.newItem.categoryId) 
            
            if(categoryToShow){
                return categoryToShow.name
            }else{
                return 'Choose Category'
            }
        },

        chooseCategory: function(){
            this.$emit('chooseCategory')
        },

        selectCategory: function(categoryId){
            this.$data.newItem.categoryId = categoryId
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