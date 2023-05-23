// frontend\src\hooks\user\useUpdateUserHook.js

// Importing React Hooks
import { useState, useEffect } from 'react';

// Importing react-query Hooks
import { useQuery, useMutation } from '@tanstack/react-query';

// Importing notification library
import { toast } from 'react-toastify';

// Importing Custom Hooks
import { useUserStore } from '../../state/store.js';

// Importing API service
import { fetchUserProfileApi, updateUserProfileApi } from '../../services/api.js';

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
    const { user, setUser } = useUserStore();

    // API Query
    const { data: userProfile, isLoading } = useQuery(['userProfile'], fetchUserProfileApi);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setEmail(userProfile.email);
        }
    }, [userProfile]);

    // API Mutation
    const updateUserMutation = useMutation(
        async ({ name, email, password }) => {
            const updatedUser = await updateUserProfileApi({ name, email, password });
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
                toast.error(error?.response?.data?.message || error.message);
            },
        }
    );

    // Form submit handler
    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            updateUserMutation.mutate({ id: user.id, name, email, password });
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
