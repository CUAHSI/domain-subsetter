import { defineStore } from 'pinia'
import { ref } from 'vue'
import hucImg from '@/assets/huc-image.png'
import boxDrag from '@/assets/box-drag.png'

export const useDomainsStore = defineStore('domains', () => {
  const domains = ref([
    {
      id: 1,
      name: 'Select using HUC12',
      img: hucImg,
      enabled: true,
      info: 'Select a HUC12 boundary from the map that you want to use for subsetting.'
    },
    {
      id: 2,
      name: 'Draw a box',
      img: boxDrag,
      enabled: false,
      info: 'Draw a box on the map to define the domain.'
    }
    // { id: 3, name: 'Link to a Hydrosare shapefile', img: 'https://picsum.photos/200' },
    // { id: 4, name: 'Upload a file from your computer', img: 'https://picsum.photos/200' },
  ])

  const selectedDomain = ref(null)
  const hucsAreSelected = ref(false)
  const boxIsValid = ref(false)

  function updateDomain(model) {
    selectedDomain.value = model
  }

  return { domains, selectedDomain, hucsAreSelected, boxIsValid, updateDomain }
})
