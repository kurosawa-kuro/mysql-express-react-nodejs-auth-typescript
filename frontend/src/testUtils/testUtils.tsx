// frontend\src\__tests__\testUtils.tsx

import React from 'react';
import { useRoutes } from 'react-router-dom';
import { registerUserApi, loginUserApi, fetchUserProfileApi, updateUserProfileApi } from '../services/api';
import { useUserStore, useFlashMessageStore } from '../state/store';

import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PrivateRoute from '../components/PrivateRoute';
import ProfileScreen from '../screens/user/ProfileScreen';

export const AppWrapper: React.FC = () => {
    let routes = useRoutes([
        {
            path: '/',
            element: <App />,
            children: [
                { index: true, element: <HomeScreen /> },
                { path: 'login', element: <LoginScreen /> },
                { path: 'register', element: <RegisterScreen /> },
                {
                    path: '',
                    element: <PrivateRoute />,
                    children: [
                        { path: 'profile', element: <ProfileScreen /> },
                    ],
                },
            ],
        },
    ]);

    return <>{routes}</>;
};

jest.mock('../services/api');
jest.mock('../state/store');

export const user = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
};

export const mockRegisterUserApi = registerUserApi as jest.MockedFunction<typeof registerUserApi>;
export const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;
export const mockFetchUserProfileApi = fetchUserProfileApi as jest.MockedFunction<typeof fetchUserProfileApi>;
export const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
export const mockUseFlashMessageStore = useFlashMessageStore as jest.MockedFunction<typeof useFlashMessageStore>;
export const mockUpdateUserProfileApi = updateUserProfileApi as jest.MockedFunction<typeof updateUserProfileApi>;

export const setupMocks = () => {
    beforeEach(() => {
        mockRegisterUserApi.mockResolvedValue(user);
        mockLoginUserApi.mockResolvedValue(user);
        mockFetchUserProfileApi.mockResolvedValue(user);
        mockUseUserStore.mockReturnValue({ user, setUser: jest.fn() });
        mockUseFlashMessageStore.mockReturnValue({ flashMessage: null, setFlashMessage: jest.fn() });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
};