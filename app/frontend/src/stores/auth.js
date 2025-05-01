import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const user = useStorage('user', {})
  const isLoggedIn = useStorage('isLoggedIn', false)

  const storeToken = useStorage('storeToken', {})

  async function login(token) {
    storeToken.value = token
  }

  async function logout() {
    user.value = {}
    isLoggedIn.value = false
    storeToken.value = {}
  }

  function getToken() {
    return storeToken.value.access_token
  }

  return { isLoggedIn, user, login, logout, getToken, storeToken }
})
