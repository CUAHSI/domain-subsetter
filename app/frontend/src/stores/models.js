import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelsStore = defineStore('models', () => {
  const models = ref([
    {
      id: 0,
      name: 'ParFlow-CONUS',
      shortName: 'PF',
      input: 'hucs',
      description:
        'ParFlow is a parallel, integrated hydrology model that simulates spatially distributed surface and subsurface flow, as well as land surface processes including evapotranspiration and snow. PF-CONUS (version 1) is an implementation of this model for a large portion of the US. '
    },
    {
      id: 1,
      name: 'National Water Model V1',
      shortName: 'NWM1',
      input: 'bbox',
      description:
        "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
    },
    {
      id: 2,
      name: 'National Water Model V2',
      shortName: 'NWM2',
      input: 'bbox',
      description:
        "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
    }
  ])
  const selectedModel = ref({})

  return { models, selectedModel }
})
