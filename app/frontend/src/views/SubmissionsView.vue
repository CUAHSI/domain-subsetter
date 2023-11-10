<template>
  <div>SUBMISSIONS</div>
    <v-card class="ma-10" v-for="submission in submissionStore.submissions" :key="submission.id" width="400">
      workflow_name: {{ submission.workflow_name }}
      workflow_id: {{ submission.workflow_id }}
      startedAt: {{ submission.startedAt }}
      estimatedDuration: {{submission.estimatedDuration }}
  </v-card>
  <v-container>
    <a href="https://workflows.argo.cuahsi.io/workflows">argo.cuahsi.io</a>
  </v-container>
</template>

<script setup>
import { useSubmissionsStore } from '@/stores/submissions'

const submissionStore = useSubmissionsStore();
submissionStore.getSubmissions()

</script>
