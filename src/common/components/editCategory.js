import {warningModal} from './warningModal.js'
import {confirmModal} from './confirmModal.js'


const editCategoryModal = {
    props: ['categorySelected', 'categoriesList'],

    computed: {
        categories(){
            return this.categoriesList
        },
        category(){
            return this.categoriesList.find(category => category.id == this.categorySelected)
        },
    },

    data(){
        return{
            showWarningCategory: false,
            showConfirmDeleteModal: false,

            categoryNameBeforeChanges: '',
            warning: {title:'', message:''},
            confirmDeleteData: {title:'',message:''},
        }
    },

    components:{
        warningModal: warningModal,
        confirmModal: confirmModal,
    },

    template:
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="edit-category-modal" class="modal-body">
            <warningModal :warning="warning" v-show="showWarningCategory" @closeModal="closeWarningModal" />
            
            <confirmModal v-show="showConfirmDeleteModal" @closeModal="closeConfirmDeleteModal" 
                :confirm="confirmDeleteData" :acceptFunction="deleteCategory" />

            <div v-if="category">
                <h2>Category Title:</h2>
                <input type="text" placeholder="Insert here the category's title" @click="saveActualName" @blur="saveChanges" v-model="category.name" />
                
                <h3>Category Description:</h3>
                <textarea class="category-description-input" v-model="category.description" placeholder="Insert here the category's description" @blur="saveChanges"></textarea>
                
                <button @click="confirmDelete">Delete Category</button>
                <button @click="closeModal">Save Category</button>
            </div>
        </div>
    </div>
    `,

    methods:{
        closeModal: function(){
            this.$emit('closeModal')
        },

        closeWarningModal: function(){
            this.$data.showWarningCategory = false
        },

        closeConfirmDeleteModal: function(){
            this.$data.showConfirmDeleteModal = false
        },

        saveActualName: function(){
            this.$data.categoryNameBeforeChanges = this.category.name
        },

        resetCategoryName: function(){
            this.category.name = this.$data.categoryNameBeforeChanges
        },

        showWarning: function(title, message){
            this.$data.warning.title = title
            this.$data.warning.message = message
            this.$data.showWarningCategory = true
        },

        verifyCategory: function(){
            if(this.category.name.replace(/\s/g, '').length === 0){
                this.showWarning("Category's Name Empty", 'Insert a name to your category')
            }else if(this.categories.filter(cat => cat.name.toLocaleLowerCase() == this.category.name.toLocaleLowerCase()).length > 1){
                this.showWarning('Duplicate Categories', 'This category already Exist')
            }else{
                return true
            }
            this.resetCategoryName()
            return false
        },

        saveChanges: function(){
            if(this.verifyCategory()){
                this.$emit('saveCategories')
            }
        },

        confirmDelete: function(){
            this.$data.confirmDeleteData.title = 'Are you sure?'
            this.$data.confirmDeleteData.message = 'Are you sure you want to delete this category?'
            this.$data.showConfirmDeleteModal = true
        },

        deleteCategory: function(){
            this.$data.showConfirmDeleteModal = false
            this.closeModal()
            this.$emit('deleteCategory', this.category.id)
        }
    }

}

export {editCategoryModal}