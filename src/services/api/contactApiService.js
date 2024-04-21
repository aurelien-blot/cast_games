import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class ContactApiService {

    static servicePath = '/contact';

    static async requestFriend(playerId) {
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/request/${playerId}`, token);
    }
    static async requestFriendByEmail(playerMail) {
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/request/mail/${playerMail}`, token);
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

    static async blockContact(id){
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/block/${id}`, token);
    }

    static async unblockContact(id){
        const token = store.state.auth.token;
        return await ApiService.post(`${ContactApiService.servicePath}/unblock/${id}`, token);
    }

    static async deleteContact(id){
        const token = store.state.auth.token;
        return await ApiService.delete(`${ContactApiService.servicePath}/${id}`, token);
    }

    static async getActiveContacts(){
        const token = store.state.auth.token;
        return await ApiService.get(`${ContactApiService.servicePath}/active`, token);
    }

}