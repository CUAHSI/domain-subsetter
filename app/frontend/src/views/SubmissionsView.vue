<template>
  <div>SUBMISSIONS</div>
    <v-card class="ma-10" v-for="submission in submissionStore.submissions" :key="submission.id" width="400">
      <div>workflow_name: {{ submission.workflow_name }}</div>
      <div>workflow_id: {{ submission.workflow_id }}</div>
      <div>startedAt: {{ submission.startedAt }}</div>
      <div>estimatedDuration: {{submission.estimatedDuration }}</div>
      <div>phase: {{ submission.phase }}</div>
      <v-btn v-if="submission.phase == 'Succeeded'"><a @click="downloadArtifact(submission)" target="_blank">Download</a></v-btn>
      <v-btn><a :href="`${refreshEndpoint}/${submission.workflow_id}`" target="_blank">Refresh</a></v-btn>
  </v-card>
  <v-container>
    <a href="https://workflows.argo.cuahsi.io/workflows">argo.cuahsi.io</a>
  </v-container>
</template>

<script setup>
import { useSubmissionsStore } from '@/stores/submissions'
import { ENDPOINTS } from '@/constants'
import { fetchWrapper } from '@/_helpers/fetchWrapper';

const downloadEndpoint = ENDPOINTS.download
const refreshEndpoint = ENDPOINTS.refresh
const submissionStore = useSubmissionsStore();
submissionStore.refreshWorkflows()
submissionStore.getSubmissions()

async function downloadArtifact(submission){
  const downloadUrl = `${downloadEndpoint}/${submission.workflow_id}`
  let response = await fetchWrapper.get(downloadUrl)
  const link = document.createElement('a')
  link.href = response.url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
}

</script>
