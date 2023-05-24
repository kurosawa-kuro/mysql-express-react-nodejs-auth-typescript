// frontend\src\hooks\useFlashMessage.js

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFlashMessageStore } from '../state/store.js';

export const useFlashMessageHook = () => {
    const { flashMessage, setFlashMessage } = useFlashMessageStore();

    useEffect(() => {
        if (flashMessage) {
            toast.success(flashMessage);
            setFlashMessage(null);
        }
    }, [flashMessage, setFlashMessage]);

    return { flashMessage, setFlashMessage };
};


