<template>
  <v-btn v-if="canSubmit" :prepend-icon="mdiSend" @click="submit" size="large" color="primary"
    class="drawer-handle">submit</v-btn>
  <v-card v-if="!canSubmit" color="primary" class="drawer-handle" max-width="300">
    <v-card-title>Submit once you:</v-card-title>
    <v-card-text>
      <div v-if="!authStore.isLoggedIn">Log in</div>
      <div v-if="modelsStore.selectedModel == null">Choose a model</div>
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
import proj4 from 'proj4'
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
  let [xmin, ymin, xmax, ymax] = bbox
  const lowerLeft = [xmin, ymin]
  const upperRight = [xmax, ymax]

  let firstProjection = proj4('EPSG:3857')
  let secondProjection = '+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs'

  const lccLowerLeft = proj4(firstProjection, secondProjection, lowerLeft)
  const lccUpperRight = proj4(firstProjection, secondProjection, upperRight)

  ymin = lccLowerLeft[1]
  xmin = lccLowerLeft[0]
  xmax = lccUpperRight[0]
  ymax = lccUpperRight[1]

  const params = `y_south=${ymin}&y_north=${ymax}&x_west=${xmax}&x_east=${xmin}`

  fetchWrapper.post(`${ENDPOINTS.submit}/${model}?${params}`)
}
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  top: 15%;
  right: 0%;
  z-index: 9999;
}
</style>