import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '../state/store';
import { logoutUserApi } from '../services/api';

const Header = () => {
    const { user, setUser } = useUserStore();
    const navigate = useNavigate();

    const logoutMutation = useMutation(
        async () => {
            await logoutUserApi();
        },
        {
            onSuccess: () => {
                setUser(null);
                navigate('/login');
            },
            onError: (err) => {
                console.error(err);
            },
        }
    );

    const logoutHandler = () => {
        logoutMutation.mutate();
    };

    return (
        <header>
            <div>
                <div>
                    <Link to={`/`}>MERN Auth</Link>
                </div>
                <div>
                    {user ? (
                        <>
                            <div>
                                <button>{user.name}</button>
                                <div>
                                    <Link to="/profile">Profile</Link>
                                    <button onClick={logoutHandler}>Logout</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to={`/login`}>Sign In</Link>
                            <Link to={`/register`}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
