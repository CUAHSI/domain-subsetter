import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModelsStore = defineStore('models', () => {
  const models = ref([
    {
      id: 0,
      name: 'ParFlow',
      shortName: 'parflow',
      description:
        'ParFlow is a parallel, integrated hydrology model that simulates spatially distributed surface and subsurface flow, as well as land surface processes including evapotranspiration and snow.',
      children: [
        {
          name: 'ParFlow-CONUS',
          parent: 'ParFlow',
          shortName: 'parflow',
          input: 'hucs',
          description:
            'ParFlow is a parallel, integrated hydrology model that simulates spatially distributed surface and subsurface flow, as well as land surface processes including evapotranspiration and snow. PF-CONUS (version 1) is an implementation of this model for a large portion of the US. '
        },
      ]
    },
    {
      id: 1,
      name: 'National Water Model',
      shortName: 'nwm',
      description:
        "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research.",
      children: [
        {
          name: 'National Water Model V1',
          parent: 'nwm',
          shortName: 'nwm1',
          input: 'bbox',
          description:
            "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
        },
        {
          name: 'National Water Model V2',
          parent: 'nwm',
          shortName: 'nwm2',
          input: 'bbox',
          description:
            "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
        },
        {
          name: 'National Water Model V3',
          parent: 'nwm',
          shortName: 'nwm3',
          input: 'bbox',
          description:
            "The National Water Model is a hydrologic modeling framework that simulates observed and forecast streamflow over the entire continental United States. It's a special configuration of the WRF-Hydro open-source community model maintained by the National Center for Atmospheric Research. "
        },
      ]
    },
    {
      id: 2,
      name: 'NextGen',
      shortName: 'nextgen',
      description:
        'NextGen is a new generation of hydrologic models that are being developed by the National Center for Atmospheric Research. These models are designed to be more efficient and accurate than previous models.',
      children: [
        {
          name: 'NextGen V1',
          parent: 'nextgen',
          shortName: 'nextgen1',
          input: 'bbox',
          description:
            'NextGen is a new generation of hydrologic models that are being developed by the National Center for Atmospheric Research. These models are designed to be more efficient and accurate than previous models.'
        },
      ]
    }
  ])

  const selectedModel = ref(null)

  function updateModel(model) {
    selectedModel.value = model
}

  return { models, selectedModel, updateModel }
})
