import { createStore } from 'vuex';
import auth from "./auth.js";

const store = createStore({
    modules: {
        auth
    },
    state: {
        // autres états ici
    },
    getters: {
        isTestMode: (state) => {
            return import.meta.env.VITE_APP_TEST_MODE === 'true';
        },
        // autres getters ici
    },
    mutations: {
        // mutations ici
    },
    actions: {
        // actions ici
    }
});

export default store;
