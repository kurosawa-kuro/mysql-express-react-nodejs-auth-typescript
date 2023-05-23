// frontend\src\hooks\auth\useRegisterUserHook.js

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
import { registerUserApi } from '../../services/api.js';

/**
 * Custom hook for handling user registration
 */
export const useRegisterUserHook = () => {
    // Navigation
    const navigate = useNavigate();

    // Local State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Global State
    const { setUser } = useUserStore();
    const { setFlashMessage } = useFlashMessageStore();

    // API Mutation
    const registerUserMutation = useMutation(
        async () => {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            const user = await registerUserApi({ name, email, password });
            return user;
        },
        {
            // On success
            onSuccess: (user) => {
                setUser(user);
                setFlashMessage("User registration successful!");
                navigate('/');
            },
            onError: (error) => {
                toast.error(error?.message || "An error occurred");
            },
        }
    );

    // Form submit handler
    const submitHandler = (e) => {
        e.preventDefault();
        registerUserMutation.mutate();
    };

    // Return the values from the hook
    return {
        mutation: registerUserMutation,
        submitHandler,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword
    }
};
