import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '../state/store';
import { logoutUserApi } from '../services/api';

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserStore();
    const [showDropdown, setShowDropdown] = useState(false);

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
        <header className="flex items-center justify-between p-5 bg-blue-500 text-white">
            <div>
                <Link to={`/`} className="text-white font-bold">MERN Auth</Link>
            </div>
            <div>
                {user ? (
                    <div className="relative">
                        <button className="focus:outline-none" onClick={() => setShowDropdown(!showDropdown)}>{user.name}</button>
                        {showDropdown &&
                            <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded p-2">
                                <Link to="/profile" className="block py-1 px-2 hover:bg-blue-500 hover:text-white">Profile</Link>
                                <button onClick={logoutHandler} className="block w-full text-left py-1 px-2 hover:bg-blue-500 hover:text-white">Logout</button>
                            </div>
                        }
                    </div>
                ) : (
                    <div>
                        <Link to={`/login`} className="mr-4 text-white hover:underline">Log in</Link>
                        <Link to={`/register`} className="text-white hover:underline">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
