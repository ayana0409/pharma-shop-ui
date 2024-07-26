import axios from "axios";
import { getToken as getTokenFromLocalStorage } from "../constants";

const getToken = () => {
    return getTokenFromLocalStorage();
};

const request = axios.create({
    baseURL: 'https://localhost:7104/api/',
    headers: {
        'Authorization': getToken() ? `Bearer ${getToken()}` : ''
    },
    withCredentials: true, 
})

export const remove = async (path, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.delete(path, { ...options, headers });
    return response.data;
};

export const get = async (path, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.get(path, { ...options, headers });
    return response.data;
};

export const post = async (path, data = {}, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.post(path, data, { ...options, headers });
    return response.data;
};

export const put = async (path, data = {}, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.put(path, data, { ...options, headers });
    return response.data;
};

export default request