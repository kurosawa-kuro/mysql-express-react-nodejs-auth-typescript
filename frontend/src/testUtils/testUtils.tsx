// React関連とテストツール
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRoutes } from 'react-router-dom';

// アプリケーションコンポーネントと画面
import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PrivateRoute from '../components/PrivateRoute';
import ProfileScreen from '../screens/user/ProfileScreen';

// サービスとステート
import { registerUserApi, loginUserApi, fetchUserProfileApi } from '../services/api';
import { useUserStore, useFlashMessageStore } from '../state/store';

// Jestモック
jest.mock('../services/api');
jest.mock('../state/store');

// ユーザーデータのモック
export const user = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
};

// APIのモック関数
export const mockRegisterUserApi = registerUserApi as jest.MockedFunction<typeof registerUserApi>;
export const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;
export const mockFetchUserProfileApi = fetchUserProfileApi as jest.MockedFunction<typeof fetchUserProfileApi>;

// ステートのモック関数
export const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
export const mockUseFlashMessageStore = useFlashMessageStore as jest.MockedFunction<typeof useFlashMessageStore>;

// テスト用のアプリケーションラッパー
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

// モックセットアップとリセット
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

// テスト用のルーターでラッピングされたレンダリング関数
export const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route)
    render(ui, { wrapper: MemoryRouter })
}

// フォームの入力と送信を行うヘルパー関数
export const fillFormAndSubmit = async (
    data: { [key: string]: string },
    formTestId: string,
    apiFunction: jest.MockedFunction<any>
) => {
    for (let fieldName in data) {
        const input = screen.getByPlaceholderText(`Enter ${fieldName}`);
        fireEvent.change(input, { target: { value: data[fieldName] } });
    }
    const submitButton = screen.getByTestId(formTestId);
    fireEvent.submit(submitButton);

    await waitFor(() => {
        expect(apiFunction).toHaveBeenCalledWith(data);
    });
};
