// frontend\src\hooks\auth\useLoginUserHook.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUserApi, ApiError } from '../../services/api';
import { useUserStore, useFlashMessageStore } from '../../state/store';

const useLoginUserHook = () => {
    const { setUser } = useUserStore();
    const { setFlashMessage } = useFlashMessageStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            const user = await loginUserApi({ email, password });
            if (user) {
                setUser(user);
            }
            setFlashMessage('User login successful!');
            navigate('/');
        } catch (err: ApiError | any) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        loginUser,
    };
};

export default useLoginUserHook;
