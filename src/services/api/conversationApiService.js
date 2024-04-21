import ApiService from "@/services/api/apiService.js";
import store from "@/store/store.js";

export default class ConversationApiService {

    static servicePath = '/conversation';

    static async requestConversationList(conversation) {
        const token = store.state.auth.token;
        return await ApiService.post(`${ConversationApiService.servicePath}`, conversation, token);
    }

}