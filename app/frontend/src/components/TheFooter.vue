<template>
  <v-footer v-if="!$route.meta.hideNavigation" app color="navbar" class="d-flex flex-column">
    <div class="d-flex w-100 align-center">
      <div class="text-center w-100">
        {{ new Date().getFullYear() }} — <strong>hydroprocess_db</strong>
      </div>
      <v-spacer></v-spacer>
      <v-card href="https://cuahsi.org" class="mx-auto" rel="noopener" target="_blank" subtitle="Powered by" min-width="
        16rem">
        <template v-slot:append>
          <v-img :src="imgUrl" cover width="8rem"></v-img>
        </template>
      </v-card>
    </div>
  </v-footer>
</template>

<script setup>
import imgUrl from '@/assets/logo.png'

</script>

<style lang="scss" scoped>
.logo {
  height: 10vh;
  cursor: pointer;

  img {
    height: 10vh;
  }
}
</style>