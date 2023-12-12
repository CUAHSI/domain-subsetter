<template>
  <h2 class="ma-2 text-center">Submissions</h2>
  <v-container>
    <v-row align="center" justify="center">
      <v-col v-for="(submission, i) in submissionStore.submissions" :key="i" cols="auto">
        <v-card class="mx-auto" variant="elevated">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">
                {{ variant }}
              </div>
              <v-card-title> {{ submission.workflow_name }}</v-card-title>
              <v-card-subtitle>{{ submission.workflow_id }}</v-card-subtitle>
            </div>
          </v-card-item>

          <v-card-text>
            <div>Submitted: {{ submission.startedAt }}</div>
            <div>Estimated Duration: {{ submission.estimatedDuration }}</div>
            <div>Status: {{ submission.phase }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn v-if="submission.phase == 'Succeeded'"><a @click="downloadArtifact(submission)">Download</a></v-btn>
            <v-btn><a @click="refreshSubmission(submission)">Refresh</a></v-btn>
            <v-btn><a @click="showArgo(submission)">Argo Metadata</a></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-container v-if="submissionStore.submissions.length == 0">
      <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
        <span v-if="!authStore.isLoggedIn">Please login to view your submissions.</span>
        <span v-else>
          You don't have any submissions yet.
          Use the <router-link :to="{ path: `/` }">Subsetter Map</router-link> to create a submission.
        </span>
      </v-sheet>
    </v-container>

  </v-container>
</template>

<script setup>
import { useSubmissionsStore } from '@/stores/submissions'
import { ENDPOINTS } from '@/constants'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const submissionStore = useSubmissionsStore();
submissionStore.refreshWorkflows()
submissionStore.getSubmissions()

async function downloadArtifact(submission) {
  const downloadEndpoint = ENDPOINTS.download
  const downloadUrl = `${downloadEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(downloadUrl)
  const link = document.createElement('a')
  link.href = response.url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
}

async function showLogs(submission) {
  const logsEndpoint = ENDPOINTS.logs
  const logsUrl = `${logsEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(logsUrl)
  console.log(response)
}

async function showArgo(submission) {
  const argoEndpoint = ENDPOINTS.argo
  const argoUrl = `${argoEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(argoUrl)
  alert(JSON.stringify(response))
}

async function refreshSubmission(submission) {
  submissionStore.refreshSubmission(submission)
}

</script>
