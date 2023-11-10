import { defineStore } from 'pinia'
import { ENDPOINTS } from '../constants'
import { ref } from 'vue'

export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref([])

  async function getSubmissions() {
    const submissionResp = await fetch(`${ENDPOINTS.submissions}`, {
      credentials: 'include',
      mode: 'cors'
    })
    const submissionsObj = await submissionResp.json()
    let submissions = submissionsObj.submissions
    this.submissions = submissions
  }
  return { submissions, getSubmissions}
})
