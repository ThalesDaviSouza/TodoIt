import {createCategoryModal} from './createCategoryModal.js'

const tabCategoryModal = {
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
        SelectedCategory(){
            return this.selectedCategory
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
        <div id="choose-category-tab-modal" class="modal-body">
            <createCategoryModal v-show="showCreateCategoryModal" @closeModal="closeCreateCategoryModal"
                @saveCategory="saveCategory" :categories="Categories" />

            <button @click="addCategory">Add Category</button>
            <h1>Select Category</h1>
            <div class="category-select" @click="chooseCategory(-1)">
                <label for="category-tab-all-task">All Tasks</label>
                <input type="radio" id="category-tab--1" name="category-tab-selected" v-if="SelectedCategoryId != -1">
                <input type="radio" id="category-tab--1" name="category-tab-selected" v-if="SelectedCategoryId == -1" checked>
            </div>
            <div class="category-select" @click.once="chooseCategory(category.id)" v-for="category in categories">
                <label :for="'category-tab-'+category.id">{{ category.name }}</label> 
                <input type="radio" :id="'category-tab-'+category.id" name="category-tab-selected" v-if="SelectedCategoryId != category.id" />
                <input type="radio" :id="'category-tab-'+category.id" name="category-tab-selected" v-if="SelectedCategoryId == category.id" checked/>
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
            let inputToCheck = document.getElementById('category-tab-'+categoryId)
            if(inputToCheck){
                inputToCheck.checked = true
            }
            this.$emit('selectCategory', categoryId)
            this.closeModal()
        },

        addCategory: function(){
            this.showCreateCategoryModal = true
        },
    }
}

export {tabCategoryModal}