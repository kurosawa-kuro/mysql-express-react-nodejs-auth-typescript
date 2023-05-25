import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        handleFormSubmit: mockSubmitHandler,
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

test('renders LoginScreen with Sign In h1 header and input fields', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const h1Element = screen.getByRole('heading', { name: /Sign In/i, level: 1 });
    expect(h1Element).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('Enter email');
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('Enter password');
    expect(passwordInput).toBeInTheDocument();
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

test('renders Loader when API call is loading', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
});

test('redirects to home screen after successful login', async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const emailInput = screen.getByPlaceholderText('Enter email');
    const passwordInput = screen.getByPlaceholderText('Enter password');

    fireEvent.change(emailInput, {
        target: { value: 'test@example.com' },
    });
    fireEvent.change(passwordInput, {
        target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
        expect(mockSubmitHandler).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
