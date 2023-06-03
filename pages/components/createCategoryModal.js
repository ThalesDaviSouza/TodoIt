import { Category } from '../../js/classes.js'
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
            
            <h1>Create Category</h1>
            <form @submit.prevent="">
                <input type="text" v-model="newCategory.name" placeholder="Input category's name">
                <button @click="addCategory(newCategory)">Add Category</button>
            </form>
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