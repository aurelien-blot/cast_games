import axios from 'axios';
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";

export default {
    namespaced: true,
    state() {
        return {
            token: localStorage.getItem('token') || null,
            user: JSON.parse(localStorage.getItem('connectedUser')) || null,
        };
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        },
        setUser(state, user) {
            state.user = user;
            if (user) {
                localStorage.setItem('connectedUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('connectedUser');
            }
        }
    },
    actions: {
        async login({ commit }, user) {
            let loginResponse = null;
            await LoginApiService.login(user).then((result) => {
                loginResponse =result;
            }).catch((error) => {
                ErrorService.showErrorInAlert(error);
            });
            if(loginResponse!=null && loginResponse.success===true){
                commit('setToken', loginResponse.token);
                commit('setUser', loginResponse.user);
            }
            return loginResponse;
        },
        logout({ commit }) {
            commit('setToken', null);
            commit('setUser', null);
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        connectedUser: state => state.user
    }
};