import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class MessageApiService {

    static servicePath = '/message';

    static async requestMessageSending(conversation) {
        const token = store.state.auth.token;
        return await ApiService.post(`${MessageApiService.servicePath}`, conversation, token);
    }

}