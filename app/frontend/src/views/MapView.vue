<template>
  <ModelSelectDrawer :show="showModelSelect" @toggle="showModelSelect = !showModelSelect" />
  <SubmitButton />
  <!-- Actual map component included in base App.vue to allow persistence -->
</template>

<script setup>
import { ref } from 'vue'
import ModelSelectDrawer from '../components/ModelSelectDrawer.vue';
import SubmitButton from '../components/SubmitButton.vue';
const showModelSelect = ref(true)
</script>
