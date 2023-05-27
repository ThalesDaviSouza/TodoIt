const warningModal = {
    props: ['warning'],

    computed: {
        warningTitle(){
            return this.warning.title
        },
        
        warningMessage(){
            return this.warning.message
        },
        
    },

    template:
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="warning-modal" class="modal-body">
            <h1>{{ warningTitle }}</h1>
            <h3>{{ warningMessage }}</h3>
            <button @click="closeModal">Return</button>
        </div>
    </div>
    `,

    methods:{
        closeModal: function(){
            this.$emit('closeModal')
        }
    }

}

export {warningModal}