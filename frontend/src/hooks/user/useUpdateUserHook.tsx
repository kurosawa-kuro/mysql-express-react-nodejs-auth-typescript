// Importing React Hooks
import { useState, useEffect } from 'react';

// Importing react-query Hooks
import { useQuery, useMutation } from '@tanstack/react-query';

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

    // Global State
    const { setUser } = useUserStore();

    // API Query
    const { data: userProfile, isLoading } = useQuery<UserWithoutPassword, Error>(['userProfile'], fetchUserProfileApi);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setEmail(userProfile.email);
        }
    }, [userProfile]);

    // API Mutation
    const updateUserMutation = useMutation<UserWithoutPassword, Error, UserUpdateDataFrontend>(
        async ({ name, email }) => {
            const updatedUser = await updateUserProfileApi({ name, email });
            return updatedUser;
        },
        {
            // On success
            onSuccess: (updatedUser) => {
                setUser(updatedUser);
                toast.success('Profile updated successfully');
            },
            // On error
            onError: (error) => {
                // toast.error(error?.response?.data?.message || error.message);
            },
        }
    );

    // Form submit handler
    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            updateUserMutation.mutate({ name, email });
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
