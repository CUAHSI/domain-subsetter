<template>
  <section>
    <div id="mapContainer"></div>
  </section>
</template>
<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted } from 'vue'

onMounted(() => {
  let Map = {}
  const map = L.map('mapContainer').setView([38.2, -96], 5)
  Map.map = map
  Map.hucbounds = []
  Map.popups = []
  Map.buffer = 20
  Map.hucselected = false
  Map.huclayers = []
  Map.reaches = {}
  Map.huc2_min = 0
  Map.huc2_max = 7
  Map.huc4_min = 6
  Map.huc4_max = 10
  Map.huc6_min = 6
  Map.huc6_max = 10
  Map.huc10_min = 9
  Map.huc10_max = 14
  Map.huc12_min = 10
  Map.huc12_max = 18

  Map.bbox = [99999999, 99999999, -99999999, -99999999]

  // Initial OSM tile layer
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  // WMS LAYER
  let url = 'http://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WmsServer?'

  // HUC 2 Layer
  var huc2 = L.tileLayer
    .wms(url, {
      layers: 4,
      transparent: 'true',
      format: 'image/png',
      minZoom: Map.huc2_min,
      maxZoom: Map.huc2_max
    })
    .addTo(map)

  // HUC 4 Layer
  var huc4 = L.tileLayer
    .wms(url, {
      layers: 3,
      transparent: 'true',
      format: 'image/png',
      minZoom: Map.huc4_min,
      maxZoom: Map.huc4_max
    })
    .addTo(map)

  // HUC 12 Layer
  var huc12 = L.tileLayer
    .wms(url, {
      layers: 2,
      transparent: 'true',
      format: 'image/png',
      minZoom: Map.huc12_min,
      maxZoom: Map.huc12_max
    })
    .addTo(map)

  // HUC 10 Layer
  var huc10 = L.tileLayer
    .wms(url, {
      layers: 1,
      transparent: 'true',
      format: 'image/png',
      minZoom: Map.huc10_min,
      maxZoom: Map.huc10_max
    })
    .addTo(map)

  // add USGS gage layer to map
  url = 'http://arcgis.cuahsi.org/arcgis/services/NHD/usgs_gages/MapServer/WmsServer?'
  var gages = L.tileLayer
    .wms(url, {
      layers: 0,
      transparent: 'true',
      format: 'image/png',
      minZoom: 9,
      maxZoom: 18
    })
    .addTo(map)
})
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100vh;
}
</style>
