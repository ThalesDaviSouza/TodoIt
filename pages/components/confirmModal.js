const confirmModal = {
    props: ['confirm', 'acceptFunction'],

    computed: {
        confirmTitle(){
            return this.confirm.title
        },
        
        confirmMessage(){
            return this.confirm.message
        },

    },

    template:
    `
    <div class="modal-overlay" @click.self="closeModal">
        <div id="confirm-modal" class="modal-body">
            <h1>{{ confirmTitle }}</h1>
            <h3>{{ confirmMessage }}</h3>
            <button @click="acceptFunction">Confirm</button>
            <button @click="closeModal">Cancel</button>
        </div>
    </div>
    `,

    methods:{
        closeModal: function(){
            this.$emit('closeModal')
        }
    }

}

export {confirmModal}