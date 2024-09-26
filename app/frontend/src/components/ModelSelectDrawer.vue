<template>
  <v-sheet class="mx-auto" elevation="8" style="height: calc(100vh - 165px); overflow-y: scroll">
    <h2 class="ma-2 text-center">Datasets</h2>
    <p class="ma-2">Click on each dataset to learn more. Select the checkbox fo rthe dataset you're
      interested in.</p>
    <v-slide-group v-model="selectedParent" selected-class="bg-primary" show-arrows>
      <v-slide-group-item v-for="hydroModel in models" :key="hydroModel.id" :value="hydroModel"
        v-slot="{ toggle, selectedClass }">
        <v-card color="grey-lighten-1" :class="['ma-4', selectedClass]" height="100" width="100"
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
          <v-expansion-panel-title>
            <h3>{{ childModel.name }}</h3>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>{{ childModel.description }}</p>
            <v-btn color="primary" @click="selectModel(childModel)" :disabled="isDisabled(childModel)">Continue with
              {{ childModel.shortName }}</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-expand-transition>
  </v-sheet>
</template>

<script setup>
import { useModelsStore } from '@/stores/models'
import { ref } from 'vue';

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
  return model.shortName === 'nextgen1'
}

</script>

<style scoped></style>
