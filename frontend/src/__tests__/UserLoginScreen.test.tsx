import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TestApp from '../TestApp';
import { loginUserApi } from '../services/api';

jest.mock('../services/api');

test('ログイン成功後にHome画面とHeaderコンポーネントが表示されることを確認', async () => {
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;

    const email = 'test@example.com';
    const password = 'password';

    const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        isAdmin: false,
    };
    mockLoginUserApi.mockResolvedValue(user);

    render(
        <MemoryRouter initialEntries={['/login']}>
            <TestApp />
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

    // Home画面とHeaderコンポーネントが表示されるまで待つ
    await waitFor(() => {
        expect(screen.getByText('MERN Authentication')).toBeInTheDocument();
        expect(screen.getByText('MERN Auth Header')).toBeInTheDocument();
    });

    // デバッグ情報を表示
    // screen.debug();
});
