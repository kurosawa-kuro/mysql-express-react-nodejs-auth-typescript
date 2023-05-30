import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { loginUserApi } from '../services/api';
import { useUserStore, useFlashMessageStore } from '../state/store';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import PrivateRoute from '../components/PrivateRoute';
import ProfileScreen from '../screens/user/ProfileScreen';
import App from '../App';

jest.mock('../services/api');
jest.mock('../state/store', () => ({
    useUserStore: jest.fn(),
    useFlashMessageStore: jest.fn(),
}));

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

    return routes;
};

const mockUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
mockUseUserStore.mockReturnValue({ user, setUser: jest.fn() });

const mockUseFlashMessageStore = useFlashMessageStore as jest.MockedFunction<typeof useFlashMessageStore>;
mockUseFlashMessageStore.mockReturnValue({ flashMessage: null, setFlashMessage: jest.fn() });


afterEach(() => {
    jest.resetAllMocks();
});

test('ログイン成功後にProfile画面に遷移できる事を確認', async () => {
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
        expect(screen.getByText('MERN Auth App')).toBeInTheDocument();
        expect(screen.getByText(user.name)).toBeInTheDocument();
    });

    // Profile画面に遷移
    // Profileリンクをクリック
    // ユーザ名をクリックしてドロップダウンを表示
    fireEvent.click(screen.getByText(user.name));

    // ドロップダウン内にProfileリンクが存在することを確認
    const dropdownMenu = screen.getByTestId('dropdown-menu');
    const profileLink = within(dropdownMenu).getByText('Profile');

    // Profileリンクをクリック
    fireEvent.click(profileLink);

    // Profile画面が表示されることを確認
    await waitFor(() => {
        // プロフィール画面の具体的な要素やテキストをチェックします。
        // 下記は一例で、ProfileScreenコンポーネント内の特定の要素やテキストに置き換えてください。
        expect(screen.getByText('Update')).toBeInTheDocument();
    });

    // デバッグ情報を表示
    screen.debug();
});
