<template>
  <section>
    <redoc :spec-url="`${ENDPOINTS.openapi}`"></redoc>
  </section>
</template>

<script setup>
import { ENDPOINTS } from "@/constants.js";
import { onMounted } from 'vue'
onMounted(() => {
  const redocScript = document.createElement("script");
  redocScript.setAttribute(
    "src",
    "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
  );

  document.head.appendChild(redocScript);
});
</script>

