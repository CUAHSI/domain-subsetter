<template>
  <h2 class="ma-2 text-center">About</h2>
  <v-container class="about">
    <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
      <h3 id="background">Background</h3>
      <p>Large scale surface water and groundwater models are essential tools for improving our understanding of the
        dynamic
        interaction between the water cycle and human activity. This is especially true when investigating human impacts,
        extreme hydrologic events, and future water resource availability. Results from these models advance hydrologic
        science and inform neighboring research disciplines. As a result, community intellectual contributions to the
        physics, configuration, and validation of continental-scale models are essential to improving the usefulness and
        adoption of these models within the academic community. Due to the computational scale of these models, they often
        require specialized computing hardware and vast amounts of domain and forcing data, making it difficult for the
        broader water science community to directly engage in development and research efforts. CUAHSI has recognized this
        challenge and is collaborating with the National Center for Atmospheric Research, Colorado School of Mines, and
        other entities involved with continental-scale hydrology modeling to improve the accessibility of model domain
        input
        data.</p>
    </v-sheet>
    <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
      <h3 id="purpose">Purpose</h3>
      <p>The purpose of this application is to introduce a collaborative effort for preparing, publishing, and sharing
        subsets of the NOAA National Water Model and ParFlow-CONUS input data at watershed scales. Our hope is that these
        efforts will lower the barrier of entry for using and applying these models, as well as engage a variety of
        scientists and educators from a diverse spectrum of expertise. With a combination of modern cyberinfrastructure
        techniques and state-of-the-science modeling tools, researchers will have access to subsets of National Water
        Model
        and ParFlow-CONUS information that would otherwise require extensive computational resources. This work provides
        the
        foundation onto which similar efforts can be applied to new versions of these models and other large-scale codes
        and
        input data. We anticipate the CUAHSI Domain Subsetter will eventually become integrated into the larger <a
          href="https://www.hydroframe.org/"><em>HydroFrame</em></a> infrastructure.</p>
    </v-sheet>

    <v-sheet border="md" class="pa-6 mx-auto ma-4" max-width="1200" rounded>
      <h3 id="contributors">Contributors</h3>
      <p>Currently, this work is a collaborative effort between CUAHSI, Colorado School of Mines, NCAR, and the NWS/OWP.
        If
        you are interested in collaborating with us on a similar project, please contact Tony Castronova</p>
    </v-sheet>
  </v-container>

  <h2 class="ma-2 text-center">Our Team</h2>
  <v-container>
    <v-row align="center" justify="center">
      <v-col v-for="member in members" :key="member.name" cols="auto">
        <v-card>
          <v-img :src="`${member.image}`" :width="400" aspect-ratio="1" cover
            lazy-src="https://www.hydroshare.org/static/static/img/home-page/carousel/bg3.jpg">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div>
            </template>
          </v-img>
          <v-card-title class="text-h6">
            {{ member.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ member.position }}
            <v-divider></v-divider>
            {{ member.org }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
  }
}
</style>

<script setup>

const members = [
  {
    name: 'Scott Black',
    image: 'https://www.cuahsi.org/uploads/team/img/_headshot/black-scott.jpg',
    position: 'Senior Software Specialist',
    org: 'CUAHSI'
  },
  {
    name: 'Devin Cowan',
    image: 'https://www.cuahsi.org/uploads/team/img/_headshot/Devin-Cowan.jpg',
    position: 'Research Programmer',
    org: 'CUAHSI'
  },
  {
    name: 'Tony Castronova',
    image: 'https://www.cuahsi.org/uploads/team/img/_headshot/TCastronova.jpg',
    position: 'Senior Research Hydrologist',
    org: 'CUAHSI'
  },
  {
    name: 'Danielle Tijerina-Kreuzer',
    image: 'https://avatars.githubusercontent.com/u/42181890?v=4',
    position: 'PhD Candidate',
    org: 'Princeton University'
  },
  {
    name: 'Irene Garousi-Nejad',
    image: 'https://www.cuahsi.org/uploads/team/img/_headshot/Irene_headshot03.jpg',
    position: 'Research Scientist',
    org: 'CUAHSI'
  }
]
</script>
