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

  async function refreshSubmission (submission) {
    const refreshEndpoint = ENDPOINTS.refresh
    const refreshUrl = `${refreshEndpoint}/${submission.workflow_id}`
    const response = await fetchWrapper.get(refreshUrl)
    const objIndex = this.submissions.findIndex(s => s.workflow_id === submission.workflow_id);
    if (objIndex > -1) {
      this.submissions[objIndex]=response;
    }
  }

  return { submissions, getSubmissions, refreshWorkflows, refreshSubmission}
})
