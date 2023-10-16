<template>
  <v-footer app color="navbar" class="d-flex flex-column">
    <div class="d-flex w-100 align-center">
      <ThemeButton/>
      <div class="text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Subsetter</strong>
      </div>

      <v-spacer></v-spacer>

      <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="plain" size="small"></v-btn>
    </div>
  </v-footer>
</template>

<script setup>
import ThemeButton from './ThemeButton.vue';
const icons = [
  'mdi-atom',
  'mdi-mastodon',
  'mdi-dna',
  'mdi-biohazard',
]
</script>

<style lang="scss" scoped></style>