import ApiService from "@/services/api/apiService.js";

export default class LoginApiService {

    static servicePath = '/login';

    static async checkUsernameAvailability(username) {
        return await ApiService.get(`${LoginApiService.servicePath}/availability/username/${username}`);
    }
    static async checkMailAvailability(mail) {
        return await ApiService.get(`${LoginApiService.servicePath}/availability/mail/${mail}`);
    }
    static async register(user) {
        return await ApiService.post(`${LoginApiService.servicePath}/register`, user);
    }
    static async login(user) {
        return await ApiService.post(`${LoginApiService.servicePath}`, user);
    }

    static async confirmMail(token) {
        return await ApiService.get(`${LoginApiService.servicePath}/verify/mail/${token}`);
    }

}