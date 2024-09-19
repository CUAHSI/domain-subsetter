<template>
  <v-overlay :model-value="!mapStore.mapLoaded" class="align-center justify-center">
    <v-progress-circular indeterminate :size="128"></v-progress-circular>
  </v-overlay>
  <v-container v-if="!mdAndDown" fluid>
    <v-row fill-height style="height: 87vh">
      <v-btn @click="toggleModelSelectDrawer" v-if="!showModelSelect" location="left" style="z-index: 9999"
        :style="{ transform: translateFilter(), position: 'absolute' }" color="primary">
        <v-icon :icon="mdiGlobeModel"></v-icon>
        <span v-if="modelsStore.selectedModel">{{ modelsStore.selectedModel.shortName }}</span>
        <span v-else>Select Model</span>
      </v-btn>
      <v-col v-if="showModelSelect" :cols="3">
        <ModelSelectDrawer @toggle="toggleModelSelectDrawer" />
        <SubmitButton />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col :cols="getCols">
        <TheLeafletMap />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row style="height: 40vh">
      <TheLeafletMap />
    </v-row>
    <v-row style="height: 50vh">
      <v-col>
        <ModelSelectDrawer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import SubmitButton from '../components/SubmitButton.vue';
import TheLeafletMap from '@/components/TheLeafletMap.vue';
import { useMapStore } from '@/stores/map';
import { useModelsStore } from '@/stores/models'
import { useDisplay } from 'vuetify'
import { mdiGlobeModel } from '@mdi/js'

const { mdAndDown } = useDisplay()
const mapStore = useMapStore()
const modelsStore = useModelsStore();

const showModelSelect = ref(false)

const toggleModelSelectDrawer = async () => {
  const center = mapStore.mapObject.map.getCenter()
  showModelSelect.value = !showModelSelect.value
  await nextTick()
  mapStore.leaflet.invalidateSize(true)
  mapStore.leaflet.setView(center)
}

const getCols = computed(() => {
  // if all drawers are open, the map should take up 7 columns
  let cols = 12
  if (showModelSelect.value) {
    cols -= 3
  }
  return cols
})

const translateFilter = () => {
  if (showModelSelect.value) {
    return 'translate(24vw, 0)'
  } else {
    return 'translate(0, 0)'
  }
}


</script>

<style scoped>
.drawer-handle {
  position: absolute;
  bottom: 30%;
  left: 110%;
}
</style>