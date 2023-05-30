import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import { AppWrapper, setupMocks, user, mockLoginUserApi } from '../../testUtils/testUtils';


jest.mock('../../services/api');
jest.mock('../../state/store');

describe('User Profile Test', () => {
    setupMocks();

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
