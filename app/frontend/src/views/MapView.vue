<template>
  <ModelSelectDrawer :models="models" :show="showModelSelect" @toggle="showModelSelect = !showModelSelect"/>
  <TheLeafletMap></TheLeafletMap>
</template>
<script setup>
import { ref } from 'vue'
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import TheLeafletMap from '../components/TheLeafletMap.vue';
const showModelSelect = ref(true)

const models = [
  {
    id: 0,
    name: "National Water Model",
    description: "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
  },
  {
    id: 1,
    name: "ParFlow-CONUS",
    description: "ParFlow is a parallel, integrated hydrology model that simulates spatially distributed surface and subsurface flow, as well as land surface processes including evapotranspiration and snow. PF-CONUS (version 1) is an implementation of this model for a large portion of the US. "
  },
  {
    id: 2,
    name: "another",
    description: "Another description"
  }
]

</script>
