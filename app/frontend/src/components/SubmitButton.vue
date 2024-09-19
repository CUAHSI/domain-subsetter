<template>
  <v-btn v-if="canSubmit" :prepend-icon="mdiSend" @click="submit" size="large" color="primary"
    class="drawer-handle">submit</v-btn>
  <v-card v-if="!canSubmit" color="primary" class="drawer-handle" max-width="300">
    <v-card-title>Submit once you:</v-card-title>
    <v-card-text>
      <div v-if="!authStore.isLoggedIn">Log in</div>
      <div v-if="modelsStore.selectedModel == null">Choose a model</div>
      <div v-if="!mapStore.hucsAreSelected">
        <span v-if="modelsStore.selectedModel?.input">Select {{ modelsStore.selectedModel.input }}</span>
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
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

const mapStore = useMapStore()
const authStore = useAuthStore()
const modelsStore = useModelsStore();
const alertStore = useAlertStore()

const { hucsAreSelected } = storeToRefs(mapStore);
const { selectedModel } = storeToRefs(modelsStore);

const Map = mapStore.mapObject

const canSubmit = computed(() => {
  if (!authStore.isLoggedIn) {
    return false
  }
  if (selectedModel.value == null) {
    return false
  }
  if (!hucsAreSelected.value) {
    return false
  }
  if (
    modelsStore.selectedModel.input == 'bbox' &&
    !mapStore.boxIsValid) {
    return false
  }
  return true
})

let bboxValid = computed(() => {
  return modelsStore.selectedModel?.input == 'bbox' && !mapStore.boxIsValid && mapStore.hucsAreSelected
})

function computeSubsetBbox() {
  /**
    * Compute the bounding box of the selected hucs
    * in the LCC projection used by the NWM
    * @returns {Array} [xmin, ymin, xmax, ymax]
    */
    
  let xmin = 999999999
  let ymin = 999999999
  let xmax = -999999999
  let ymax = -999999999
  for (let huc_id in Map.hucbounds) {
    let bounds = Map.hucbounds[huc_id].nwm_bbox
    if (bounds.minx < xmin) {
      xmin = bounds.minx
    }
    if (bounds.miny < ymin) {
      ymin = bounds.miny
    }
    if (bounds.maxx > xmax) {
      xmax = bounds.maxx
    }
    if (bounds.maxy > ymax) {
      ymax = bounds.maxy
    }
  }
  return [xmin, ymin, xmax, ymax]
}

async function submit() {
  const model = modelsStore.selectedModel
  if (model.input === "hucs") {
    const hucsArray = Map.selected_hucs
    await submitHucs(hucsArray, model.shortName)
  } else {
    // compute the bounding box of the selected hucs
    // in the LCC projection used by the NWM
    const bbox = computeSubsetBbox()
    await submitBbox(bbox, model.shortName)
  }
  const message = "Your selection was submitted for subsetting"
  alertStore.displayAlert({ title: "Submitted!", text: message, type: "success", closable: true, duration: 3 })
  
  router.push({ name: 'submissions' })
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
  console.log("starting subsetting using initial bbox", bbox)
  console.log("lowerLeft", lowerLeft)
  console.log("upperRight", upperRight)

  const params = `y_south=${ymin}&y_north=${ymax}&x_west=${xmax}&x_east=${xmin}`

  console.log("starting subsetting with bbox params:", params)

  fetchWrapper.post(`${ENDPOINTS.submit}/${model}?${params}`)
}
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  top: 167px;
  right: 0%;
  z-index: 9999;
}
</style>
