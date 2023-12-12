<template>
  <v-navigation-drawer location="left" width="auto" :model-value="props.show" temporary @update:modelValue="$emit('toggle')">
    <v-btn v-if="!props.show" color="primary" class="ma-0 pa-2 drawer-handle" @click="$emit('toggle')">
      <v-icon :icon="mdiGlobeModel"></v-icon>
      <span v-if="isModelSelected">{{ modelsStore.selectedModel.shortName }}</span>
      <span v-else>Select Model</span>
      </v-btn>
    <v-sheet class="mx-auto" elevation="8" :width="mdAndDown ? '100vw' : '30vw'">
      <h2 class="ma-2 text-center">Model Selector</h2>
      <v-slide-group v-model="modelsStore.selectedModel.value" class="pa-4" selected-class="bg-primary" show-arrows>
        <v-slide-group-item v-for="hydroModel in models" :key="hydroModel.id"
          v-slot="{ isSelected, toggle, selectedClass }">
          <v-card color="grey-lighten-1" :class="['ma-4', selectedClass]" height="200" width="100"
            @click="selectModel(hydroModel, toggle)">
            <v-icon v-if="isSelected" :icon="mdiCheckboxMarked"></v-icon>
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
        <v-sheet v-if="isModelSelected" height="200">
          <div class="d-flex fill-height align-center justify-center pa-4">
            <h3 class="text-h6">{{ modelsStore.selectedModel.description }}</h3>
          </div>
          <section class="text-right">
            <v-btn v-if="isModelSelected" class="ma-2" color="primary" @click="$emit('toggle')">
              <span>Continue with {{ modelsStore.selectedModel.name }}</span>
              <v-icon class="ma-2" :icon="mdiArrowRightBoldBoxOutline"></v-icon>
            </v-btn>
          </section>
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useModelsStore } from '@/stores/models'
import { computed } from 'vue';
import { mdiGlobeModel, mdiCheckboxMarked, mdiArrowRightBoldBoxOutline } from '@mdi/js'

const props = defineProps(['show'])
defineEmits(['selectModel', 'toggle'])

const modelsStore = useModelsStore();
const models = modelsStore.models

function selectModel(model, toggle) {
  // modelsStore.selectedModel = model
  modelsStore.updateModel(model)
  toggle()
}

const isModelSelected = computed(() => {
  return modelsStore.selectedModel.value != null
})

const { mdAndDown } = useDisplay()
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  bottom: 30%;
  left: 110%;
}
</style>