import { create } from 'zustand'

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
};

interface FlashMessageStore {
    flashMessage: string | null;
    setFlashMessage: (message: string | null) => void;
};

const useUserStore = create<UserStore>(set => {
    const userItem = localStorage.getItem('user');
    const user = userItem ? JSON.parse(userItem) as User : null;

    return {
        user,
        setUser: (user: User | null) => {
            localStorage.setItem('user', JSON.stringify(user));
            set({ user });
        },
    };
});

const useFlashMessageStore = create<FlashMessageStore>(set => ({
    flashMessage: '',
    setFlashMessage: (message: string | null) => set({ flashMessage: message }),
}));

export { useUserStore, useFlashMessageStore }
