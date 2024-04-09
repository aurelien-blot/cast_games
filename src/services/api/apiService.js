import axios from 'axios';
export default class ApiService {

    static baseUrl = import.meta.env.VITE_APP_API_URL + '/api';

    static async get(endpoint) {
        let headers = ApiService.extractHeaders();
        try {
            const response = await axios.get(`${ApiService.baseUrl}${endpoint}`, {headers});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async post(endpoint, body, token=null) {
        let headers = ApiService.extractHeaders();
        try {
            const response = await axios.post(`${ApiService.baseUrl}${endpoint}`, body, {headers});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async put(endpoint, body) {
        let headers = ApiService.extractHeaders();
        try {
            const response = await axios.put(`${ApiService.baseUrl}${endpoint}`, body, {headers});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async delete(endpoint) {
        let headers = ApiService.extractHeaders();
        try {
            const response = await axios.delete(`${ApiService.baseUrl}${endpoint}`, {headers});
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static extractHeaders() {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
}
