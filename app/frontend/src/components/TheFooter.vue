<template>
  <v-footer app color="navbar" class="d-flex flex-column">
    <div class="d-flex w-100 align-center">
      <ThemeButton/>
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
</script>

<style lang="scss" scoped></style>