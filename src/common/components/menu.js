const menu = {
    props: ['categories'],
    emits: ['chooseCategory', 'closeMenu'],

    computed: {
        
    },

    template:
    `
    <section>
        <div class="menu-overlay" @click.self="closeMenu">
            <div class="menu-body" @click="">
                <div class="menu-header">
                    <div class="menu-close-btn">
                        <span @click="closeMenu()">Back</span>
                    </div>
                    <h1>Todo It</h1>
                    <div class="menu-search">
                        <input type="text" placeholder="Search...">
                        <button>Search</button>
                    </div>
                </div>
                <div class="menu-body">
                    <div class="category-menu-card" v-for="category in categories">
                        <div class="category-header">
                            <h3>{{ category.name }}</h3>
                            <span>Edit Category</span>
                        </div>
                        <div class="category-body">
                            <p>{{ getShortDescription(category.description) }}</p>
                        </div>
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
        },

        getShortDescription: function(description){
            return (description + '').slice(0,120)
        }
    }

}

export {menu}