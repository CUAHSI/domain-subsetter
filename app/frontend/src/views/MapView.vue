<template>
  <ModelSelectDrawer :show="showModelSelect" @toggle="showModelSelect = !showModelSelect" />
  <SubmitButton />
  <TheLeafletMap></TheLeafletMap>
</template>

<script setup>
import { ref } from 'vue'
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import TheLeafletMap from '../components/TheLeafletMap.vue';
import SubmitButton from '../components/SubmitButton.vue';
const showModelSelect = ref(true)
</script>
