import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'

export const useModelsStore = defineStore('auth', () => {
    const user = useStorage('user', {})
    // const returnUrl = null
    const isLoggedIn = useStorage('isLoggedIn', false)

    async function login(loginUser) {
        this.isLoggedIn = true;
        this.user = loginUser;
    }

    async function logout() {
        this.isLoggedIn = false;
        this.user = {};
    }
  
    return { isLoggedIn, user, login, logout }
  })