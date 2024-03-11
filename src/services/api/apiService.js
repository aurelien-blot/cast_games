import axios from 'axios';
export default class ApiService {

    static baseUrl = import.meta.env.VITE_APP_API_URL + '/api';

    static async get(endpoint) {
        try {
            const response = await axios.get(`${ApiService.baseUrl}${endpoint}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async post(endpoint, body) {
        try {
            const response = await axios.post(`${ApiService.baseUrl}${endpoint}`, body);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
