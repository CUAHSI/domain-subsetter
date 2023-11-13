<template>
  <v-alert class="zlert" :title="props.title" :text="props.text" closeable></v-alert>
</template>
  
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ text: { type: String, default: "" }, title: { default: "Alert" } })
</script>
  
<style scoped>
.zlert {
  position:fixed;
  z-index:9999;
  width: 100vw;
}
</style>
  