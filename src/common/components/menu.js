const menu = {
    props: ['categories', 'selectedCategoryId'],
    emits: ['chooseCategory', 'closeMenu', 'selectCategory', 'editCategory'],

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
                        <span @click="closeMenu()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                            </svg>
                        </span>
                    </div>
                    <h1>Todo It</h1>
                    <div class="menu-search">
                        <input v-model="searchInput" type="text" placeholder="Search...">
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
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
                                <span @click="editCategory(category.id)">Edit Category</span>
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
                                <span @click="editCategory()">Edit Category</span>
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

        isSelected: function(id){
            return this.selectedCategoryId == id ? 'selected-category' : ''
        },

        editCategory: function(id){
            this.$emit('editCategory', id)
        }

    }

}

export {menu}