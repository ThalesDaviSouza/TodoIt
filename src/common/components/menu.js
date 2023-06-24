const menu = {
    props: ['categories', 'selectedCategoryId'],
    emits: ['chooseCategory', 'closeMenu', 'selectCategory'],

    data: function(){
        return {
            searchInput: '',
        }
    },

    computed: {
        Results(){
            let results

            if(this.searchInput != ''){
                results = this.categories.filter(c => c.name.toLowerCase().includes(this.searchInput.toLowerCase()))
            }

            return results
        }

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
                        <input v-model="searchInput" type="text" placeholder="Search...">
                        <button>Search</button>
                    </div>
                </div>
                <div class="menu-body">
                    <div class="category-menu-card" :class="isSelected(-1)" @click="selectCategory(-1)">
                        <div class="category-header">
                            <h3>All Tasks</h3>
                        </div>
                        <div class="category-body"></div>
                    </div>
                    <div v-show="!Results">
                        <div class="category-menu-card" :class="isSelected(category.id)"
                            @click="selectCategory(category.id)" v-for="category in categories">
                            <div class="category-header">
                                <h3>{{ category.name }}</h3>
                                <span>Edit Category</span>
                            </div>
                            <div class="category-body">
                                <p>{{ getShortDescription(category.description) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="results" v-show="Results">
                        <div class="category-menu-card" :class="isSelected(category.id)"
                            @click="selectCategory(category.id)" v-for="category in Results">
                            <div class="category-header">
                                <h3>{{ category.name }}</h3>
                                <span>Edit Category</span>
                            </div>
                            <div class="category-body">
                                <p>{{ getShortDescription(category.description) }}</p>
                            </div>
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
        },

        selectCategory: function(id){
            this.$emit('selectCategory', id)
            this.closeMenu()
        },

        isSelected(id){
            return this.selectedCategoryId == id ? 'selected-category' : ''
        }

    }

}

export {menu}