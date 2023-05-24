// frontend\src\services\api.tsx

import { AxiosError } from 'axios';
import { getApiClient } from './apiClient';

const apiClient = getApiClient();

export interface FullUser {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

export interface LoginCredentials {
    password: string;
    email: string;
}

export interface UserUpdateData {
    userId: number;
    name: string;
    email: string;
}

export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

export interface UserUpdateDataFrontend {
    name: string;
    email: string;
}

export interface ApiError extends AxiosError {
    message: string;
}

export const registerUserApi = async (user: FullUser) => {
    const response = await apiClient.post<UserWithoutPassword>('/api/users/register', user);
    return response.data;
}

export const loginUserApi = async (credentials: LoginCredentials) => {
    const response = await apiClient.post<UserWithoutPassword>('/api/users/login', credentials);
    return response.data;
};

export const fetchUserProfileApi = async () => {
    const response = await apiClient.get<UserWithoutPassword>('/api/users/profile');
    return response.data;
};

export const updateUserProfileApi = async (user: UserUpdateDataFrontend) => {
    const response = await apiClient.put<UserWithoutPassword>('/api/users/profile', user);
    return response.data;
};

export const logoutUserApi = async () => {
    const response = await apiClient.post('/api/users/logout');
    return response.data;
};
