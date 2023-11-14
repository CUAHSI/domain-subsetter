<template>
  <ModelSelectDrawer :show="showModelSelect" @toggle="showModelSelect = !showModelSelect" />
  <TheLeafletMap></TheLeafletMap>
</template>
<script setup>
import { ref } from 'vue'
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import TheLeafletMap from '../components/TheLeafletMap.vue';
const showModelSelect = ref(true)
</script>
