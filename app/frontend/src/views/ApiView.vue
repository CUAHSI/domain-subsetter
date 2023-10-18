<template>
  <v-theme-provider theme="light">
    <div class="swagger" id="swagger"></div>
  </v-theme-provider>
</template>

<script setup>
import { ENDPOINTS } from "@/constants.js";
import { onMounted } from 'vue'
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
// const spec = import.meta.glob('@/../../spec/openapi.json')
import json from '@/../../spec/openapi.json'
onMounted(() => {
  SwaggerUI({
    spec: json,
    dom_id: '#swagger'
  })
});
</script>

