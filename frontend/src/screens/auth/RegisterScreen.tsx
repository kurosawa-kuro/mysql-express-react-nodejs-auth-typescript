// frontend\src\screens\RegisterScreen.jsx

// External Packages
import { Link } from 'react-router-dom';

// Internal Modules
import { useRegisterUserHook } from '../../hooks/auth/useRegisterUserHook';
// import { Loader } from '../../components/Loader';

const RegisterScreen = () => {
    // Custom Hook
    const {
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
    } = useRegisterUserHook();

    // Component JSX
    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={submitHandler}>
                <div className='my-2' id='name'>
                    <label>Name</label>
                    <input
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className='my-2' id='email'>
                    <label>Email Address</label>
                    <input
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='my-2' id='password'>
                    <label>Password</label>
                    <input
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className='my-2' id='confirmPassword'>
                    <label>Confirm Password</label>
                    <input
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type='submit' className='register-button mt-3'>
                    Register
                </button>

                {/* {registerUserMutation.isLoading && <Loader />} */}
            </form>

            <div className='py-3'>
                <span>
                    Already have an account? <Link to={`/login`}>Login</Link>
                </span>
            </div>
        </div>
    );
};

export default RegisterScreen;
