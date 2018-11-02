var Map = {}
$(document).ready(function() {

    var map = L.map('map').setView([38.2, -96], 5);
    Map.map = map;

    // add a button to display select mode
    var areaSelect = L.areaSelect({width:150, height:150});
    areaSelect.addTo(map);
    Map.areaSelect = areaSelect;

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

    // HUC WMS Naming
    // --------------
    // HUC12_US: 0
    // HUC10_US: 1
    // HUC_4_US: 2
    // HUC2_US: 3
    // --------------

    // HUC 2 Layer
    var huc2 = L.tileLayer.wms(url, {
        layers: 3,
        transparent: 'true',
        format: 'image/png',
        minZoom:0,
        maxZoom:7
    }).addTo(map);
    
    // HUC 4 Layer
    var huc4 = L.tileLayer.wms(url, {
        layers: 2,
        transparent: 'true',
        format: 'image/png',
        minZoom:6,
        maxZoom:10
    }).addTo(map);

    // HUC 10 Layer
    var huc10 = L.tileLayer.wms(url, {
        layers: 1,
	    transparent: 'true',
    	format: 'image/png',
    	minZoom:9,
    	maxZoom:14
    }).addTo(map);
  
    // HUC 12 Layer
    var huc12 = L.tileLayer.wms(url, {
        layers: 0,
        transparent: 'true',
        format: 'image/png',
        minZoom:11,
        maxZoom:19
    }).addTo(map);

    areaSelect.on("change", function(){
        var bounds = this.getBounds();
	    update_bbox(bounds);
	    check_area(bounds);
    });

    map.on("click", clickHandler);

});

function clickHandler(e) {

    // exit early if not zoomed in enough
    var zoom = e.target.getZoom();
    if (zoom < 11){
        return
    }

    var clickBounds = L.latLngBounds(e.latlng, e.latlng);
  
    var defaultParameters = {
        service : 'WFS',
        request : 'GetFeature',
        bbox: e.latlng.lng+','+e.latlng.lat+','+e.latlng.lng+','+e.latlng.lat,
        typeName : 'HUC_WBD:HUC12_US',
        SrsName : 'EPSG:4326'
    };
    var root='https://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WFSServer';
    var parameters = L.Util.extend(defaultParameters);
    var URL = root + L.Util.getParamString(parameters);

    var ajax = $.ajax({
        url: URL,
        success: function (response) {
            parseWfsXML(response);
        },
        error: function (response) {
            alert('An error was encountered while retrieving shape metadata.');
        }

    });
}

function parseWfsXML(xml){
    var data = xml.getElementsByTagName('wfs:member')[0].firstElementChild;

    // get geometry
    var points = data.getElementsByTagName('gml:posList')[0];
    var ptlist = points.innerHTML.split(' ');
    var llat = 100000;
    var ulat = -100000;
    var llon = 100000;
    var ulon = -100000;
    for (var i=1; i<ptlist.length; i+=2) {
        lat = ptlist[i];
        if (lat > ulat){
            ulat = lat;
        }
        else if (lat < llat) {
            llat =  lat;
        }
    }
    for (var i=0; i<ptlist.length; i+=2) {
        lon = ptlist[i];
        if (lon > ulon){
            ulon = lon;
        }
        else if (lon < llon) {
            llon =  lon;
        }
    }

    var bounds = Map.areaSelect.getBounds();
    var bounds =  L.rectangle([  [ulat, ulon], [llat,llon]]);
    var width = Map.map.latLngToLayerPoint(bounds.getBounds().getNorthEast()).x - 
                Map.map.latLngToLayerPoint(bounds.getBounds().getSouthWest()).x  +
                10; // padding  
    var height = Map.map.latLngToLayerPoint(bounds.getBounds().getSouthWest()).y - 
                 Map.map.latLngToLayerPoint(bounds.getBounds().getNorthEast()).y + 
                 10; // padding

    var midx = Map.map.latLngToLayerPoint(bounds.getBounds().getSouthWest()).x + width/2;
    var midy = Map.map.latLngToLayerPoint(bounds.getBounds().getNorthEast()).y + height/2;
    point = {};
    point.x = midx;
    point.y = midy;
    var centroid = Map.map.layerPointToLatLng(point);
    

    dims = {}
    dims.height = height;
    dims.width = width;
    Map.areaSelect.setDimensions(dims);
    Map.map.panTo(centroid);
//    update_bbox(b);
//	check_area(b);

}

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


