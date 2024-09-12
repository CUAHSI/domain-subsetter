<template>
  <v-navigation-drawer location="left" width="auto" :model-value="props.show" temporary @update:modelValue="$emit('toggle')">
    <v-btn v-if="!props.show" size="large" color="primary" class="ma-0 pa-2 drawer-handle" @click="$emit('toggle')">
      <v-icon :icon="mdiGlobeModel"></v-icon>
      <span v-if="modelsStore.selectedModel">{{ modelsStore.selectedModel.shortName }}</span>
      <span v-else>Select Model</span>
      </v-btn>
    <v-sheet class="mx-auto" elevation="8" :width="mdAndDown ? '100vw' : '30vw'">
      <h2 class="ma-2 text-center">Model Selector</h2>
      <v-slide-group v-model="selectedParent" class="pa-4" selected-class="bg-primary" show-arrows>
        <v-slide-group-item v-for="hydroModel in models" :key="hydroModel.id" :value="hydroModel"
          v-slot="{ toggle, selectedClass }">
          <v-card color="grey-lighten-1" :class="['ma-4', selectedClass]" height="150" width="130"
            @click="selectParent(hydroModel, toggle)">
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
        <v-expansion-panels variant="inset" class="my-4" expand v-model="panel">
          <v-expansion-panel v-for="childModel in selectedParent.children" :key="childModel.shortName">
            <v-expansion-panel-title><h3>{{childModel.name }}</h3></v-expansion-panel-title>
            <v-expansion-panel-text>
              <p>{{ childModel.description }}</p>
              <v-btn color="primary" @click="selectModel(childModel)" :disabled="isDisabled(childModel)">Continue with {{ childModel.name }}</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
          </v-expansion-panels>
        <v-sheet v-if="modelsStore.selectedModel" height="200">
          <div class="d-flex fill-height align-center justify-center pa-4">
            <h3 class="text-h6">{{ modelsStore.selectedModel.description }}</h3>
          </div>
          <section class="text-right">
            <v-btn v-if="modelsStore.selectedModel" class="ma-2" color="primary" @click="$emit('toggle')">
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
import { ref } from 'vue';
import { mdiGlobeModel, mdiArrowRightBoldBoxOutline } from '@mdi/js'

const props = defineProps(['show'])
const emit = defineEmits(['selectModel', 'toggle'])

const modelsStore = useModelsStore();
const models = modelsStore.models
const selectedParent = ref({})
const panel = ref([0])


function selectModel(model) {
  // modelsStore.selectedModel = model
  modelsStore.updateModel(model)
  emit('toggle')
}

function selectParent(parent, toggle) {
  // modelsStore.selectedModel = model
  selectedParent.value = parent
  panel.value = [0]
  toggle()
}

function isDisabled(model) {
  return model.shortName === 'nextgen1' || model.shortName === 'nwm3'
}

const { mdAndDown } = useDisplay()
</script>

<style scoped>
.drawer-handle {
  position: absolute;
  top: 127px;
  left: 110%;
}
</style>