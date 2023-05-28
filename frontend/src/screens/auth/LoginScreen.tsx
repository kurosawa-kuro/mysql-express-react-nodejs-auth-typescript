// frontend\src\screens\LoginScreen.jsx

// External Packages
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserStore, useFlashMessageStore } from '../../state/store';
import { loginUserApi, ApiError } from '../../services/api';

const LoginScreen = () => {
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
            onError: (error: AxiosError<ApiError>) => {
                toast.error(error?.response?.data?.message || error.message);
            },
        }
    );

    // Form submit handler
    const submitHandler = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        loginUserApiMutation.mutate();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Log in</h1>

            <form data-testid="login-form" onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" role="form">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <button
                    disabled={loginUserApiMutation.isLoading}
                    type='submit'
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Log in
                </button>
            </form>

            {loginUserApiMutation.isLoading && <Loader />}

            <div>
                New Customer? <Link to='/register' className="text-blue-500">Register</Link>
            </div>
        </div>
    );
};

export default LoginScreen;
