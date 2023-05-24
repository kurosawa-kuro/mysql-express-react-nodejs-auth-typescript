// frontend\src\state\store.tsx

type UserStore = {
    user: any | null;
    setUser: (user: any) => void;
};

type FlashMessageStore = {
    flashMessage: string;
    setFlashMessage: (message: string) => void;
};

import { create } from 'zustand'

const useUserStore = create<UserStore>(set => {
    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) : null;

    return {
        user,
        setUser: (user: any) => {
            localStorage.setItem('user', JSON.stringify(user));
            set({ user });
        },
    };
});

const useFlashMessageStore = create<FlashMessageStore>(set => ({
    flashMessage: '',
    setFlashMessage: (message: string) => set({ flashMessage: message }),
}));



export { useUserStore, useFlashMessageStore }
