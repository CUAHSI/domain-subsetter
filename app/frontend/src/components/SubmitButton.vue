<template>
  <v-btn @click="submit">submit</v-btn>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
const Map = mapStore.mapObject

const modelsStore = useModelsStore();

function submit() {
  const model = modelsStore.selectedModel
  const hucsArray = Map.selected_hucs
  submitHucs(hucsArray, model.shortName)
  modelsStore.selectedModel
}
async function submitHucs(selected_hucs, model) {
  selected_hucs = selected_hucs.map(a => a.hucid);
  console.log(selected_hucs)
  const hucs = selected_hucs.join(",")
  
  alert(`Submitting hucs: ${hucs} for ${model} subsetting`)
    const parResp = await fetch(`${ENDPOINTS.submit}/${model}?hucs=${hucs}`, {
        method: "POST",
        credentials: 'include',
        mode: 'cors'
    })
    const parJson = await parResp.json()
    alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}
</script>
