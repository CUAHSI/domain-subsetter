<template>
  <v-btn @click="submit">submit</v-btn>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'
import { fetchWrapper } from '@/_helpers/fetchWrapper';

const mapStore = useMapStore()
const Map = mapStore.mapObject

const modelsStore = useModelsStore();

function submit() {
  const model = modelsStore.selectedModel
  const hucsArray = Map.selected_hucs
  submitHucs(hucsArray, model.shortName)
}
async function submitHucs(selected_hucs, model) {
  selected_hucs = selected_hucs.map(a => a.hucid);
  const hucs = selected_hucs.join(",")

  alert(`Submitting hucs: ${hucs} for ${model} subsetting`)

  const parJson = await fetchWrapper.post(`${ENDPOINTS.submit}/${model}?hucs=${hucs}`)
  alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}
</script>
