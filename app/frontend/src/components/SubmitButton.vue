<template>
  <v-btn v-if="canSubmit" :prepend-icon="mdiSend" @click="submit">submit</v-btn>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import { mdiSend } from '@mdi/js'
import { computed } from 'vue';

const mapStore = useMapStore()
const Map = mapStore.mapObject

const modelsStore = useModelsStore();

let canSubmit = computed(() => {
  return mapStore.hucsAreSelected && modelsStore.selectedModel.value != null
})

function submit() {
  const model = modelsStore.selectedModel
  if (model.input === "hucs") {
    const hucsArray = Map.selected_hucs
    submitHucs(hucsArray, model.shortName)
  } else {
    const bbox = Map.bbox
    submitBbox(bbox, model.shortName)
  }
}
async function submitHucs(selected_hucs, model) {
  selected_hucs = selected_hucs.map(a => a.hucid);
  const hucs = selected_hucs.join(",")

  alert(`Submitting hucs: ${hucs} for ${model} subsetting`)

  const parJson = await fetchWrapper.post(`${ENDPOINTS.submit}/${model}?hucs=${hucs}`)
  alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}

async function submitBbox(bbox, model) {
  const [xmin, ymin, xmax, ymax] = bbox
  const params = `y_south=${ymin}&y_north=${ymax}&x_west=${xmin}&x_east=${xmax}`
  alert(`Submitting bbox: ${bbox} for ${model} subsetting`)

  const parJson = await fetchWrapper.post(`${ENDPOINTS.submit}/${model}?${params}`)
  alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}
</script>
