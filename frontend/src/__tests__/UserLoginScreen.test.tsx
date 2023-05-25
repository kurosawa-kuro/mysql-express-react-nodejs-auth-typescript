import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from '../screens/auth/LoginScreen';

const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSubmitHandler = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('@tanstack/react-query', () => {
    const actualReactQuery = jest.requireActual('@tanstack/react-query');
    return {
        ...actualReactQuery,
        useMutation: jest.fn(() => ({
            mutate: jest.fn((_data, options) => {
                options.onSuccess();
            }),
            isLoading: false,
        })),
        QueryClient: jest.fn(() => ({
            clear: jest.fn(),
        })),
        QueryClientProvider: jest.fn(({ children }) => <>{children}</>),
    };
});



jest.mock('../services/api', () => ({
    ...jest.requireActual('../services/api'),
    loginUserApi: jest.fn().mockResolvedValue({
        user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        },
    }),
}));

jest.mock('../hooks/auth/useLoginUserHook', () => ({
    useLoginUserHook: () => ({
        mutation: { isLoading: false, isSuccess: true },
        submitHandler: mockSubmitHandler,
        email: '',
        setEmail: mockSetEmail,
        password: '',
        setPassword: mockSetPassword,
        navigate: mockNavigate,
    }),
}));

const queryClient = new QueryClient();

beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLFormElement.prototype.requestSubmit = () => { };
});

test('updates email and password values on input change', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(mockSetPassword).toHaveBeenCalledWith('password123');
});

test('calls handleFormSubmit on form submission', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockSubmitHandler).toHaveBeenCalled();
});


test('calls handleFormSubmit on form submission and verifies loginUserApi response', async () => {
    // loginUserApiのモックを作成して成功のレスポンスを定義
    const mockLoginUserApi = jest.fn().mockResolvedValue({
        user: {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
        },
    });
    jest.mock('../services/api', () => ({
        ...jest.requireActual('../services/api'),
        loginUserApi: mockLoginUserApi,
    }));

    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockSubmitHandler).toHaveBeenCalled();
    expect(mockLoginUserApi).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
    });
});
