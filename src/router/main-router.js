import { home } from '../views/home.js';
import { todoList } from '../views/todo-list.js';

const routes = [
    {path: '/', component: home },
    {path: '/todo', component: todoList },
]

const router = new VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

export {router}