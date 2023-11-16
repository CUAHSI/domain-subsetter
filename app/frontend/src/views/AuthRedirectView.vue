<template>
    <v-container>
        <div class="text-h5">You are being signed in!</div>
        <p class="font-weight-regular text-body-1 mt-4">
            You can return to the main page. This window should close
            automatically...
        </p>
    </v-container>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { APP_URL } from "@/constants";
onMounted(() => {
    // Get a dictionary of parameters in the redirect response URL
    const params = window.location.search
    
    // window.opener references our original window from where the login popup was opened
    window.opener.postMessage(
        params,
        APP_URL // Important security measure: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    );
});
</script>
