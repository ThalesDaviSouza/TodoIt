import { router } from './router/main-router.js'

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