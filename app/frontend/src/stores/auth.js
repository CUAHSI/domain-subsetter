import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
        isLoggedIn: false
    }),
    actions: {
        async login(user) {
            // update pinia state
            this.user = user;
            this.isLoggedIn = true;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            // TODO: use https://github.com/prazdevs/pinia-plugin-persistedstate
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout() {
            this.user = null;
            this.isLoggedIn = false;
            localStorage.removeItem('user');
        }
    }
});