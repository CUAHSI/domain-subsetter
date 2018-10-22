

$(document).ready(function() {

    var map = L.map('map').setView([38.2, -96], 5);

    // add a button to display select mode
    var areaSelect = L.areaSelect({width:150, height:150});
    areaSelect.addTo(map);
    toggle_select_mode(areaSelect);
    L.easyButton('fa-map-o', function(btn, lmap){
        toggle_select_mode(areaSelect);
    }).addTo( map );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //WMS LAYER
        //the first section of code is a test to see if WMS is working, second section is the CUAHSI WMS 
    //var wmsLayer = L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
    //   layers: 'nasa:bluemarble'
    //}).addTo(map);
    
    url = 'https://arcgis.cuahsi.org/arcgis/services/NWM/nwm_app_data/MapServer/WmsServer?';
    var wmsLayer = L.tileLayer.wms(url, {
        layers: 1,
	transparent: 'true',
	format: 'image/png',
    }).addTo(map);
            

    areaSelect.on("change", function(){
        var bounds = this.getBounds();
	    update_bbox(bounds);
	    check_area(bounds);
    });

//    var lyrHUC2 = L.geoJSON.ajax('static/HUC2_Clipped_fewerAtt.geojson'
//               ).addTo(map); //{style:styleHUC2}, onEachFeature:processHUC2
//            lyrHUC2.on('data:loaded',function(){
//               map.fitBounds(lyrHUC2.getBounds());
//            });
//
//            function styleHUC2(json) {
//               var att = json.properties;
//               switch (att.type){
//                  case 'HUC2':
//                     return {color:'peru'};
//                     break;
//               }
//            }
});

function update_bbox(bounds) {
    elements = $("div[class^='leaflet-areaselect']");
    if (elements[0].style.display != 'none') {

        // calculate min and max lat and lon
        llat = Math.min(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
        ulat = Math.max(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
        llon = Math.min(bounds.getSouthWest().lng, bounds.getNorthEast().lng);
        ulon = Math.max(bounds.getSouthWest().lng, bounds.getNorthEast().lng);
    
        // add bounding box to input boxes
        $('#llat').val(llat);
        $('#ulat').val(ulat);
        $('#llon').val(llon);
        $('#ulon').val(ulon);
    }
}

function toggle_select_mode(areaSelect){
    elements = $("div[class^='leaflet-areaselect']");
    if (elements[0].style.display == 'none') {
        // enable select mode
        elements[0].style.display = '';
        
        var bounds = areaSelect.getBounds();
        update_bbox(bounds);
    }
    else {
        // disable select mode
	elements[0].style.display = 'none';
    }
}

function check_area(bounds){
    
    
    // calculate min and max lat and lon
    llat = Math.min(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
    ulat = Math.max(bounds.getSouthWest().lat, bounds.getNorthEast().lat);
    llon = Math.min(bounds.getSouthWest().lng, bounds.getNorthEast().lng);
    ulon = Math.max(bounds.getSouthWest().lng, bounds.getNorthEast().lng);

    var latdiff = Math.abs(ulat - llat);
    var londiff = Math.abs(ulon - llon);
    var degarea = latdiff + londiff;

    if (degarea > 4) {
	var color = 'red';
    } else {
	var color = 'black';
    }

    var layers=$("div[class^='leaflet-areaselect-shade']");
    for (i = 0; i < layers.length; i++) {
        layers[i].style.background=color;
        layers[i].style.opacity=0.4;
    }
}


