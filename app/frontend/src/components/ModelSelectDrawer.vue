<template>
  <v-navigation-drawer location="left" width="auto" :model-value="props.show" temporary @update:modelValue="$emit('toggle')">
    <v-btn v-if="!props.show" color="primary" class="ma-0 pa-0 drawer-handle" @click="$emit('toggle')">
      <v-icon class="ma-2">mdi-globe-model</v-icon>
      </v-btn>
    <v-sheet class="mx-auto" elevation="8" :width="mdAndDown ? '100vw' : '30vw'">
      <h2 class="ma-2 text-center">Model Selector</h2>
      <v-slide-group v-model="selectedModel.value" class="pa-4" selected-class="bg-primary" show-arrows>
        <v-slide-group-item v-for="hydroModel in props.models" :key="hydroModel.id"
          v-slot="{ isSelected, toggle, selectedClass }">
          <v-card color="grey-lighten-1" :class="['ma-4', selectedClass]" height="200" width="100"
            @click="selectModel(hydroModel, toggle)">
            <v-icon v-if="isSelected" icon="mdi-checkbox-marked"></v-icon>
            <div class="d-flex fill-height align-center justify-center">
              <v-scale-transition>
                <div class="pa-4">
                  {{ hydroModel.name }}
                </div>
              </v-scale-transition>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-sheet v-if="selectedModel?.value != null" height="200">
          <div class="d-flex fill-height align-center justify-center pa-4">
            <h3 class="text-h6">{{ selectedModel.description }}</h3>
          </div>
          <section class="text-right">
            <v-btn class="ma-2" color="primary" @click="$emit('toggle')">
              <span>Continue with {{ selectedModel.name }}</span>
              <v-icon class="ma-2">mdi-arrow-right-bold-box-outline</v-icon>
            </v-btn>
          </section>
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'
const props = defineProps(['show', 'models'])
defineEmits(['selectModel', 'toggle'])
let selectedModel = ref({})
function selectModel(model, toggle) {
  selectedModel.value = model
  toggle()
}
const { mdAndDown } = useDisplay()
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  top: 33%;
  left: 110%;
}
</style>