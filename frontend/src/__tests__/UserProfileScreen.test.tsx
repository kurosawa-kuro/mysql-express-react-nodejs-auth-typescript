import { MemoryRouter, useRoutes } from 'react-router-dom';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';

import App from '../App';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import PrivateRoute from '../components/PrivateRoute';
import ProfileScreen from '../screens/user/ProfileScreen';

import { useUserStore, useFlashMessageStore } from '../state/store';
import { loginUserApi, fetchUserProfileApi } from '../services/api';

jest.mock('../services/api');
jest.mock('../state/store');

describe('User Profile Test', () => {
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
    const mockUseFlashMessageStore = useFlashMessageStore as jest.MockedFunction<typeof useFlashMessageStore>;
    const mockLoginUserApi = loginUserApi as jest.MockedFunction<typeof loginUserApi>;
    const mockFetchUserProfileApi = fetchUserProfileApi as jest.MockedFunction<typeof fetchUserProfileApi>;

    beforeEach(() => {
        mockUseUserStore.mockReturnValue({ user, setUser: jest.fn() });
        mockUseFlashMessageStore.mockReturnValue({ flashMessage: null, setFlashMessage: jest.fn() });
        mockLoginUserApi.mockResolvedValue(user);
        mockFetchUserProfileApi.mockResolvedValue(user);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('ログイン成功後にProfile画面に遷移できる事を確認', async () => {
        const email = 'test@example.com';
        const password = 'password';

        render(
            <MemoryRouter initialEntries={['/login']}>
                <AppWrapper />
            </MemoryRouter>
        );

        // Fill in and submit the login form.
        const emailInput = screen.getByPlaceholderText('Enter email');
        const passwordInput = screen.getByPlaceholderText('Enter password');
        const submitButton = screen.getByTestId('login-form');

        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(passwordInput, { target: { value: password } });
        fireEvent.submit(submitButton);

        // Check that loginUserApi was called correctly.
        await waitFor(() => {
            expect(mockLoginUserApi).toHaveBeenCalledWith({ email, password });
        });

        // Wait for the HomeScreen and Header components to appear.
        await waitFor(() => {
            expect(screen.getByText('MERN Auth App')).toBeInTheDocument();
            expect(screen.getByText(user.name)).toBeInTheDocument();
        });

        // Navigate to the profile screen.
        // Click the user name to open the dropdown.
        fireEvent.click(screen.getByText(user.name));

        // Check that the dropdown contains a link to the profile screen.
        const dropdownMenu = screen.getByTestId('dropdown-menu');
        const profileLink = within(dropdownMenu).getByText('Profile');

        // Click the link to the profile screen.
        fireEvent.click(profileLink);

        // Check that the profile screen is displayed.
        await waitFor(() => {
            // Check for specific elements or text in the ProfileScreen component.
            // Replace the line below with specific checks for your ProfileScreen component.
            expect(screen.getByText('Update')).toBeInTheDocument();
        });
    });
});
