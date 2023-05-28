// テストに必要なパッケージをインポート
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// テスト対象のコンポーネントをインポート
import LoginScreen from '../screens/auth/LoginScreen';

// loginUserApiのモックを作成
import { loginUserApi } from '../services/api';
jest.mock('../services/api');

// useNavigateをモック化
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

test('ログインフォームにEmailとPWを入力して送信した時、非同期通信処理が呼び出されるか', async () => {
    // loginUserApiのモック関数を作成
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;

    // テスト用のメールアドレスとパスワードを設定
    const email = "test@example.com";
    const password = "password";

    // モックユーザーを作成
    const user = { id: 1, email: 'test@example.com', name: 'Test User', isAdmin: false };

    // loginUserApiがユーザーを返すように設定
    mockLoginUserApi.mockResolvedValue(user);

    // useNavigateのモックを作成
    const navigate = jest.fn();
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(navigate);

    // レンダリング
    const { getByPlaceholderText, getByTestId } = render(
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    );

    // 入力フィールドと送信ボタンを取得
    const emailInput = getByPlaceholderText('Enter email');
    const passwordInput = getByPlaceholderText('Enter password');
    const submitButton = getByTestId('login-form');

    // ユーザーの入力とフォームの送信をシミュレート
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.submit(submitButton);

    // loginUserApiが呼び出されたことを確認
    await waitFor(() => {
        expect(mockLoginUserApi).toHaveBeenCalledWith({ email, password });
    });

    // navigateが正しいパスで呼び出されたことを確認
    expect(navigate).toHaveBeenCalledWith('/');
});
