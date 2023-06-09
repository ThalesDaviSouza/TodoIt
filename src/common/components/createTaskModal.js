import { Task } from '../../assets/js/classes.js'
import {chooseCategoryModal} from './chooseCategoryModal.js'
import {warningModal} from './warningModal.js'

const createTaskModal = {
    props: ['categories'],

    data(){
        return {
            newItem: new Task(),
            showChooseCategoryModal: false,
            showWarningModal: false,

            warning: {title:'', message:''},
        }
    },

    computed: {
        Categories() {
            return this.categories
        }

    },

    components: {
        chooseCategoryModal: chooseCategoryModal,
        warningModal: warningModal,
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="create-task-modal" class="modal-body">
            <warningModal :warning="warning" v-show="showWarningModal" @closeModal="closeWarningModal" />

            <chooseCategoryModal v-show="showChooseCategoryModal" @closeModal="closeChooseCategoryModal"
                @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="Categories" />

            <h1>Create Task</h1>
            <form @submit.prevent="addTask(newItem)">
                <input type="text" v-model="newItem.title" id="task-modal-title" placeholder="Input your task">
                <h3>Choose category:</h3>
                <button @click.prevent="showChooseCategoryModal = true">{{ btnChooseCategoryText() }}</button>
                <h3>Due Date:</h3>
                <input type="datetime-local" v-model="newItem.dueDate">
                <h3>Task's description:</h3>
                <textarea name="task-add-description" v-model="newItem.description"
                    cols="68" rows="4" placeholder="Insert here the task's description">
                </textarea>
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

        closeWarningModal: function(){
            this.$data.showWarningModal = false
        },

        showWarning: function(title, message){
            this.$data.warning.title = title
            this.$data.warning.message = message
            this.$data.showWarningModal = true
        },

        saveCategory: function(newCategory){
            this.$emit('saveCategory', newCategory)
        },

        btnChooseCategoryText: function(){
            let categoryToShow = this.Categories.find(category => category.id == this.$data.newItem.categoryId) 
            
            if(categoryToShow){
                return categoryToShow.name
            }else{
                return 'Choose Category'
            }
        },

        selectCategory: function(categoryId){
            this.$data.newItem.categoryId = categoryId
        },

        addTask: function(newItem){
            if(newItem){
                if(newItem.title.replace(/\s/g, '').length == 0){
                    this.showWarning('Task Empty', 'Please, add a title to your task')
                }else if(newItem.categoryId == -1){
                    this.showWarning('Category Empty', 'Select a category to your task')
                }else{
                    if(newItem.dueDate){
                        newItem.dueDate = new Date(newItem.dueDate).toISOString()
                    }

                    this.$emit('saveTask', {newItem})
                    this.closeModal()

                    //Reseting new item to next creation 
                    this.$data.newItem = new Task()
                }
            }
        }
    }
}

export {createTaskModal}