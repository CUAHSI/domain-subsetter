var Map = {}
$(document).ready(function() {


    var map = L.map('map').setView([38.2, -96], 5);
    Map.map = map;
    Map.hucbounds = [];
    Map.buffer = 20;
    Map.hucselected = false;
    Map.huclayers = [];
    Map.bbox = [99999999,
                99999999,
                -99999999,
                -99999999];


    update_lcc_bounds(["99999999",
                       "99999999",
                       "-99999999",
                       "-99999999"]);

    box = validate_bbox_size()
    toggle_submit_button(box.is_valid);
    

//    // add a button to display select mode
//    var areaSelect = L.areaSelect({width:150, height:150});
//    areaSelect.addTo(map);
//    Map.areaSelect = areaSelect;

//    toggle_select_mode(areaSelect);
//    L.easyButton('fa-map-o', function(btn, lmap){
//        toggle_select_mode(areaSelect);
//    }).addTo( map );

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

//    areaSelect.on("change", function(){
//        var bounds = this.getBounds();
//	    update_bbox(bounds);
//	    check_area(bounds);
//    });

    map.on("click", function(e){
        clickHandler(e);
        
        
    });

});


/**
* Queries the global bounding box for a list of hucs ids
* @param {array} hucids - HUC ids to query the bounding box for
* @returns {array} - bounding box for all hucID in the Spherical Lambert Confromal Conic SRS
*/
function getLccBounds(hucs) {

    console.log(JSON.stringify(hucs));
    var ajax = $.ajax({
        url: 'http://subset.cuahsi.org:8080/wbd/gethucbbox/lcc',
        type: 'GET',
        contentType: "text/plain; charset=UTF-8",
        data: {'hucID' : hucs.join(",")},
        success: function (response) {

            // save the calculated bbox in LCC coordinates
            lcc_bbox = JSON.parse(response).bbox;

            // update the global lcc bbox that will be used to submit the subsetting job
            update_lcc_bounds(lcc_bbox);

        },
        error: function(error) {
            console.log('error querying bounding box');
        }
    });

}

function clickHandler(e) {

    // exit early if not zoomed in enough
    var zoom = e.target.getZoom();
    if (zoom < 11){
        return
    }

    // mark the huc as selected. This will allow the bbox to be drawn
    Map.hucselected = true;

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
            res = parseWfsXML(response);

            // toggle bounding box
            if (res.hucid in Map.hucbounds)
            {
                // remove huc from list if it's already selected
                delete Map.hucbounds[res.hucid];
            }
            else{
                // add huc to list of it's not selected
                Map.hucbounds[res.hucid] = res.bbox;
            }
            // update the boundaries of the global bbox
            updateMapBBox();

            // retrieve the LCC coordinate for this bounding box
            hucs = [];
            for (key in Map.hucbounds){
                hucs.push(key);
            }
            getLccBounds(hucs);

        },
        error: function (response) {
            alert('An error was encountered while retrieving shape metadata.');
        }

    });
}

