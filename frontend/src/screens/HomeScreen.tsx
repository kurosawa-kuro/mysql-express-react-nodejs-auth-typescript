// frontend\src\screens\HomeScreen.jsx

import React from 'react'
import { useFlashMessageHook } from '../hooks/useFlashMessageHook';

const HomeScreen: React.FC = () => {
    useFlashMessageHook();
    return (
        <div>
            HomeScreen
        </div>
    )
}

export default HomeScreen
