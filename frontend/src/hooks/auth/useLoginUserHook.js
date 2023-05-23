// frontend\src\hooks\auth\useLoginUserHook.js

// Importing React Hooks
import { useState } from 'react';

// Importing react-query Hooks
import { useMutation } from '@tanstack/react-query';

// Importing Navigation Hooks
import { useNavigate } from 'react-router-dom';

// Importing notification library
import { toast } from 'react-toastify';

// Importing Custom Hooks
import { useUserStore, useFlashMessageStore } from '../../state/store.js';

// Importing API service
import { loginUserApi } from '../../services/api.js';

/**
 * Custom hook for handling user login
 */
export const useLoginUserHook = () => {
    // Navigation
    const navigate = useNavigate();

    // Local State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Global State
    const { setUser } = useUserStore();
    const { setFlashMessage } = useFlashMessageStore();

    // API mutation
    const loginUserApiMutation = useMutation(
        async () => {
            const user = await loginUserApi({ email, password });
            return user;
        },
        {
            // On success
            onSuccess: (user) => {
                setUser(user);
                setFlashMessage("User login successful!");
                navigate('/');
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
        loginUserApiMutation.mutate();
    };

    // Return the values from the hook
    return {
        mutation: loginUserApiMutation,
        submitHandler,
        email,
        setEmail,
        password,
        setPassword
    }
}
