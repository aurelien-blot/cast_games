import ApiService from "@/services/api/apiService.js";

export default class UserApiService {

    static servicePath = '/user';

    static async getAll() {
        return await ApiService.get(`${UserApiService.servicePath}`);
    }


}