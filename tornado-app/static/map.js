$(document).ready(function() {

    var map = L.map('map').setView([38.2, -96], 5);

    // add a button to display select mode
    var areaSelect = L.areaSelect({width:150, height:150});
    areaSelect.addTo(map);
    toggle_select_mode(areaSelect);
    L.easyButton('fa-map-o', function(btn, lmap){
        toggle_select_mode(areaSelect);
    }).addTo( map );

    // Initial OSM tile layer
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // WMS LAYER
    url = 'http://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WmsServer?'
    var huc10 = L.tileLayer.wms(url, {
        layers: 0,
	transparent: 'true',
	format: 'image/png',
	minZoom:9,
	maxZoom:14
    }).addTo(map);
    var huc4 = L.tileLayer.wms(url, {
        layers: 1,
    transparent: 'true',
    format: 'image/png',
    minZoom:6,
    maxZoom:10
    }).addTo(map);
    var huc2 = L.tileLayer.wms(url, {
        layers: 2,
    transparent: 'true',
    format: 'image/png',
    minZoom:0,
    maxZoom:7
    }).addTo(map);

    areaSelect.on("change", function(){
        var bounds = this.getBounds();
	    update_bbox(bounds);
	    check_area(bounds);
    });

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
	check_area(bounds);
        update_bbox(bounds);
    }
    else {
        // disable select mode
	elements[0].style.display = 'none';
	$('#btn-subset-submit').prop( "disabled", true );
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
	$('#btn-subset-submit').prop( "disabled", true );
    } else {
	var color = 'black';

    	elements = $("div[class^='leaflet-areaselect']");
        if (elements[0].style.display != 'none') {
            $('#btn-subset-submit').prop( "disabled", false);
	}
    }

    var layers=$("div[class^='leaflet-areaselect-shade']");
    for (i = 0; i < layers.length; i++) {
        layers[i].style.background=color;
        layers[i].style.opacity=0.4;
    }
}


