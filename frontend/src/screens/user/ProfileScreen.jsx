// frontend\src\screens\ProfileScreen.jsx

import { Loader } from '../../components/Loader';
import useUpdateUserHook from '../../hooks/user/useUpdateUserHook';

const ProfileScreen = () => {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    submitHandler,
  } = useUpdateUserHook();

  if (isLoading) return <Loader />;

  return (
    <div className="form-container">
      <h1>Update Profile</h1>

      <form onSubmit={submitHandler}>
        <div className='my-2' id='name'>
          <label>Name</label>
          <input
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className='my-2' id='email'>
          <label>Email Address</label>
          <input
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className='my-2' id='password'>
          <label>Password</label>
          <input
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <div className='my-2' id='confirmPassword'>
          <label>Confirm Password</label>
          <input
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <button type='submit' className='submit-button mt-3'>
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfileScreen;