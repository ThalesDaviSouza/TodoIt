import {createCategoryModal} from './createCategoryModal.js'

const chooseCategoryModal = {
    props: ['categories'],

    data(){
        return {
            showCreateCategoryModal: false,
        }
    },

    computed: {
        Categories(){
            return this.categories
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
            <button @click="chooseCategory(category.id)" v-for="category in Categories">{{ category.name }}</button>
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