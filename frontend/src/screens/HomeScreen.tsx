import React from 'react'
import { useFlashMessageHook } from '../hooks/useFlashMessageHook';

const HomeScreen: React.FC = () => {
    useFlashMessageHook();
    return (
        <div className="mt-3 flex justify-center">
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md'>
                <h1 className='text-3xl font-bold mb-4 text-gray-900'>MERN Authentication</h1>
                <p className='text-gray-700'>
                    This is a boilerplate for MERN authentication that stores a JWT in
                    an HTTP-Only cookie. It also uses Redux Toolkit and the React library
                </p>
            </div>
        </div>
    );
}

export default HomeScreen
