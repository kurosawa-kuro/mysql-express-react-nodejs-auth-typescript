import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("../hooks/auth/useLoginUserHook", () => ({
    useLoginUserHook: () => ({ mutation: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

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

test('renders LoginScreen with Sign In h1 header', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <LoginScreen />
            </Router>
        </QueryClientProvider>
    );

    const h1Element = screen.getByRole('heading', { name: /Sign In/i, level: 1 });
    expect(h1Element).toBeInTheDocument();
});
