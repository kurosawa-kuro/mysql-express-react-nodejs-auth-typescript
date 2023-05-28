import { useRoutes } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen.tsx';
import LoginScreen from './screens/auth/LoginScreen.tsx';
// import RegisterScreen from '../screens/auth/RegisterScreen.tsx';
// import ProfileScreen from '../screens/user/ProfileScreen.tsx';
// import PrivateRoute from '../components/PrivateRoute.tsx';
import App from './App.tsx';

const TestApp = () => {
    let routes = useRoutes([
        {
            path: '/',
            element: <App />,
            children: [
                { index: true, element: <HomeScreen /> },
                { path: 'login', element: <LoginScreen /> },
            ]
        },
    ]);

    return routes;
};


export default TestApp;
