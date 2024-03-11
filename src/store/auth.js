export default {
    namespaced: true,
    state() {
        return {
            isLoggedIn: !!localStorage.getItem('connectedUser'),
        };
    },
    mutations: {
        setLoggedIn(state, value) {
            state.isLoggedIn = value;
            if (value) {
                localStorage.setItem('connectedUser', 'true');
            } else {
                localStorage.removeItem('connectedUser');
            }
        }
    },
    actions: {
        login({ commit }) {
            commit('setLoggedIn', true);
        },
        logout({ commit }) {
            commit('setLoggedIn', false);
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn
    }
};
