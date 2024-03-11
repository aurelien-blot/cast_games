import ApiService from "@/services/api/apiService.js";

export default class UserApiService {

    static servicePath = '/user';

    static async checkUsernameAvailability(username) {
        return await ApiService.get(`${UserApiService.servicePath}/check-username/${username}`);
    }

}