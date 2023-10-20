import { defineStore } from 'pinia'

export const authStore = defineStore('auth', () => {
  async function login() {
    alert("auth still under development")
  }

  return { login }
})
