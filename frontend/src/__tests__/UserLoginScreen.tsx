import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { loginUserApi } from '../services/api';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import App from '../App';

jest.mock('../services/api');

const user = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
};

const AppWrapper = () => {
    let routes = useRoutes([
        {
            path: '/',
            element: <App />,
            children: [
                { index: true, element: <HomeScreen /> },
                { path: 'login', element: <LoginScreen /> },
            ],
        },
    ]);

    return routes;
};

test('ログイン成功後にHome画面とHeaderコンポーネントが表示されることを確認', async () => {
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;

    const email = 'test@example.com';
    const password = 'password';

    mockLoginUserApi.mockResolvedValue(user);

    render(
        <MemoryRouter initialEntries={['/login']}>
            <AppWrapper />
        </MemoryRouter>
    );

    // ログインフォームの入力と送信
    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Enter password');
    const submitButton = screen.getByTestId('login-form');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.submit(submitButton);

    // loginUserApiが正しく呼び出されたことを検証
    await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalledWith({ email, password });
    });

    // Home画面とHeaderコンポーネント,user.nameが表示されるまで待つ
    await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('MERN Auth App')).toBeInTheDocument();
        expect(screen.getByText(user.name)).toBeInTheDocument();
    });

    // デバッグ情報を表示
    screen.debug();
});
