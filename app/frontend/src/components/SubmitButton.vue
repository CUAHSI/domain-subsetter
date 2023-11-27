<template>
  <v-btn @click="submit">submit</v-btn>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { useAuthStore } from '@/stores/auth'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const Map = mapStore.mapObject

const modelsStore = useModelsStore();
const authStore = useAuthStore();

function submit() {
  const model = modelsStore.selectedModel
  const hucsArray = Map.selected_hucs
  submitHucs(hucsArray, model.shortName)
}
async function submitHucs(selected_hucs, model) {
  selected_hucs = selected_hucs.map(a => a.hucid);
  const hucs = selected_hucs.join(",")

  const jwt = authStore.getToken()
  alert(`Submitting hucs: ${hucs} for ${model} subsetting`)
  const parResp = await fetch(`${ENDPOINTS.submit}/${model}?hucs=${hucs}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    }
  })
  const parJson = await parResp.json()
  alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}
</script>
