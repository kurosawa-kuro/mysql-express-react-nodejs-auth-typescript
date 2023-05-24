// frontend\src\components\Header.tsx

import React from 'react'
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link className="navbar-item" to={`/`}>MERN Auth</Link>
                </div>
                <div className="navbar-menu">
                    {/* {user ? ( */}
                    <>
                        <div className="navbar-dropdown">
                            <button className="navbar-item">user.name</button>
                            <div className="navbar-dropdown-menu">
                                <Link to="/profile" className="navbar-item">Profile</Link>
                                <button className="navbar-item">Logout</button>
                            </div>
                        </div>
                    </>
                    <br />
                    <>
                        <Link className="navbar-item" to={`/login`}>Sign In</Link>
                        <Link className="navbar-item" to={`/register`}>Sign Up</Link>
                    </>
                </div>
            </div>
        </header>
    );
}

export default Header
