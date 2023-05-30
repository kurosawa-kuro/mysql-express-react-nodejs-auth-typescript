// frontend\src\__tests__\testUtils.tsx

import React from 'react';
import { useRoutes } from 'react-router-dom';
import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PrivateRoute from '../components/PrivateRoute';
import ProfileScreen from '../screens/user/ProfileScreen';

const AppWrapper: React.FC = () => {
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

export default AppWrapper;
