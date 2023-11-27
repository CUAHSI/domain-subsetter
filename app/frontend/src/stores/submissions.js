import { defineStore } from 'pinia'
import { ENDPOINTS } from '../constants'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();
const jwt = authStore.getToken()

export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref([])

  async function getSubmissions() {
    const submissionResp = await fetch(`${ENDPOINTS.submissions}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      }
    })
    const submissionsObj = await submissionResp.json()
    let submissions = submissionsObj.submissions
    this.submissions = submissions
  }
  return { submissions, getSubmissions}
})
