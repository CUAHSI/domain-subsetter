<template>
  <v-btn v-if="canSubmit" :prepend-icon="mdiSend" @click="submit" size="large" color="primary"
    class="drawer-handle">submit</v-btn>
  <v-card v-if="!canSubmit" color="primary" class="drawer-handle" max-width="300">
    <v-card-title>Submit once you:</v-card-title>
    <v-card-text>
      <div v-if="!authStore.isLoggedIn">Log in</div>
      <div v-if="modelsStore.selectedModel.value == null">Choose a model</div>
      <div v-if="!mapStore.hucsAreSelected">
        <span v-if="modelsStore.selectedModel.input">Select {{ modelsStore.selectedModel.input }}</span>
        <span v-else>Select subset bounds</span>
      </div>
      <div v-if="bboxValid">Revise bounding box</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { useAuthStore } from '../stores/auth';
import { useAlertStore } from '../stores/alerts'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import { mdiSend } from '@mdi/js'
import { computed } from 'vue';

const mapStore = useMapStore()
const authStore = useAuthStore()
const modelsStore = useModelsStore();
const alertStore = useAlertStore()

const Map = mapStore.mapObject

let canSubmit = computed(() => {
  if (
    modelsStore.selectedModel.input == 'bbox' &&
    !mapStore.boxIsValid &&
    mapStore.hucsAreSelected) {
    return false
  }
  return mapStore.hucsAreSelected && modelsStore.selectedModel.value != null && authStore.isLoggedIn
})

let bboxValid = computed(() => {
  return modelsStore.selectedModel.input == 'bbox' && !mapStore.boxIsValid && mapStore.hucsAreSelected
})

async function submit() {
  const model = modelsStore.selectedModel
  if (model.input === "hucs") {
    const hucsArray = Map.selected_hucs
    await submitHucs(hucsArray, model.shortName)
  } else {
    const bbox = Map.bbox
    await submitBbox(bbox, model.shortName)
  }
  const message = "Your selection was submitted for subsetting"
  alertStore.displayAlert({ title: "Submitted!", text: message, type: "success", closable: true, duration: 3 })
}
async function submitHucs(selected_hucs, model) {
  selected_hucs = selected_hucs.map(a => a.hucid);
  const hucs = selected_hucs.join(",")
  fetchWrapper.post(`${ENDPOINTS.submit}/${model}?hucs=${hucs}`)
}

async function submitBbox(bbox, model) {
  const [xmin, ymin, xmax, ymax] = bbox
  const params = `y_south=${ymin}&y_north=${ymax}&x_west=${xmin}&x_east=${xmax}`

  fetchWrapper.post(`${ENDPOINTS.submit}/${model}?${params}`)
}
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  bottom: 30%;
  right: 0%;
  z-index: 9999;
}
</style>