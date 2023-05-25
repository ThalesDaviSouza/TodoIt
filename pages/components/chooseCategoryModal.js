const chooseCategoryModal = {
    props: ['categories'],

    data(){
        return {
            categories: this.categories,
        }
    },

    template: 
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="choose-category-modal" class="modal-body">
            <h1>Choose Category</h1>
            <p v-for="category in categories">{{category.name}}</p>
            <form @submit.prevent="">
            </form>
        </div>
    </div>
    `,
    methods: {
        closeModal: function(){
            this.$emit('closeModal')
        },
    }
}

export {chooseCategoryModal}