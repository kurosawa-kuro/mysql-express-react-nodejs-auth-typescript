import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();
const mockSubmitHandler = jest.fn();

// Create a standalone mock function
let mockUseLoginUserHook = jest.fn();

jest.mock('../hooks/auth/useLoginUserHook', () => {
    return {
        ...jest.requireActual('../hooks/auth/useLoginUserHook'),
        useLoginUserHook: () => mockUseLoginUserHook(),
        submitHandler: mockSubmitHandler,
    };
});

jest.mock('@tanstack/react-query', () => {
    const actualReactQuery = jest.requireActual('@tanstack/react-query');
    return {
        ...actualReactQuery,
        useMutation: () => ({
            mutate: jest.fn(),
            isLoading: false,
        }),
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const queryClient = new QueryClient();

beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLFormElement.prototype.requestSubmit = () => { };
    mockUseLoginUserHook = jest.fn().mockReturnValue({
        mutation: { isLoading: false },
        submitHandler: mockSubmitHandler,
        email: '',
        setEmail: mockSetEmail,
        password: '',
        setPassword: mockSetPassword,
    });
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

test('calls submitHandler on form submission', () => {
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
    mockUseLoginUserHook.mockReturnValue({
        mutation: { isLoading: true },
        submitHandler: mockSubmitHandler,
        email: '',
        setEmail: mockSetEmail,
        password: '',
        setPassword: mockSetPassword,
    });

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
    const navigate = jest.fn();

    (useNavigate as jest.Mock).mockReturnValue(navigate);

    mockUseLoginUserHook = jest.fn().mockReturnValue({
        mutation: { isLoading: false, isSuccess: true },
        submitHandler: navigate,
        email: '',
        setEmail: mockSetEmail,
        password: '',
        setPassword: mockSetPassword,
    });

    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
        target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
        target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId('login-form'));
    // fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Expect to be redirected to home
    expect(navigate).toHaveBeenCalledWith('/');
});