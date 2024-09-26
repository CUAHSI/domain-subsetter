<template>
  <h2 class="ma-2 text-center">Submissions</h2>
  <v-container v-if="refreshing || submissions.length > 0">
    <v-data-table :headers="headers" :items="submissions" :sort-by="sortBy">
      <template v-slot:item.phase="{ value }">
        <v-chip :color="getColor(value)">
          {{ getChipValue(value) }}
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-space-between">
          <v-btn :icon="mdiRefresh" size="small" @click="refreshSubmission(item)" :loading="refreshingItem == item" />
          <v-btn><a @click="showArgo(item)">Metadata</a></v-btn>
          <v-btn :icon="mdiDownload" size="small" v-if="item?.phase == 'Succeeded'"
            @click="downloadArtifact(item)"></v-btn>
          <v-btn :icon="mdiNoteSearch" size="small" @click="showLogs(item)"></v-btn>
        </div>
      </template>
    </v-data-table>
    <v-progress-linear v-show="refreshing" indeterminate color="primary"></v-progress-linear>
  </v-container>

  <v-container v-if="!refreshing && submissions.length == 0">
    <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
      <span v-if="!authStore.isLoggedIn">Please login to view your submissions.</span>
      <span v-else>
        You don't have any submissions yet.
        Use the <router-link :to="{ path: `/` }">Subsetter Map</router-link> to create a submission.
      </span>
    </v-sheet>
  </v-container>

  <v-bottom-sheet v-model="showingLogs" inset>
    <v-card height="100%">
      <v-btn class="ml-auto" @click="showingLogs = false">
        close
      </v-btn>
      <v-card-title>
        <v-card class="pa-4">
          Submission <strong>{{ selectedSubmission.workflow_id }}</strong>
          <v-spacer></v-spacer>
          Model: {{ selectedSubmission.workflow_name }}
          <v-spacer></v-spacer>
          Phase: <v-chip :color="getColor(selectedSubmission.phase)">
            {{ getChipValue(selectedSubmission.phase) }}
          </v-chip>
          <v-spacer></v-spacer>
          Started: {{ selectedSubmission.startedAt }}
        </v-card>
      </v-card-title>

      <v-card-text>
        <v-data-table :headers="logsHeaders" :items="logsArray">
          <template v-slot:item.time="{ value }">
            <v-chip>{{ value }}</v-chip>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>
  </v-bottom-sheet>

  <v-bottom-sheet v-model="showingMetadata" inset>
    <v-card height="100%">
      <v-btn class="ml-auto" @click="showingMetadata = false">
        close
      </v-btn>
      <!-- show all of the key/value pairs of the metadataObject -->
      <v-card-text>
        <strong>Metadata</strong>
        <v-data-table :headers="Object.keys(metadataObject.metadata)" :items="[metadataObject.metadata]">
          <template v-slot:item="{ item }">
            <tr v-for="(value, key) in item" v-bind:key="key">
              <td>{{ key }}</td>
              <td>{{ value }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-text>
        <strong>Status</strong>
        <!-- pretty format the metadataObject.status json and show it  -->
        <pre>{{ JSON.stringify(metadataObject.status, null, 2) }}</pre>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { mdiRefresh, mdiDownload, mdiNoteSearch } from '@mdi/js'

const authStore = useAuthStore();
const submissionStore = useSubmissionsStore();

const REFRESH_INTERVAL = 5000 // 5 second
let interval = null

let logsArray = ref(null)
let showingLogs = ref(false)
let showingMetadata = ref(false)
let selectedSubmission = ref({})
let metadataObject = ref(null)

let refreshingItem = ref({})
let refreshing = ref(true)

const { submissions } = storeToRefs(submissionStore)

onMounted(async () => {
  if (authStore.isLoggedIn) {
    refreshAllSubmissions()
  // set a timer to refresh the submissions every REFRESH_INTERVAL milliseconds
  interval = setInterval(refreshPendingSubmissions, REFRESH_INTERVAL)
  }else{
    refreshing.value = false
  }
})

onUnmounted(() => {
  // clear the interval when the component is unmounted
  clearInterval(interval)
})

function getColor(phase) {
  if (phase === 'Succeeded') return 'green'
  else if (phase === 'Failed') return 'red'
  else return 'orange'
}

function getChipValue(phase) {
  // if phase null, return 'Pending'
  return phase || 'Pending'
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
const sortBy = computed(() => {
  // if there are pending submissions, show those first
  // otherwise, show the most recent submissions first
  if (submissions.value.some(sub => sub.phase === null)) {
    return [{ key: 'phase', order: 'asc' }, { key: 'startedAt', order: 'desc' }]
  }
  return [{ key: 'startedAt', order: 'desc' }]
})

async function downloadArtifact(submission) {
  const downloadEndpoint = ENDPOINTS.download
  const downloadUrl = `${downloadEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(downloadUrl)
  const json = await response.unpacked
  const link = document.createElement('a')
  link.href = json.url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
}

async function showLogs(submission) {
  const logsEndpoint = ENDPOINTS.logs
  const logsUrl = `${logsEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(logsUrl)
  const rawArgoLogs = await response.unpacked
  logsArray.value = parseArgoLogs(rawArgoLogs)
  selectedSubmission.value = submission
  showingLogs.value = true
}

function parseArgoLogs(rawArgoLogs) {
  const logsString = rawArgoLogs.logs;
  let logsArray = logsString.split('time=');

  // get rid of everything before the first 'time='
  logsArray.shift()

  const logs = logsArray.map(logString => {
    // because we split on 'time=', the first key of every array element will be empty so it will have to be set to 'time'
    logString = 'time=' + logString
    console.log(logString)
    const logObject = {}

    // split the log string by assuming that every key is the non-white space characters before the '=' and the value is all characters untill the next key
    // also '==='' (triple equals) is not considered as a key-value pair separator
    // also an equals with a space before or after is not considered as a key-value pair separator
    const logParts = logString.split(/(\S+)=(?!\s|=|:)/)
    for (let i = 1; i < logParts.length; i += 2) {
      const key = logParts[i]
      // trim whitespace from the value and remove double quotes
      const value = logParts[i + 1].trim().replace(/^"/, '').replace(/"$/, '')
      logObject[key] = value
    }
    return logObject
  })
  console.log(logs)
  return logs
}

const logsHeaders = [
  { title: 'Time', key: 'time' },
  { title: 'Message', key: 'msg' },
]

async function showArgo(submission) {
  const argoEndpoint = ENDPOINTS.argo
  const argoUrl = `${argoEndpoint}/${submission.workflow_id}`
  const response = await fetchWrapper.get(argoUrl)
  const metadata = await response.unpacked
  metadataObject.value = metadata
  showingMetadata.value = true
}

async function refreshSubmission(submission) {
  refreshingItem.value = submission
  await submissionStore.refreshSubmission(submission)
  refreshingItem.value = {}
}

async function refreshAllSubmissions() {
  refreshing.value = true
  await submissionStore.refreshWorkflows()
  await submissionStore.getSubmissions()
  refreshing.value = false
}

async function refreshPendingSubmissions() {
  refreshing.value = true
  const pending = submissions.value.filter(sub => {
    return sub.phase === null || sub.phase === 'Running'
  })
  for (const sub of pending) {
    await refreshSubmission(sub)
  }
  refreshing.value = false
}

</script>
