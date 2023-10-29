<template>
    <v-container>
        <div class="text-h5">You have signed in!</div>
        <p class="font-weight-regular text-body-1 mt-4">
            You can return to the main page. This window will be closed
            automatically...
        </p>
    </v-container>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { APP_URL, ENDPOINTS } from "@/constants";
import { useRoute } from 'vue-router'
onMounted(() => {
    // Get a dictionary of parameters in the redirect response URL
    const route = useRoute();

    // TODO: works when we open this here...
    // const params = new URLSearchParams(route.query)
    // const url = `${ENDPOINTS.authCuahsiCallback}?${params}`
    // window.location.replace(url)
    
    // window.opener references our original window from where the login popup was opened
    window.opener.postMessage(
        route.query,
        APP_URL // Important security measure: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    );
    // TODO: close window will cause the cookie not to transfer...
    window.close();
});
</script>
