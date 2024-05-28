import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class GameElementApiService {

    static servicePath = '/game/element';

    static async selectAll() {
        const token = store.state.auth.token;
        return await ApiService.get(`${this.servicePath}`, token);
    }

}