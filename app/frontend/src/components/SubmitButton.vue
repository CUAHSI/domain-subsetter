<template>
  <v-btn @click="submit">submit</v-btn>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { ENDPOINTS } from '@/constants'
import { useMapStore } from '@/stores/map'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import proj4 from 'proj4'

const mapStore = useMapStore()
const Map = mapStore.mapObject

const modelsStore = useModelsStore();

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
  let [xmin, ymin, xmax, ymax] = bbox
  const lowerLeft = [xmin, ymin]
  // const upperLeft = [xmin, ymax]
  const upperRight = [xmax, ymax]
  // const lowerRight = [xmax, ymin]
  
  // https://github.com/derhuerst/transform-coordinates
  // import transformation from 'transform-coordinates'
  // const transformation = require('transform-coordinates')
  // https://epsg.io/3082
  // const transform = transformation('EPSG:4326', '3082') // WGS 84 to LCC
  
  // var secondProjection = '+proj=lcc +lat_1=20 +lat_2=60 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs';
  let secondProjection = '+proj=lcc +lat_1=30 +lat_2=60 +lat_0=40.0000076293945 +lon_0=-97 +x_0=0 +y_0=0 +a=6370000 +b=6370000 +units=m +no_defs'
  
  const lccLowerLeft = proj4(secondProjection, lowerLeft)
  // const lccUpperLeft = proj4(secondProjection, upperLeft)
  const lccUpperRight = proj4(secondProjection, upperRight)
  // const lccLowerRight = proj4(secondProjection, lowerRight)

  ymin = lccLowerLeft[1]
  xmin = lccLowerLeft[0]
  xmax = lccUpperRight[0]
  ymax = lccUpperRight[1]

  const params = `y_south=${ymin}&y_north=${ymax}&x_west=${xmin}&x_east=${xmax}`
  alert(`Submitting bbox: ${bbox} for ${model} subsetting`)

  const parJson = await fetchWrapper.post(`${ENDPOINTS.submit}/${model}?${params}`)
  alert(`Submitted ${parJson.workflow_name} workflow. Workflow_id: ${parJson.workflow_id}`)
}
</script>
