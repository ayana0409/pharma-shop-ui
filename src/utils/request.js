import axios from "axios";
import { getToken } from "../constants";

var request = axios.create({
    baseURL: 'https://pharmashop-api.onrender.com/api/',
    withCredentials: true, 
})

request.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                console.log(status);
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export var remove = async (path, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.delete(path, { ...options, headers });
    return response.data;
};

export var get = async (path, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.get(path, { ...options, headers });
    
    return response.data;
};

export var post = async (path, data = {}, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.post(path, data, { ...options, headers });
    return response.data;
};

export var put = async (path, data = {}, options = {}) => {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
    };
    const response = await request.put(path, data, { ...options, headers });
    return response.data;
};

export default request