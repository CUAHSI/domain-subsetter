<template>
  <v-alert
    v-show="props.text != ''"
    class="zlert"
    :title="props.title"
    :text="props.text"
    :closeable="props.closeable"
  ></v-alert>
</template>

<script setup>
const props = defineProps({
  text: { type: String, default: '' },
  title: { default: 'Alert' },
  closeable: { default: true }
})
</script>

<style scoped>
.zlert {
  position: fixed;
  z-index: 9999;
  width: 100vw;
}
</style>
