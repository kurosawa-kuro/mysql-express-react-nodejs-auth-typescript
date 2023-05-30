import { create } from 'zustand'
import { UserWithoutPassword } from '../services/api';

interface UserStore {
    user: UserWithoutPassword | null;
    setUser: (user: UserWithoutPassword | null) => void;
};

interface FlashMessageStore {
    flashMessage: string | null;
    setFlashMessage: (message: string | null) => void;
};

const useUserStore = create<UserStore>(set => {
    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) as UserWithoutPassword : null;

    return {
        user,
        setUser: (user: UserWithoutPassword | null) => {
            if (user !== null) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
            set({ user });
        },
    };
});

const useFlashMessageStore = create<FlashMessageStore>(set => ({
    flashMessage: '',
    setFlashMessage: (message: string | null) => set({ flashMessage: message }),
}));

export { useUserStore, useFlashMessageStore }
