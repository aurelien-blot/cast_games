import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class ContactApiService {

    static servicePath = '/contact';

    static async requestFriend(playerId) {
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/request/${playerId}`, token);
    }

    static async searchNewContact(playerName) {
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/search/new/${playerName}`, token);
    }

    static async acceptContact(id){
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/accept/${id}`, token);
    }

    static async rejectContact(id){
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/reject/${id}`, token);
    }


}