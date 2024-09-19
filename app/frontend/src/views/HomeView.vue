<template>
  <v-container fluid>
    <v-row class="fill-height" align="center" justify="center">
      <v-col class="text-center">
        <div>
          <div class="text-center d-flex flex-column align-center">
            <div class="mb-4 text-h3">
              Welcome to the CUAHSI Data Subsetter tool!
            </div>
            <p class="font-weight-light text-center text-subtitle">
              The purpose of this web application is to leverage interactive
              technologies and cloud services to offer a collaborative platform where
              users can explore, prepare, publish, and share subsets of distributed,
              continental-scale geospatial datasets at watershed scales. By combining
              modern cyberinfrastructure techniques with state-of-the-art modeling
              tools, this application provides researchers with access to data subsets
              that would otherwise demand significant computational resources.
            </p>
          </div>
        </div>
        <p class="subheading"></p>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="steps mb-4 d-flex flex-wrap align-center justify-center">
        <v-card v-for="step in steps" :key="step.text">
          <v-card-title>
            <v-icon :icon="step.icon"></v-icon>
            <span>{{ step.text }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-parallax :src="paralaxImg" height="80vh">
    </v-parallax>
  </v-container>
</template>

<script setup>
import paralaxImg from '@/assets/amistadreservoir_oli_20160805_lrg.jpg'
// https://earthobservatory.nasa.gov/images/153230/dry-in-the-rio-grande-basin
import { mdiLockOutline, mdiGestureTap, mdiMapPlus, mdiCloudUploadOutline, mdiShareAllOutline } from '@mdi/js'

const steps = [
  {
    icon: mdiLockOutline,
    text: 'Log in with your CUAHSI credential',
    flex: 1,
  },
  {
    icon: mdiGestureTap,
    text: 'Select the dataset',
    flex: 1,
  },
  {
    icon: mdiMapPlus,
    text: 'Identify the domain',
    flex: 1,
  },
  {
    icon: mdiCloudUploadOutline,
    text: 'Submit the job to the Cloud',
    flex: 1,
  },
  {
    icon: mdiShareAllOutline,
    text: 'Download and share results via HydroShare',
    flex: 1,
  },
]
</script>

<style scoped>
.steps {
  gap: 2rem 4rem;

  a {
    max-width: 100%;

    img {
      max-height: 5rem;
      max-width: 100%;
    }
  }
}
</style>