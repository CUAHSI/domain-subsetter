import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ENDPOINTS } from '../constants'

export const useSubmissionsStore = defineStore({
  id: 'submissions',
  state: () => ({
    submissions: useStorage('submissions', [])
  }),
  actions: {
    async updateSubmissions() {
      const submissionResp = await fetch(`${ENDPOINTS.submissions}`, {
        credentials: 'include',
        mode: 'cors'
      })
      const submissionsObj = await submissionResp.json()
      const submissions = submissionsObj.submissions
      console.log(submissions)
      this.submissions = submissions
    }
  }
})
