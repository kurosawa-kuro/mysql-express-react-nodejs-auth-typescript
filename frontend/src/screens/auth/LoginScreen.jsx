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
    <div className="form-container">
      <h1>Sign In</h1>

      <form onSubmit={submitHandler}>
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

        <button
          disabled={loginUserApiMutation.isLoading}
          type='submit'
          className='register-button mt-3'
        >
          Sign In
        </button>
      </form>

      {loginUserApiMutation.isLoading && <Loader />}

      <div className='py-3'>
        New Customer? <Link to='/register'>Register</Link>
      </div>
    </div>
  );
};

export default LoginScreen;
