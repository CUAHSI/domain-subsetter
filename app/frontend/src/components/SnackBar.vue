<template>
    <div class="text-center ma-2">
        <v-snackbar :v-bind="props.show" :timeout="props.timeout">
            {{ props.message }}
            <template v-slot:actions>
                <v-btn variant="text" @click="showing = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
  
<script setup>
import { defineProps } from 'vue';
const props = defineProps({ message: { type: String, default: "" }, show: { default: true }, timeout: { type: Number, default: 2000 } })

</script>
  
<style scoped></style>
  