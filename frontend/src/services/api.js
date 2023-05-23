// frontend\src\services\api.js

import { getApiClient } from './apiClient.js';

const apiClient = getApiClient();

export const registerUserApi = async ({ name, email, password }) => {
    const response = await apiClient.post('/api/users/register', {
        name,
        email,
        password,
    });
    return response.data;
}

export const loginUserApi = async ({ email, password }) => {
    const response = await apiClient.post('/api/users/login', { email, password });
    return response.data;
};

export const fetchUserProfileApi = async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
};

export const updateUserProfileApi = async ({ name, email, password }) => {
    const response = await apiClient.put('/api/users/profile', {
        name,
        email,
        password,
    });
    return response.data;
};

export const logoutUserApi = async () => {
    const response = await apiClient.post('/api/users/logout');
    return response.data;
};