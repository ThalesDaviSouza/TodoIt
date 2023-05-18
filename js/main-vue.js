import { home } from '../pages/home.js';
import { todoList } from '../pages/todo-list.js';


const routes = [
    {path: '/', component: home },
    {path: '/todo', component: todoList },
    // {path: '/:pathMatch(.*)*', component: notFound},
]

const router = new VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

const app = Vue.createApp({
    template:
    `<main class="transition">
    <router-view v-slot="{ Component }">
    <component :is="Component" />
    </router-view>
    </main>`,
});

app.use(router);
app.mount('#app');