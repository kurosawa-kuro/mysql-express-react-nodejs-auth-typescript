// Importing React Hooks
import { useState, useEffect } from 'react';

// Importing Custom Hooks
import { useUserStore, useFlashMessageStore } from '../../state/store';

// Importing API service
import { fetchUserProfileApi, updateUserProfileApi } from '../../services/api';

/**
 * Custom hook for handling user profile update
 */
const useUpdateUserHook = () => {
    // Local State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Global State
    const { setUser } = useUserStore();
    const { setFlashMessage } = useFlashMessageStore();

    // Fetch User Profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const data = await fetchUserProfileApi();
                if (data) {
                    setName(data.name);
                    setEmail(data.email);
                } else {
                    setFlashMessage('User data is undefined.');
                }
            } catch (error: any) {
                setFlashMessage('Error fetching user data.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [setFlashMessage]);

    // Form submit handler
    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== confirmPassword) {
            setFlashMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const user = await updateUserProfileApi({ name, email });
            if (user) {
                setUser(user);
                setFlashMessage('Profile updated successfully');
            } else {
                setFlashMessage('Unable to update profile. Please try again.');
            }
        } catch (error: any) {
            setFlashMessage('Error updating profile. Please check your details and try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Return the values from the hook
    return {
        name, setName,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        isLoading,
        submitHandler,
    };
};

export default useUpdateUserHook;
