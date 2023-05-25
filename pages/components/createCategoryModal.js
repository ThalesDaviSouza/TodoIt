const createCategoryModal = {
    props: ['categories'],

    data(){
        return {
            newCategory:{
                name: '',
            },
            categories: this.categories,
        }
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="create-category-modal" class="modal-body">
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

        addCategory: function(newCategory){
            if(newCategory.name.replace(/\s/g, '').length === 0){
                alert('Insert a name to your category')
            }else{
                this.$emit('saveCategory', newCategory)
            }
        },
    }
}

export {createCategoryModal}