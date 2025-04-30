import axios from 'axios';

// src/services/api.ts


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Substitua pela URL base da sua API
    timeout: 10000, // Tempo limite para requisições
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MyApp/1.0', // Substitua pelo User-Agent desejado
        'ngrok-skip-browser-warning': 'true'
    },
});

export const get = async (url: string, params?: any) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
};

export const post = async (url: string, data: any) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
};

export const put = async (url: string, data: any) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        console.error('PUT request error:', error);
        throw error;
    }
};

export const del = async (url: string) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        console.error('DELETE request error:', error);
        throw error;
    }
};

export default api;