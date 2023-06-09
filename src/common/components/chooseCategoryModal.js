import {createCategoryModal} from './createCategoryModal.js'

const chooseCategoryModal = {
    props: ['categories', 'selectedCategory'],

    data(){
        return {
            showCreateCategoryModal: false,
        }
    },

    computed: {
        Categories(){
            return this.categories
        },
        SelectedCategoryId(){
            return this.selectedCategory == null ? -1 : this.selectedCategory.id
        }
    },

    components:{
        createCategoryModal: createCategoryModal
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="choose-category-modal" class="modal-body">
            <createCategoryModal v-show="showCreateCategoryModal" @closeModal="closeCreateCategoryModal"
                @saveCategory="saveCategory" :categories="Categories" />

            <button @click="addCategory">Add Category</button>
            <h1>Choose Category</h1>
            <div class="category-select" v-for="category in categories">
                <label for="'category-'+category.id">{{ category.name }}</label> 
                <input type="radio" id="'category-'+category.id" name="category-selected" @click="chooseCategory(category.id)" v-if="SelectedCategoryId != category.id" />
                <input type="radio" id="'category-'+category.id" name="category-selected" @click="chooseCategory(category.id)" v-if="SelectedCategoryId == category.id" checked/>
            </div>
        </div>
    </div>
    `,

    methods: {
        closeModal: function(){
            this.$emit('closeModal')
        },
        
        closeCreateCategoryModal: function(){
            this.$data.showCreateCategoryModal = false
        },

        saveCategory: function(newCategory){
            this.$emit('saveCategory', newCategory)
            this.closeCreateCategoryModal()
        },

        chooseCategory: function(categoryId){
            this.$emit('selectCategory', categoryId)
            this.closeModal()
        },

        addCategory: function(){
            this.showCreateCategoryModal = true
        },
    }
}

export {chooseCategoryModal}