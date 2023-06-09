import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { AppWrapper, setupMocks, user, mockRegisterUserApi } from '../../testUtils/testUtils';

describe('User Registration Test', () => {
    setupMocks();

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
