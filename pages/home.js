const home = {
    template:
    `<div @click.right.prevent="">
        <h3>Welcome to TODO-IT</h3>
        <router-link to="/todo">
            <button>Create a Todo List</button>
        </router-link>
    </div>`
}

export { home };