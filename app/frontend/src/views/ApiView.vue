<template>
  <!-- <redoc :spec-url="`${ENDPOINTS.openapi}`"></redoc> -->
  <div class="swagger" id="swagger"></div>
</template>

<script setup>
import { ENDPOINTS } from "@/constants.js";
import { onMounted } from 'vue'
import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';
onMounted(() => {
  SwaggerUI({
    url: ENDPOINTS.openapi,
    dom_id: '#swagger'
  })
});
</script>

