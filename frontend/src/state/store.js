// frontend\src\state\store.js

import { create } from 'zustand'

// User-related state
const useUserStore = create(set => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
}))

// Flash message related state
const useFlashMessageStore = create(set => ({
    flashMessage: '',
    setFlashMessage: (message) => set({ flashMessage: message }),
}))


export { useUserStore, useFlashMessageStore }
