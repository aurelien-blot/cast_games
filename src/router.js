import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue";
import Player from "@/views/Player.vue";
import store from '@/store/store.js';
import MailConfirmation from "@/views/user/MailConfirmation.vue";
import ResetPassword from "@/views/user/ResetPassword.vue";
import Editor from "@/views/Editor.vue";

const routes = [
    { path: '/', component: Home, name: 'Home'},
    { path: '/editor', component: Editor, name: 'Editor', meta: { requiresAuth: true } },
    { path: '/confirm-mail', component: MailConfirmation },
    { path: '/reset-password', component: ResetPassword },
    { path: '/player/:playerId', component: Player, name: 'Player',
        props:true, meta: { requiresAuth: true },key: (to) => String(to.params.playerId) },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters['auth/isLoggedIn'];
    if (to.meta.requiresAuth && !isLoggedIn) {
        // Redirige l'utilisateur vers la page de connexion si non connecté
        next({ name: 'login' });
    } else {
        next();
    }
});
export default router;