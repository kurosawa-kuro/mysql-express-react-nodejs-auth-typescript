// Testing packages
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Component to test
import LoginScreen from '../screens/auth/LoginScreen';

// Mocking the loginUserApi
import { loginUserApi } from '../services/api';
jest.mock('../services/api');

test('ログインフォームにEmailとPWを入力してsubmitした時に非同期通信処理が呼ばれるかのテスト', async () => {
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;

    const email = "test@example.com";
    const password = "password";

    const { getByPlaceholderText, getByTestId } = render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const submitButton = getByTestId('login-form');

    // Simulating user input and form submission
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.submit(submitButton);

    // Expect loginUserApi to have been called
    await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalledWith({ email, password });
    });
});
