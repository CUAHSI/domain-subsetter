<template>
  <div class="text-center">

    <v-bottom-sheet v-model="showSheet" inset>
      <v-card class="text-center" height="200">
        <v-card-text>
          <v-btn variant="text" @click="showSheet = !showSheet">
            close
          </v-btn>

          <br>
          <br>

          <div>
            {{ props.text }}
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
const props = defineProps({ text: { type: String, default: "" } })
let showSheet = ref(props.text != '')
</script>