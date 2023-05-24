// frontend\src\screens\LoginScreen.jsx

// External Packages
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';

// Internal Modules
import { useLoginUserHook } from '../../hooks/auth/useLoginUserHook';

const LoginScreen = () => {
    const {
        mutation: loginUserApiMutation,
        submitHandler,
        email,
        setEmail,
        password,
        setPassword
    } = useLoginUserHook();

    // Component JSX
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Sign In</h1>

            <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
                    Sign In
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
