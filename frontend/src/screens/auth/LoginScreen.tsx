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
        <div>
            <h1>Sign In</h1>

            <form onSubmit={submitHandler}>
                <div id='email'>
                    <label>Email Address</label>
                    <input
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div id='password'>
                    <label>Password</label>
                    <input
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    disabled={loginUserApiMutation.isLoading}
                    type='submit'
                >
                    Sign In
                </button>
            </form>

            {loginUserApiMutation.isLoading && <Loader />}

            <div>
                New Customer? <Link to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default LoginScreen;
