import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const mapObject = ref(new Map())
  const mapLoaded = ref(false)

  return { mapObject, mapLoaded }
})
