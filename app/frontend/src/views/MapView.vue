<template>
  <v-overlay :model-value="!mapStore.mapLoaded" class="align-center justify-center">
    <v-progress-circular indeterminate :size="128"></v-progress-circular>
  </v-overlay>
  <v-container v-if="!mdAndDown" fluid>
    <v-row fill-height style="height: calc(100vh - 165px)">
      <v-col v-if="showModelSelect || showDomainSelect" :cols="3" class="pa-0">
        <ModelSelectDrawer v-if="showModelSelect" @toggle="toggleModelSelectDrawer" />
        <DomainSelectDrawer v-if="showDomainSelect" @toggle="toggleDomainSelectDrawer" />
      </v-col>
      <v-divider v-if="showModelSelect || showDomainSelect" vertical></v-divider>
      <v-col :cols="getCols" class="pa-0">
        <TheLeafletMap />
      </v-col>
      <v-divider v-if="showDomainSelect" vertical></v-divider>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row style="height: 40vh">
      <TheLeafletMap />
    </v-row>
    <v-row style="height: 50vh">
      <v-col>
        <ModelSelectDrawer />
        <DomainSelectDrawer />
      </v-col>
    </v-row>
  </v-container>
  <v-card v-show="!showModelSelect && !showDomainSelect" location="left" :style="getCardStyle()" class="v-flex pa-2"
    max-width="300" color="surface-variant" max-height="145">
    <v-btn @click="toggleModelSelectDrawer" v-if="!showModelSelect"
      :color="!modelsStore.selectedModel ? 'primary' : 'secondary'" width="100%" class="mb-2">
      <v-icon class="ma-1"
        :icon="modelsStore.selectedModel ? mdiCheckCircleOutline : mdiNumeric1CircleOutline"></v-icon>
      <span v-if="modelsStore.selectedModel">{{ modelsStore.selectedModel.shortName }}</span>
      <span v-else>Select Data</span>
    </v-btn>
    <v-btn @click="toggleDomainSelectDrawer" :color="!hucsAreSelected ? 'primary' : 'secondary'" width="100%"
      class="mb-2">
      <v-icon class="ma-1" :icon="hucsAreSelected ? mdiCheckCircleOutline : mdiNumeric2CircleOutline"></v-icon>
      <span v-if="!domainStore.selectedDomain">Define Domain</span>
      <span v-else>{{ selectedDomain.name }}</span>
    </v-btn>
    <SubmitButton />
  </v-card>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import DomainSelectDrawer from '../components/DomainSelectDrawer.vue';
import SubmitButton from '../components/SubmitButton.vue';
import TheLeafletMap from '@/components/TheLeafletMap.vue';
import { useMapStore } from '@/stores/map';
import { useModelsStore } from '@/stores/models'
import { useDomainsStore } from '@/stores/domains'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { mdiNumeric1CircleOutline, mdiNumeric2CircleOutline, mdiCheckCircleOutline } from '@mdi/js'

const { mdAndDown } = useDisplay()
const mapStore = useMapStore()
const modelsStore = useModelsStore();
const domainStore = useDomainsStore();

const showModelSelect = ref(false)
const showDomainSelect = ref(false)

const { selectedDomain, hucsAreSelected } = storeToRefs(domainStore);

const toggleModelSelectDrawer = async () => {
  const center = mapStore.mapObject.map.getCenter()
  showModelSelect.value = !showModelSelect.value
  await nextTick()
  mapStore.mapObject.map.invalidateSize(true)
  mapStore.mapObject.map.setView(center)
}

const toggleDomainSelectDrawer = async () => {
  const center = mapStore.mapObject.map.getCenter()
  showDomainSelect.value = !showDomainSelect.value
  await nextTick()
  mapStore.mapObject.map.invalidateSize(true)
  mapStore.mapObject.map.setView(center)
}

const getCols = computed(() => {
  // if all drawers are open, the map should take up 7 columns
  let cols = 12
  if (showModelSelect.value) {
    cols -= 3
  }
  if (showDomainSelect.value) {
    cols -= 3
  }
  return cols
})

const translateFilter = () => {
  if (showModelSelect.value || showDomainSelect.value) {
    return 'translate(24vw, 20vh)'
  } else {
    return 'translate(0, 20vh)'
  }
}

const getCardStyle = () => {
  if (!mdAndDown.value) {
    return { transform: translateFilter(), position: 'absolute', 'z-index': '9999' }
  }
  return {
    position: 'absolute',
    'z-index': '9999',
    'top': '35vh',
    'left': '5vw',
    'width': '100%',
    'padding': '0',
    'margin': '0'
  }
}


</script>