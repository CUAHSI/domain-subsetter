import { defineStore } from 'pinia'
import { ENDPOINTS } from '../constants'
import { ref } from 'vue'
import { fetchWrapper } from '@/_helpers/fetchWrapper';


export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref([])

  async function getSubmissions() {
    const submissionsObj = await fetchWrapper.get(`${ENDPOINTS.submissions}`)
    let submissions = submissionsObj.submissions
    this.submissions = submissions
  }

  async function refreshWorkflows() {
    return fetchWrapper.get(`${ENDPOINTS.refresh}`)
  }

  return { submissions, getSubmissions, refreshWorkflows}
})
