<template>
    <div v-show="$route.meta.showMap" id="mapContainer"></div>
    <v-card v-show="$route.meta.showMap" style="z-index:9999" max-width="250">
        {{ lat }}, {{ lng }}
    </v-card>
</template>
<script setup>
import "leaflet/dist/leaflet.css";
import "leaflet-easybutton/src/easy-button.css";
import L from 'leaflet'
import * as esriLeaflet from 'esri-leaflet'
import "leaflet-easybutton/src/easy-button";
import { onMounted, onUpdated } from 'vue'
import { useMapStore } from '@/stores/map'
import { useModelsStore } from '@/stores/models'
import { useAlertStore } from '@/stores/alerts'
import { useDomainsStore } from '@/stores/domains'
import { GIS_SERVICES_URL } from '@/constants'
import { API_BASE } from '@/constants'
import { fetchWrapper } from '@/_helpers/fetchWrapper';
import { ref } from 'vue'

const mapStore = useMapStore()
const modelsStore = useModelsStore();
const alertStore = useAlertStore();
const domainStore = useDomainsStore();

const lat = ref(0);
const lng = ref(0);


const modelAction = modelsStore.$onAction(
    ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after, // hook after the action returns or resolves
        onError, // hook if the action throws or rejects
    }) => {
        // this will trigger if the action succeeds and after it has fully run.
        // it waits for any returned promised
        after((result) => {
            if (store.selectedModel.input != "bbox") {
                removeBbox()
            } else {
                updateMapBBox()
            }
        })

        // this will trigger if the action throws or returns a promise that rejects
        onError((error) => {
            console.warn(
                `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
            )
        })
    }
)

const Map = mapStore.mapObject

onUpdated(() => {
    Map.map.invalidateSize()
})
onMounted(() => {
    let map = L.map('mapContainer').setView([38.2, -96], 5);
    map.on('mousemove', updateMousePosition);
    Map.map = map;
    Map.hucbounds = [];
    Map.popups = [];
    Map.buffer = 20;
    domainStore.hucsAreSelected = false;
    Map.huclayers = [];
    Map.selected_hucs = [];
    Map.reaches = {};
    Map.huc2_min = 0;
    Map.huc2_max = 7;
    Map.huc4_min = 6;
    Map.huc4_max = 10;
    Map.huc6_min = 6;
    Map.huc6_max = 10;
    Map.huc10_min = 9;
    Map.huc10_max = 14;
    Map.huc12_min = 10;
    Map.huc12_max = 18;

    Map.bbox = [99999999,
        99999999,
        -99999999,
        -99999999];

    // Initial OSM tile layer
    let CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    let url =
        'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_Hydro_Reference_Overlay/MapServer'
    // url = 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_Hydro_Reference_Labels/MapServer'

    let Esri_Hydro_Reference_Overlay = esriLeaflet.tiledMapLayer({
        url: url,
        layers: 0,
        transparent: 'true',
        format: 'image/png'
    })

    url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    let Esri_WorldImagery = L.tileLayer(url, {
        variant: 'World_Imagery',
        attribution: 'Esri'
    })

    const baselayers = {
        CartoDB_PositronNoLabels,
        Esri_WorldImagery
    };

    Esri_WorldImagery.addTo(map);
    Esri_Hydro_Reference_Overlay.addTo(map);



    // WMS LAYER
    url = `${GIS_SERVICES_URL}/US_WBD/HUC_WBD/MapServer/WmsServer?`

    // HUC WMS Naming
    // --------------
    // HUC12_US: 0
    // HUC10_US: 1
    // HUC_4_US: 2
    // HUC2_US: 3
    // --------------

    // HUC 2 Layer
    let huc2 = L.tileLayer.wms(url, {
        layers: 4,
        transparent: 'true',
        format: 'image/png',
        minZoom: Map.huc2_min,
        maxZoom: Map.huc2_max
    }).addTo(map);

    // HUC 4 Layer
    let huc4 = L.tileLayer.wms(url, {
        layers: 3,
        transparent: 'true',
        format: 'image/png',
        minZoom: Map.huc4_min,
        maxZoom: Map.huc4_max
    }).addTo(map);


    // HUC 12 Layer
    let huc12 = L.tileLayer.wms(url, {
        layers: 2,
        transparent: 'true',
        format: 'image/png',
        minZoom: Map.huc12_min,
        maxZoom: Map.huc12_max
    }).addTo(map);

    // HUC 10 Layer
    let huc10 = L.tileLayer.wms(url, {
        layers: 1,
        transparent: 'true',
        format: 'image/png',
        minZoom: Map.huc10_min,
        maxZoom: Map.huc10_max
    }).addTo(map);

    // add USGS gage layer to map
    url = `${GIS_SERVICES_URL}/NHD/usgs_gages/MapServer/WmsServer?`;
    let gages = L.tileLayer.wms(url, {
        layers: 0,
        transparent: 'true',
        format: 'image/png',
        minZoom: 9,
        maxZoom: 18,
    }).addTo(map);

    // layer toggling
    let mixed = {
        "HUC 2": huc2,
        "HUC 4": huc4,
        "HUC 10": huc10,
        "HUC 12": huc12,
        "USGS Gages": gages,
        "Esri Hydro Reference Overlay": Esri_Hydro_Reference_Overlay
    };

    // /*
    //  * LEAFLET BUTTONS
    //  */

    // Erase
    L.easyButton('fa-eraser',
        function () { clearSelection(); },
        'clear selected features').addTo(map);

    // Layer Control
    L.control.layers(baselayers, mixed).addTo(map);

    /*
     * LEAFLET EVENT HANDLERS
     */
    map.on("click", function (e) {
        mapClick(e);
    });

    mapStore.mapLoaded = true;
})

function resize_map() {
    let pheight = document.getElementById('map').parent().height();
    let pwidth = document.getElementById('map').parent().width();
    document.getElementById("map").height(pheight).width(pwidth);
    Map.map.invalidateSize();
}

/* 
 * LEAFLET HANDLERS 
 */


async function getGageInfo(e) {
    // TODO: this function needs to be repaired
    console.log('skipping getGageInfo')
    return {}
    // TESTING GAGE INFO BOX
    // quick and dirty buffer around cursor
    // bbox = lon_min, lat_min, lon_max, lat_max
    let buf = 0.001;

    let buffered_bbox = (e.latlng.lat - buf) + ','
        + (e.latlng.lng - buf) + ','
        + (e.latlng.lat + buf) + ','
        + (e.latlng.lng + buf);
    let defaultParameters = {
        service: 'WFS',
        request: 'GetFeature',
        bbox: buffered_bbox,
        typeName: 'usgs_gages:usgs_gages_4326',
        SrsName: 'EPSG:4326',
        outputFormat: 'ESRIGEOJSON'
    };
    let root = `${GIS_SERVICES_URL}/NHD/usgs_gages/MapServer/WFSServer`;
    let parameters = L.Util.extend(defaultParameters);
    let gageURL = root + L.Util.getParamString(parameters);

    let gage_meta = {};
    console.log(gageURL)
    let resp = await fetch(gageURL)
    if (resp.ok) {
        try {
            let response = await resp.json()
            if (response.features.length > 0) {
                let atts = response.features[0].attributes;
                let geom = response.features[0].geometry;
                gage_meta.name = atts.STATION_NM;
                gage_meta.num = atts.SITE_NO;
                gage_meta.x = geom.x;
                gage_meta.y = geom.y;
            }
        } catch (e) {
            console.error("Error attempting json parse", e)
        }
    }
    return gage_meta;

}

async function mapClick(e) {

    /*
    * The event handler for map click events
    * @param {event} e - a map mouse click event
    * @returns - null
    */

    // exit early if not zoomed in enough.
    // this ensures that objects are not clicked until zoomed in
    let zoom = e.target.getZoom();
    if (zoom < Map.selectable_zoom) {
        return
    }


    // check if gage was clicked
    let gage = await getGageInfo(e);

    // if a gage was selected, create a pop up and exit early.
    // we don't want to toggle HUC selection if a gage was clicked
    if (Object.keys(gage).length > 0) {
        // create map info object here

        // close all popups
        if (Map.popups.length > 0) {
            Map.map.closePopup();
        }

        // create new popup containing gage info
        L.popup().setLatLng([gage.y, gage.x])
            .setContent('<b>ID:</b> ' + gage.num + '<br>'
                + '<b>Name</b>: ' + gage.name + '<br>')
            //		             + '<b>Select</b>: <a onClick=traceUpstream("'+gage.num+'")>upstream</a>')
            .openOn(Map.map);

        // exit function without toggling HUC
        return;
    }

    // mark the huc as selected.
    // this will allow the bbox to be drawn.
    domainStore.hucsAreSelected = true;

    // get the latitude and longitude of the click event.
    // use this data to query ArcGIS WFS for the selected HUC object.
    let defaultParameters = {
        service: 'WFS',
        request: 'GetFeature',
        bbox: e.latlng.lat + ',' + e.latlng.lng + ',' + e.latlng.lat + ',' + e.latlng.lng,
        SrsName: 'EPSG:4269',
        version: '2.0.0',
        EPSG:4269,
        typeName: 'WBDHU12',
        outputFormat:'GEOJSON'
    };
    let root = `${GIS_SERVICES_URL}/hucs/hucs/MapServer/WFSServer`
    let parameters = L.Util.extend(defaultParameters);
    let URL = root + L.Util.getParamString(parameters);

    // load the map and table elements async
    toggleHucsAsync(URL, true, null);

}


function traceUpstream(usgs_gage) {

    console.log('traceUpstream --> selected gage = ' + usgs_gage);

    // clear any existing reaches from the map
    if (Map.reaches.obj != null) {
        Map.reaches.obj.clearLayers();
    }

    // query the upstream reaches via NLDI
    $.ajax({
        url: '/nldi-trace',
        type: 'GET',
        contentType: "application/json",
        data: {
            'site_provider': 'nwis',
            'site': usgs_gage
        },
        success: function (response) {


            // add the reaches to the map and replace the global reaches
            // object with the newly selected reaches.
            let reaches = L.geoJSON(response.features, { style: { color: 'green' } });
            Map.reaches.start_id = reaches._leaflet_id;
            Map.reaches.count = response.features.length;
            Map.reaches.obj = reaches;
            reaches.addTo(Map.map);


            // a list to store a single coordinate for each reach
            let centroids = [];


            // generate a list of points for each of the reaches
            response.features.forEach(function (reach) {

                // select the middle geometry feature.
                // This is a hack and should be replaced with something better
                geom_idx = Math.ceil(reach.geometry.coordinates.length / 2);

                geom_coord = reach.geometry.coordinates[geom_idx];
                centroids.push(geom_coord);
            })

            console.log('Number of reaches found = ' + centroids.length);

            // TODO: move this into a function since it's used in several places.
            // query the HUC geometry for each of the reach coordinate points
            // use this data to query ArcGIS WFS for the selected HUC object.
            centroids.forEach(function (coord) {
                let defaultParameters = {
                    service: 'WFS',
                    request: 'GetFeature',
                    bbox: coord[0] + ',' + coord[1] + ',' + coord[0] + ',' + coord[1],
                    typeName: 'HUC_WBD:HUC12_US',
                    SrsName: 'EPSG:4326'
                };
                let root = `${GIS_SERVICES_URL}/US_WBD/HUC_WBD/MapServer/WFSServer`;
                let parameters = L.Util.extend(defaultParameters);
                let URL = root + L.Util.getParamString(parameters);

                //	   	// load the map and table elements async
                // todo: highlight the unique set of HUCs, do not toggle.
                //	   	toggleHucsAsync(URL, true, null);
            })
        },
        error: function (error) {
            console.log('error querying NLDI upstream: ' + error);
        }
    });
}


/*
 * HUC TABLE FUNCTIONS
 */


/*
 * Toggles the delete HUC menu button
 */
function toggle_delete_button() {
    let row_count = document.getElementById('huc-table tr').length;
    if (row_count > 0) {
        document.getElementById('rm-huc').removeClass('mdl-button--disabled')
    } else {
        document.getElementById('rm-huc').addClass('mdl-button--disabled')
    }
}

function addHucRow(huc_value) {
    // Adds new rows to the HUC table

    // check if the id already exists in the table.
    // if it does, don't add it again
    let existing_row_id = getRowIdByName(huc_value);
    if (existing_row_id != -999) {
        return;
    }

    let table = document.getElementById('huc-table');
    let rid = table.rows.length;
    let chkid = 'chkbx' + rid;
    let row = table.insertRow(rid);

    cell1 = row.insertCell(0);

    let lbl = document.createElement('label');
    lbl.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded';
    lbl.setAttribute('for', chkid);

    let chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.id = chkid;
    chk.className = 'mdl-checkbox__input';
    lbl.appendChild(chk);

    cell1.appendChild(lbl);

    let cell1 = row.insertCell(1);
    cell1.className = 'mdl-data-table__cell--non-numeric';
    cell1.innerHTML = huc_value;

    let cell2 = row.insertCell(2);
    cell2.innerHTML = 'Loading';

    // toggle the delete button
    toggle_delete_button();

    //   componentHandler.upgradeAllRegistered();
}

function rmHucRow(row_id) {
    // Removes a row from the HUC table
    if (row_id >= 0) {
        let table = document.getElementById("huc-table");
        table.deleteRow(row_id);
    }

    // toggle the delete button
    toggle_delete_button();
}

function getRowIdByName(huc_value) {
    // Gets the row id for a given huc value
    // Returns: index of the matching row, -999 if it doesn't exist in the table

    let row = document.getElementById("huc-table > tbody > tr:contains('" + huc_value + "')");
    if (row.length == 0) {
        return -999;
    } else {
        return row[0].rowIndex;
    }
}

function getRowByName(huc_value) {
    // Gets the row object for a given huc value
    // Returns: the row object or -999 if it doesn't exist

    let row = document.getElementById("huc-table > tbody > tr:contains('" + huc_value + "')");
    if (row.length == 0) {
        return -999;
    } else {
        return row[0];
    }
}


function clearSelection() {
    // Clears the selected features on the map

    for (let key in Map.hucbounds) {

        // clear the huc boundary list
        delete Map.hucbounds[key];

        // clear the polygon overlays
        Map.huclayers[key].clearLayers();
        delete Map.huclayers[key];

        // clear the hucs in the html template

    }
    Map.selected_hucs = []
    domainStore.hucsAreSelected = false

    // clear the HUC table
    // clearHucTable();

    // update the map
    updateMapBBox();
    getLccBounds([]);


    // clear and update the HUC textbox
    // document.querySelector('.mdl-textfield').MaterialTextfield.change('');
    alertStore.displayAlert({
        title: 'Cleared',
        text: 'Your map selection was cleared',
        type: 'info',
        closable: true,
        duration: 1
    })
}


/**
* Queries the global bounding box for a list of hucs ids
* @param {array} hucids - HUC ids to query the bounding box for
* @returns {array} - bounding box for all hucID in the Spherical Lambert Confromal Conic SRS
*/
function getLccBounds(hucs) {}

async function getNWMBbox(geometry){
  /**
  * Queries the NWM bounding box for a given geometry provided in WGS 1984
  */

  
  // TODO:add nwm bbox here
  const resp = await fetchWrapper.post(`${API_BASE}/nwm/compute_bbox`, geometry);
  if(resp.ok){
    // print the data returned by resp
    const data = await resp.unpacked;
    return data
  }

}

async function toggleHucsAsync(url, remove_if_selected, remove) {

    // call the ArcGIS WFS asyncronously so that the webpage doesn't freeze.
    const response = await fetch(url)
    if (response.ok) {
        const data = await response.json();
        const clicked_hucs = data.features.map((feature) => {
            // bbox is a L.LatLngBounds instance, which refers to unprojected WGS84 coordinates
            return {
                hucid: feature.properties.HUC12,
                geom: feature.geometry,
                bbox: L.geoJSON(feature.geometry).getBounds(),
            }
        })
        // compute the bounding box for this HUC in the CRS used by nwm
        const nwm_bbox = await getNWMBbox(data);
        console.log(nwm_bbox);
               
    
        for (let huc of clicked_hucs) {
            try {
                // toggle bounding box using the following rules:
                // 1. if the object is already selected, remove it from the 
                //    map and the table.
                // 2. if the object is not selected, add it to the map and
                //    add it to the table.

                if (huc.hucid in Map.hucbounds) {
                    console.info("Removing huc", huc)
                    // remove only if explicitly specified to.
                    // this is because the "ADD" dialog should never
                    // remove features, unlike the map click event.
                    if (remove_if_selected) {
                        // delete Map.selected_hucs[huc]
                        Map.selected_hucs = Map.selected_hucs.filter((h) => { return h.hucid != huc.hucid })
                        delete Map.hucbounds[huc.hucid];
                        // let row_id = getRowIdByName(huc.hucid)
                        // rmHucRow(row_id);
                        togglePolygon(huc.hucid, huc.geom);
                    }
                }
                else {
                    console.info("Adding huc", huc)
                    Map.selected_hucs.push(huc)
                    
                    // save the bounding box for this huc in both nwm and wgs84 CRSs
                    Map.hucbounds[huc.hucid] = {'wgs84_bbox': huc.bbox,
                                                'nwm_bbox': nwm_bbox};

                    // addHucRow(huc.hucid);
                    togglePolygon(huc.hucid, huc.geom);

                    // add a 'success' message for this table entry
                    // let row = getRowByName(huc.hucid);
                    // let elem = row.getElementsByTagName('td')[2]
                    // elem.innerText = 'Loaded';
                    // elem.style.color = 'green';
                }
            } catch (err) {
                // if there was an error adding the HUC,
                // add an error message in the table
                // let row = getRowByName(huc.hucid);
                // let elem = row.getElementsByTagName('td')[2]
                // elem.innerText = 'Error';
                // elem.style.color = 'red';
                console.error("Error during toggle huc", err)
                alertStore.displayAlert({
                    title: 'Error',
                    text: `Error selecting huc: ${err}`,
                    type: 'error',
                    closable: true,
                    duration: 1
                })
            }
            // refresh page
            // document.getElementById('huc-table-div').hide().show(0);
            // document.getElementById('mapContainer').hide().show(0);
        }

        // update the boundaries of the global bbox.
        // this is used for rendering the bbox on the leaflet map.
        let hucs = [];
        updateMapBBox();
        for (let key in Map.hucbounds) {
            hucs.push(key);
        }
        //getLccBounds(hucs);

        // update the hucs list 
        // this is used to create a shapefile
        // that is exported along with the subset
        update_huc_ids(hucs);


        // remove the specified id
        if (remove != null) {
            let rid = getRowIdByName(remove);
            if (rid != -999) {
                rmHucRow(rid);
            }
        }

    } else {
        console.error("Error fetching huc data", response)
        alertStore.displayAlert({
            title: 'Error',
            text: `Error fetching huc data: ${response.message}`,
            type: 'error',
            closable: true,
            duration: 1
        })
    }
}

function updateMousePosition(e) {
    lat.value = e.latlng.lat.toFixed(5);
    lng.value = e.latlng.lng.toFixed(5);
}

function updateMapBBox() {
    /**
    * Calculates and draws the bounding box on the map.
    * This is computed using the wgs84_bbox variable stored
    * within Map.hucbounds. This also calculates the bbox in the 
    * nwm coordinates which are used for subsetting NWM data.
    */
  
    // calculate global boundary
    let xmin = 9999999;
    let ymin = 9999999;
    let xmax = -9999999;
    let ymax = -9999999;
    for (let key in Map.hucbounds) {
        let bounds = Map.hucbounds[key].wgs84_bbox
        if (bounds.getWest() < xmin) {
            xmin = bounds.getWest();
        }
        if (bounds.getSouth() < ymin) {
            ymin = bounds.getSouth();
        }
        if (bounds.getEast() > xmax) {
            xmax = bounds.getEast();
        }
        if (bounds.getNorth() > ymax) {
            ymax = bounds.getNorth();
        }
    }

    console.log("updating leaflet bbox with values:")
    console.log("xmin", xmin)
    console.log("ymin", ymin)
    console.log("xmax", xmax)
    console.log("ymax", ymax)

    // save the map bbox
    Map.bbox = [xmin, ymin, xmax, ymax];

    // remove the old bounding box layer
    removeBbox()
    
    // draw the new bounding box layer
    drawBbox()

}

function removeBbox() {
    // remove the bbox layer if it exists
    if ('BBOX' in Map.huclayers) {
        // remove the polygon overlay 
        Map.huclayers['BBOX'].clearLayers();
        delete Map.huclayers['BBOX'];
    }
}
function drawBbox() {

    let style = {fillColor: 'black',
                 weight: 2,
                 opacity: 1,
                 color: 'green',
                 fillOpacity: 0.01,
                 lineJoin: 'round'}

    // redraw the bbox layer with new coordinates
    let polygon = [{
        "type": "Polygon",
        "coordinates": [[[Map.bbox[0], Map.bbox[1]],
                         [Map.bbox[0], Map.bbox[3]],
                         [Map.bbox[2], Map.bbox[3]],
                         [Map.bbox[2], Map.bbox[1]],
                         [Map.bbox[0], Map.bbox[1]]
                       ]]
    }];
    let json_polygon = L.geoJSON(polygon, { style: style });
    
    Map.huclayers['BBOX'] = json_polygon;
    if (modelsStore?.selectedModel?.input == "bbox") {
        json_polygon.addTo(Map.map);
    }
    
    // TODO: Not sure if this is still needed
    domainStore.boxIsValid = true;
}

/**
* Toggles HUC boundaries on the map, on/off.
* @param {string} hucID - ID of the huc to toggle
* @param {object} geom - geometry of the huc to toggle
*/
function togglePolygon(hucID, geom) {

    if (hucID in Map.huclayers) {
        // remove the polygon overlay 
        Map.huclayers[hucID].clearLayers();
        delete Map.huclayers[hucID];
    }
    else {
        let json_polygon = L.geoJSON(geom, { style: { fillColor: 'blue' } });

        // save the layer
        Map.huclayers[hucID] = json_polygon;

        json_polygon.addTo(Map.map);
    }

}

function update_huc_ids(huclist) {

    // convert huc array into csv string
    let hucs = huclist.join(",");

    if (hucs == "") {
        domainStore.hucsAreSelected = false
    }
}

/**
 * Displays a notification message at the bottom of the screen 
 * using this #notification element in base.html
 */
function notify(message) {
    let notify = document.querySelector('#notification');
    let data = { message: message }
    notify.MaterialSnackbar.showSnackbar(data);

}
</script>
<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}
</style>
