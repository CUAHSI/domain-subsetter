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
import { APP_URL } from "@/constants";
onMounted(() => {
    alert('hi')
    // Get a dictionary of parameters in the redirect response URL
    const dict = {};
    this.$route.hash.split("&").reduce((acc, curr) => {
        const [key, val] = curr.split("=");
        acc[key] = val;
        return acc;
    }, dict);

    // window.opener references our original window from where the login popup was opened
    window.opener.postMessage(
        { accessToken: dict["#access_token"] || "" },
        APP_URL // Important security measure: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
    );
    window.close();
});
</script>
