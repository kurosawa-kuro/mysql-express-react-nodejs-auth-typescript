import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Route, MemoryRouter, Routes } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { loginUserApi } from '../services/api';

jest.mock('../services/api');

test('ログイン成功後にHome画面が表示されることを確認', async () => {
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;

    const email = "test@example.com";
    const password = "password";

    const user = { id: 1, email: 'test@example.com', name: 'Test User', isAdmin: false };
    mockLoginUserApi.mockResolvedValue(user);

    const { getByPlaceholderText, getByTestId } = render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/' element={<HomeScreen />} />
            </Routes>
        </MemoryRouter>
    );

    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const submitButton = getByTestId('login-form');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.submit(submitButton);

    await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalledWith({ email, password });
    });

    // Home画面が表示されるまで待つ
    await waitFor(() => {
        screen.debug();  // 現在のDOMをデバッグ
        expect(screen.getByText('MERN Authentication')).toBeInTheDocument();
    });
});
