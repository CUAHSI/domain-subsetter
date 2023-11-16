import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
    const user = useStorage('user', {})
    const isLoggedIn = useStorage('isLoggedIn', false)

    let storeToken = useStorage('storeToken', {})

    async function login(token) {
        // update pinia state
        this.storeToken = token;
    }

    async function logout() {
        this.user = {}
        this.isLoggedIn = false;
        this.storeToken = {};
    }
  
    return { isLoggedIn, user, login, logout }
  })
