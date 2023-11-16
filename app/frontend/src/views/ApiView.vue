<template>
  <v-theme-provider theme="light" with-background>
    <div class="swagger" id="swagger"></div>
  </v-theme-provider>
</template>

<script setup>
import { onMounted } from 'vue'
import SwaggerUI from 'swagger-ui';
import { ENDPOINTS } from '@/constants'
import 'swagger-ui/dist/swagger-ui.css';

onMounted(() => {
  SwaggerUI({
    url: ENDPOINTS.openapi,
    dom_id: '#swagger',
    withCredentials: true,
  })
});
</script>

