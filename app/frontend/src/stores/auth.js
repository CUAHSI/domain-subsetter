import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: useStorage('user', {}),
        returnUrl: null,
        isLoggedIn: useStorage('isLoggedIn', false)
    }),
    actions: {
        async login(loginUser) {
            this.isLoggedIn = true;
            this.user = loginUser;
        },
        async logout() {
            this.isLoggedIn = false;
            this.user = {};
        }
    }
});