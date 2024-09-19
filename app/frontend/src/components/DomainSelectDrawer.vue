<template>
  <v-sheet class="mx-auto" elevation="8">
    <h2 class="ma-2 text-center">Define Domain</h2>
    <p class="ma-2">Select the method that you would like to use to define the domain.</p>
    <v-radio-group v-model="activeDomain">
      <v-radio v-for="domain in domains" :key="domain.id" :value="domain" @click="activateDomain(domain)"
        :disabled="!domain.enabled">
        <template v-slot:label>
          <v-img :src="domain.img" width="100" height="100" class="ma-2"></v-img>
          <span>{{ domain.name }}</span>
          <v-btn icon density="compact" size="small" class="ma-2">
            <v-icon :icon="mdiInformation" color="info">
            </v-icon>
            <v-dialog activator="parent" max-width="340">
              <template v-slot:default="{ isActive }">
                <v-card color="surface-variant">
                  <v-img color="surface-variant" height="200" :src="domain.img" cover>
                  </v-img>
                  <v-card-title>{{ domain.name }}</v-card-title>
                  <v-card-text>{{ domain.info }}</v-card-text>
                  <template v-slot:actions>
                    <v-btn class="ml-auto" text="Close" @click="isActive.value = false" variant="outlined"
                      block></v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </v-btn>
        </template>
      </v-radio>
    </v-radio-group>
    <v-btn v-if="activeDomain" @click="continueWithDomain(activeDomain)" color="primary" class="ma-2">Continue to {{
      activeDomain.name
    }}</v-btn>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { mdiInformation } from '@mdi/js';
import { useDomainsStore } from '../stores/domains';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['selectDomain', 'toggle'])
const domainsStore = useDomainsStore()

const { domains } = storeToRefs(domainsStore)
const activeDomain = ref(domains.value[0])

function activateDomain(domain) {
  activeDomain.value = domain
}

function continueWithDomain(domain) {
  domainsStore.updateDomain(domain)
  emit('toggle')
  emit('selectDomain', domain)
}


</script>

<style scoped></style>