<template>
  <h2 class="ma-2 text-center">Submissions</h2>
  <v-container v-if="submissionStore.submissions.length > 0">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab :value="1">Table View</v-tab>
      <v-tab :value="2">Cluster View</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1" :key="1">
        <v-data-table :headers="headers" :items="submissionStore.submissions" :sort-by="sortBy">
          <template v-slot:item.phase="{ value }">
            <v-chip :color="getColor(value)">
              {{ value }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn :icon="mdiRefresh" size="small" @click="refreshSubmission(item)" :loading="refreshing == item" />
            <v-btn><a @click="showArgo(item)">Metadata</a></v-btn>
            <v-btn :icon="mdiDownload" size="small" v-if="item?.phase == 'Succeeded'"
              @click="downloadArtifact(item)"></v-btn>
            <v-btn :icon="mdiNoteSearch" size="small" @click="showLogs(item)"></v-btn>
          </template>

        </v-data-table>
      </v-window-item>
      <v-window-item :value="2" :key="2">
        <v-row align="center" justify="center">
          <v-col v-for="(submission, i) in submissionStore.submissions" :key="i" cols="auto">
            <v-card class="mx-auto" variant="elevated" outlined>
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
                <div>Status:
                  <v-chip :color="getColor(submission.phase)">
                    {{ submission.phase }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn v-if="submission.phase == 'Succeeded'"><a
                    @click="downloadArtifact(submission)">Download</a></v-btn>
                <v-btn><a @click="refreshSubmission(submission)">Refresh</a></v-btn>
                <v-btn><a @click="showArgo(submission)">Argo Metadata</a></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>

  <v-container v-if="submissionStore.submissions.length == 0">
    <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
      <span v-if="!authStore.isLoggedIn">Please login to view your submissions.</span>
      <span v-else>
        You don't have any submissions yet.
        Use the <router-link :to="{ path: `/` }">Subsetter Map</router-link> to create a submission.
      </span>
    </v-sheet>
  </v-container>

    <v-bottom-sheet v-model="sheetText" inset>
      <v-card class="text-center" height="100%">
        <v-card-text>
          <v-btn @click="sheetText = null">
            close
          </v-btn>

          <br>
          <br>

          <div>
            {{ sheetText }}
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
</template>

<script setup>
import { useSubmissionsStore } from '@/stores/submissions'
import { ENDPOINTS } from '@/constants'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import { mdiRefresh, mdiDownload, mdiNoteSearch } from '@mdi/js'

const authStore = useAuthStore();
const submissionStore = useSubmissionsStore();
submissionStore.refreshWorkflows()
submissionStore.getSubmissions()

let sheetText = ref(null)

let tab = ref(1)
let refreshing = ref({})

function getColor(phase) {
  if (phase === 'Succeeded') return 'green'
  else if (phase === 'Failed') return 'red'
  else return 'orange'
}

const headers = [
  { title: 'ID', key: 'workflow_id' },
  { title: 'Model', key: 'workflow_name' },
  { title: 'Status', key: 'phase' },
  { title: 'Started', key: 'startedAt' },
  { title: 'Finished', key: 'finishedAt' },
  { title: 'Estimated time', key: 'estimatedDuration' },
  { title: 'Actions', key: 'actions', sortable: false },
]
const sortBy = [{ key: 'startedAt', order: 'desc' }]

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
  sheetText.value = JSON.stringify(response)
}

async function showArgo(submission) {
  const argoEndpoint = ENDPOINTS.argo
  const argoUrl = `${argoEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(argoUrl)
  console.log(JSON.stringify(response))
  sheetText.value = JSON.stringify(response)
}

async function refreshSubmission(submission) {
  refreshing.value = submission
  await submissionStore.refreshSubmission(submission)
  refreshing.value = {}
}

</script>
