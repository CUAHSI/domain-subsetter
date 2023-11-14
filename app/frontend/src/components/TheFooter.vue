<template>
  <v-footer app color="navbar" class="d-flex flex-column">
    <div class="d-flex w-100 align-center">
      <ThemeButton/>
      <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="plain" size="small"></v-btn>
      <div class="text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Subsetter</strong>
      </div>

      <v-spacer></v-spacer>
      <SubmitButton />
    </div>
  </v-footer>
</template>

<script setup>
import ThemeButton from './ThemeButton.vue';
import SubmitButton from './SubmitButton.vue';
const icons = [
  'mdi-atom',
  'mdi-mastodon',
  'mdi-dna',
  'mdi-biohazard',
]
</script>

<style lang="scss" scoped></style>