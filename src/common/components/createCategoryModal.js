import { Category } from '../../assets/js/classes.js'
import {warningModal} from './warningModal.js'


const createCategoryModal = {
    props: ['categories'],

    data(){
        return {
            showWarningCategory: false,

            newCategory: new Category(),

            warning:{title:'',message:''},
        }
    },

    computed: {
        Categories(){
            return this.categories
        }
    },

    components:{
        warningModal: warningModal,
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="create-category-modal" class="modal-body">
            <warningModal :warning="warning" v-show="showWarningCategory" @closeModal="showWarningCategory=false" />
            <div class="close-modal">
                <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div class="create-category-body">
                <h3>Create Category</h3>
                <h4>Name</h4>
                <input type="text" v-model="newCategory.name" placeholder="Input category's name">
                <h4>Description</h4>
                <textarea class="task-description-input" name="task-edit-description" v-model="newCategory.description" placeholder="Insert here the category's description">
                </textarea>
            </div>
            <div class="create-category-footer">
                <button class="btn-action" @click="addCategory(newCategory)">Add Category</button>
            </div>
        </div>
    </div>
    `,

    methods: {
        closeModal: function(){
            this.$emit('closeModal')
        },

        showWarning: function(title, message){
            this.$data.warning.title = title
            this.$data.warning.message = message
            this.$data.showWarningCategory = true
        },

        addCategory: function(newCategory){
            if(newCategory.name.replace(/\s/g, '').length === 0){
                this.showWarning("Category's Name Empty", 'Insert a name to your category')
            }else if(this.Categories.find(cat => cat.name.toLocaleLowerCase() == newCategory.name.toLocaleLowerCase())){
                this.showWarning('Duplicate Categories', 'This category already Exist')
            }else{
                this.$emit('saveCategory', newCategory)
                this.$data.newCategory = new Category()
            }
        },
    }
}

export {createCategoryModal}