/**
* Calculates and draws the bounding box on the map.
*/
function updateMapBBox() {

    // calculate global boundary
    xmin = 9999999;
    ymin = 9999999;
    xmax = -9999999;
    ymax = -9999999;
    for (var key in Map.hucbounds) {
        bounds = Map.hucbounds[key].getBounds();
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

    // save the map bbox
    Map.bbox = [xmin, ymin, xmax, ymax];
    
        
    // remove the bbox layer if it exists
    if ('BBOX' in Map.huclayers) {
        // remove the polygon overlay 
        Map.huclayers['BBOX'].clearLayers();
        delete Map.huclayers['BBOX'];
    }

    // redraw the bbox layer with new coordinates
    var coords = [[[xmin, ymin],
                   [xmin, ymax],
                   [xmax, ymax],
                   [xmax, ymin],
                   [xmin, ymin]]];
    var polygon = [{
        "type": "Polygon",
        "coordinates": coords
    }];

    // todo: add function to validate bbox and return back styling
    // check bbox area bounds
    bbox = validate_bbox_size();

    // todo: create bbox validation function
    toggle_submit_button(bbox.is_valid)

    var json_polygon = L.geoJSON(polygon, {style: bbox.style });
    
    // save the layer
    Map.huclayers['BBOX'] = json_polygon;
    
    json_polygon.addTo(Map.map);

    return bbox.is_valid
}


/**
* Toggles HUC boundaries on the map, on/off.
* @param {string} hucID - ID of the huc to toggle
* @param {array} ptlist - vertices of the HUC polygon
*/
function togglePolygon(hucID, ptlist){

    if (hucID in Map.huclayers) {
        // remove the polygon overlay 
        Map.huclayers[hucID].clearLayers();
        delete Map.huclayers[hucID];
    }
    else {
        // create polygon overlay
        var coords = [];
        for (i=0; i<=ptlist.length-1; i+=2){
            coords.push([parseFloat(ptlist[i]),
                         parseFloat(ptlist[i+1])
                         ]);
        }
        var coordinates = [coords];
        var polygon = [{
            "type": "Polygon",
            "coordinates": coordinates
        }];
        var json_polygon = L.geoJSON(polygon, {style: {fillColor: 'blue'}});
    
        // save the layer
        Map.huclayers[hucID] = json_polygon;
    
        json_polygon.addTo(Map.map);
    }

}


/**
* Parses XML returned from a web feature service
* @param {object} xml - xml response from WFS service.
* @returns {object} - ID and bounding box rectangle of the HUC polygon
*/
function parseWfsXML(xml){
    var data = xml.getElementsByTagName('wfs:member')[0].firstElementChild;

    // get geometry
    var points = data.getElementsByTagName('gml:posList')[0];
    var hucID = data.getElementsByTagName('US_WBD_HUC_WBD:HUC12')[0].innerHTML;
    var ptlist = points.innerHTML.split(' ');

    // select the layer
    togglePolygon(hucID, ptlist);


    // calculate bounding box
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
    var bounds =  L.rectangle([  [ulat, ulon], [llat,llon]]);
    var r = [];
    r['hucid'] = hucID;
    r['bbox'] = bounds;
    return r
    
}


function update_lcc_bounds(lcc_bbox) {

     // add bounding box to input boxes
     $('#llon').val(lcc_bbox[0]);
     $('#llat').val(lcc_bbox[1]);
     $('#ulon').val(lcc_bbox[2]);
     $('#ulat').val(lcc_bbox[3]);
}

function get_lcc_bounds() {
    bnds = [$('#llon').val(),
            $('#llat').val(),
            $('#ulon').val(),
            $('#ulat').val()];
    return bnds;
}

function toggle_submit_button(is_valid){

    if (is_valid) { 
        // disable submit button bc nothing is selected
	    $('#btn-subset-submit').prop( "disabled", false);
    } else {
        // enable submit button 
	    $('#btn-subset-submit').prop( "disabled", true );
    }
}


/**
* Validates that size constraints for the subset bounding box
* @returns {object} - bounding box style and is_valid flag
*/
function validate_bbox_size(){

    // todo: turn the bounding box red and deactivate the submit button.
    bbox = Map.bbox;
   
    londiff = Math.abs(bbox[2] - bbox[0]);
    latdiff = Math.abs(bbox[3] - bbox[1]);

    sqr_deg = londiff * latdiff;

    console.log(sqr_deg);

    valid = true; 
    if ((bbox.includes(99999999) || bbox.includes(-99999999))) { 
        valid = false;
    }

    if (sqr_deg < 4 && valid) {
        style = {
                 fillColor: 'black',
                 weight: 2,
                 opacity: 1,
                 color: 'green',
                 fillOpacity: 0.01,
                 lineJoin: 'round'
        };

    } else {

        style = {
                 fillColor: 'black',
                 weight: 2,
                 opacity: 1,
                 color: 'red',
                 fillOpacity: 0.01,
                 lineJoin: 'round'
        };
        valid = false;
    }
    return {style:style, is_valid:valid}
}


