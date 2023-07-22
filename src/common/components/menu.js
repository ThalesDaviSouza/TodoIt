const menu = {
    props: ['categories', 'selectedCategoryId', 'isDesktop'],
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
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
                                <span @click.stop="editCategory(category.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                    </svg>
                                </span>
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
            if(description){
                return (description + '').slice(0,120)
            }
            return ''
        },

        selectCategory: function(id){
            this.$emit('selectCategory', id)
            if(!this.isDesktop){
                this.closeMenu()
            }
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