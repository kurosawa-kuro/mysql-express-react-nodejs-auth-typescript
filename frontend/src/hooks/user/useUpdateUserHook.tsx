// Importing React Hooks
import { useState, useEffect } from 'react';

// Importing notification library
import { toast } from 'react-toastify';

// Importing Custom Hooks
import { useUserStore } from '../../state/store';

// Importing API service
import { fetchUserProfileApi, updateUserProfileApi } from '../../services/api';

export interface FullUser {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

export interface LoginCredentials {
    password: string;
    email: string;
}

export interface UserUpdateData {
    userId: number;
    name: string;
    email: string;
}

export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};

export interface UserUpdateDataFrontend {
    name: string;
    email: string;
}
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

    // Fetch User Profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const data = await fetchUserProfileApi();
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                // error handling
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    // Form submit handler
    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
        } else {
            try {
                const data = await updateUserProfileApi({ name, email });
                setUser(data);
                toast.success('Profile updated successfully');
            } catch (error) {
                // error handling
                console.error(error);
            } finally {
                setIsLoading(false);
            }
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