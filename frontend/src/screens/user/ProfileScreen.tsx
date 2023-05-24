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
        <div>
            <h1>Update Profile</h1>

            <form onSubmit={submitHandler}>
                <div id='name'>
                    <label>Name</label>
                    <input
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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

                <div id='confirmPassword'>
                    <label>Confirm Password</label>
                    <input
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type='submit'>
                    Update
                </button>
            </form>
        </div>
    );
};

export default ProfileScreen;
