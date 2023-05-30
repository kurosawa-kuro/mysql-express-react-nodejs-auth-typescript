// frontend\src\hooks\auth\useRegisterUserHook.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../services/api.js';
import { useUserStore, useFlashMessageStore } from '../../state/store';

export const useRegisterUserHook = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser } = useUserStore();
    const { setFlashMessage } = useFlashMessageStore();

    const submitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const user = await registerUserApi({
                name,
                email,
                password,
                isAdmin: false
            });
            setIsLoading(false);
            setUser(user);
            setFlashMessage('User login successful!');
            navigate('/');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.message);
        }
    };

    return {
        submitHandler,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        isLoading,
        error
    }
};
