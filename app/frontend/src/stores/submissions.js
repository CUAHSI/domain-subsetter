import { defineStore } from 'pinia'
import { ENDPOINTS } from '../constants'
import { ref } from 'vue'
import { fetchWrapper } from '@/_helpers/fetchWrapper';


export const useSubmissionsStore = defineStore('submissions', () => {
  const submissions = ref([])

  async function getSubmissions() {
    const response = await fetchWrapper.get(`${ENDPOINTS.submissions}`)
    const submissionsObj = await response.unpacked
    let submissions = submissionsObj.submissions
    this.submissions = submissions
  }

  async function refreshWorkflows() {
    let response = await fetchWrapper.get(`${ENDPOINTS.refresh}`)
    const running_submissions = await response.unpacked
    console.log("running submissions:", running_submissions)
    // now update the submissions in the store
    for (let i = 0; i < running_submissions.length; i++) {
      const submission = running_submissions[i]
      const objIndex = this.submissions.findIndex(s => s.workflow_id === submission.workflow_id);
      if (objIndex > -1) {
        this.submissions[objIndex]=submission;
      }
    }
  }

  async function refreshSubmission (submission) {
    const refreshEndpoint = ENDPOINTS.refresh
    const refreshUrl = `${refreshEndpoint}/${submission.workflow_id}`
    const response = await fetchWrapper.get(refreshUrl)
    const json = await response.unpacked
    const objIndex = this.submissions.findIndex(s => s.workflow_id === submission.workflow_id);
    if (objIndex > -1) {
      this.submissions[objIndex]=json;
    }
  }

  return { submissions, getSubmissions, refreshWorkflows, refreshSubmission}
})
