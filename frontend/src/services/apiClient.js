// frontend\src\services\apiClient.js

import axios from "axios";

export const getApiClient = () => {
    const apiClient = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
    });

    return apiClient;
};
