<template>
  <v-theme-provider theme="light" with-background>
    <div class="swagger" id="swagger"></div>
  </v-theme-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
import json from '@/../../spec/openapi.json'
onMounted(() => {
  SwaggerUI({
    spec: json,
    dom_id: '#swagger'
  })
});
</script>

