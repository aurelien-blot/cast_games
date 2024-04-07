import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class PlayerApiService {

    static servicePath = '/player';

    static async getProfile(playerId) {
        const token = store.state.auth.token;
        return await ApiService.get(`${PlayerApiService.servicePath}/profile/${playerId}`, token);
    }

    static async getSocial(playerId) {
        const token = store.state.auth.token;
        return await ApiService.get(`${PlayerApiService.servicePath}/social/${playerId}`, token);
    }

    static async getHistory(playerId) {
        const token = store.state.auth.token;
        return await ApiService.get(`${PlayerApiService.servicePath}/history/${playerId}`, token);
    }

    static async getStatistics(playerId) {
        const token = store.state.auth.token;
        return await ApiService.get(`${PlayerApiService.servicePath}/stats/${playerId}`, token);
    }

    static async getSettings(playerId) {
        const token = store.state.auth.token;
        return await ApiService.get(`${PlayerApiService.servicePath}/settings/${playerId}`, token);
    }

    //TODO VOIR SI ENCORE BESOIN
    static async searchPlayer(playerName) {
        const token = store.state.auth.token;
        return await ApiService.post(`${PlayerApiService.servicePath}/search/${playerName}`, token);
    }


}