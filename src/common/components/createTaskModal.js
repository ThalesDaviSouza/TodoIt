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

            selectedCategory: null,

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
                @selectCategory="selectCategory" @saveCategory="saveCategory" :categories="Categories" :selectedCategory="selectedCategory" />

            <div class="close-modal">
                <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div class="create-task-body">
                <h4>Insert Task Title</h4>
                <input type="text" v-model="newItem.title" class="create-task-title" placeholder="Task title...">
                <h4>Insert a short description</h4>
                <textarea class="task-description-input" name="task-add-description" v-model="newItem.description" placeholder="Insert here the task's description"></textarea>
                <h4>Choose category:</h4>
                <button class="open-select-modal-btn" @click.prevent="showChooseCategoryModal = true">{{ btnChooseCategoryText() }}</button>
                <h4>Due Date:</h4>
                <input type="datetime-local" v-model="newItem.dueDate">
            </div>
            <button class="btn-action" @click="addTask(newItem)">Save Task</button>
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
            this.$data.selectedCategory = this.categories.find(cat => cat.id == categoryId)
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
                    this.$data.selectedCategory = -1
                }
            }
        }
    }
}

export {createTaskModal}