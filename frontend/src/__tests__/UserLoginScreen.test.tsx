import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a mock of useLoginUserHook
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();

jest.mock('../hooks/auth/useLoginUserHook', () => ({
    useLoginUserHook: () => ({
        mutation: { isLoading: false },
        submitHandler: jest.fn(),
        email: '',
        setEmail: mockSetEmail,
        password: '',
        setPassword: mockSetPassword,
    }),
}));


// Create a mock of react-query useMutation
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

// Create a client
const queryClient = new QueryClient();

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

// Add more test cases as needed
