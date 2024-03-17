import { createStore } from 'vuex';
import auth from "./auth.js";

const store = createStore({
    modules: {
        auth
    },
    state: {
    },
    getters: {
        isTestMode: (state) => {
            return import.meta.env.VITE_APP_TEST_MODE === 'true';
        },
    },
    mutations: {
    },
    actions: {
    }
});

export default store;
