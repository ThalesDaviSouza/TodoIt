const menu = {
    props: ['categories'],
    emits: ['chooseCategory', 'closeMenu'],

    computed: {

    },

    template:
    `
    <section>
        <div class="menu-overlay">
            <div class="menu-body">
                <div class="menu-header">
                    <div class="menu-close-btn">
                        <span>Back</span>
                    </div>
                    <h1>Todo It</h1>
                    <div class="menu-search">
                        <input type="text" id="" placeholder="Search...">
                        <button>Search</button>
                    </div>
                </div>
                <div class="menu-body">
                    <div class="category-menu-card" v-for="category in categories">
                        <h3>{{ category.name }}</h3>
                        <span>Edit Category</span>
                    </div>
                </div>
                <div class="menu-footer"></div>
            </div>
        </div>
    </section>
    `,

    methods:{
        closeMenu: function(){
            this.$emit('closeMenu')
        }
    }

}

export {menu}