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

            <button class="btn-action" @click="addCategory">Add Category</button>
            <div @click="chooseCategory(category.id)" class="category-select-card" v-for="category in categories">
                <div class="category-select-header">
                    <input type="radio" :id="'category-'+category.id" name="category-selected" v-if="SelectedCategoryId != category.id" />
                    <input type="radio" :id="'category-'+category.id" name="category-selected" v-if="SelectedCategoryId == category.id" checked/>
                    <h3>{{ category.name }}</h3>
                </div>
                <div class="category-select-body">
                    <p>{{ getCategoryShortDescription(category) }}</p>
                </div>
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

        getCategoryShortDescription: function(category){
            if(category.description){
                return category.description.slice(0,150)
            }else{
                return ''
            }

        },

        addCategory: function(){
            this.showCreateCategoryModal = true
        },
    }
}

export {chooseCategoryModal}