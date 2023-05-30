import { MemoryRouter, useRoutes } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import { registerUserApi } from '../services/api';

jest.mock('../services/api');

describe('User Registration Test', () => {
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
                    { path: 'register', element: <RegisterScreen /> },
                ],
            },
        ]);

        return routes;
    };

    const mockRegisterUserApi = registerUserApi as jest.MockedFunction<typeof registerUserApi>;

    beforeEach(() => {
        mockRegisterUserApi.mockResolvedValue(user);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('ユーザー登録成功後にHome画面とHeaderコンポーネントが表示されることを確認', async () => {
        const name = 'Test User';
        const email = 'test@example.com';
        const password = 'password';
        const confirmPassword = 'password';

        render(
            <MemoryRouter initialEntries={['/register']}>
                <AppWrapper />
            </MemoryRouter>
        );

        // 登録フォームの入力と送信
        const nameInput = screen.getByPlaceholderText('Enter name');
        const emailInput = screen.getByPlaceholderText('Enter email');
        const passwordInput = screen.getByPlaceholderText('Enter password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
        const submitButton = screen.getByTestId('register-form');

        fireEvent.change(nameInput, { target: { value: name } });
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.change(confirmPasswordInput, { target: { value: confirmPassword } });
        fireEvent.submit(submitButton);

        // registerUserApiが正しく呼び出されたことを検証
        await waitFor(() => {
            expect(mockRegisterUserApi).toHaveBeenCalledWith({
                name,
                email,
                password,
                isAdmin: false
            });
        });

        // Home画面とHeaderコンポーネント, user.nameが表示されるまで待つ
        await waitFor(() => {
            expect(screen.getByText('Home')).toBeInTheDocument();
            expect(screen.getByText('MERN Auth App')).toBeInTheDocument();
            expect(screen.getByText(user.name)).toBeInTheDocument();
        });
    });
});
