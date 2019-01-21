var Map = {}
$(document).ready(function() {


    var map = L.map('map').setView([38.2, -96], 5);
    Map.map = map;
    Map.hucbounds = [];
    Map.buffer = 20;
    Map.hucselected = false;
    Map.huclayers = [];
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


    update_lcc_bounds(["99999999",
                       "99999999",
                       "-99999999",
                       "-99999999"]);

    box = validate_bbox_size()
    toggle_submit_button(box.is_valid);
    

    
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
        layers: 4,
        transparent: 'true',
        format: 'image/png',
        minZoom:Map.huc2_min,
        maxZoom:Map.huc2_max
    }).addTo(map);
    
    // HUC 4 Layer
    var huc4 = L.tileLayer.wms(url, {
        layers: 3,
        transparent: 'true',
        format: 'image/png',
        minZoom:Map.huc4_min,
        maxZoom:Map.huc4_max
    }).addTo(map);
    

    // HUC 12 Layer
    var huc12 = L.tileLayer.wms(url, {
        layers: 0,
        transparent: 'true',
        format: 'image/png',
        minZoom:Map.huc12_min,
        maxZoom:Map.huc12_max
    }).addTo(map);

    // HUC 10 Layer
    var huc10 = L.tileLayer.wms(url, {
        layers: 1,
	    transparent: 'true',
   	format: 'image/png',
    	minZoom:Map.huc10_min,
    	maxZoom:Map.huc10_max
    }).addTo(map);
  
    // layer toggling
    var mixed = {
      "HUC 2": huc2,
      "HUC 4": huc4,
      "HUC 10": huc10,
      "HUC 12": huc12
   };

   // Add Layer-Controller
   L.control.layers(null, mixed).addTo(map);

    L.easyButton('fa-eraser',
                 function (){clearSelection();},
                 'clear selected features').addTo(map);

    map.on("click", function(e){
        clickHandler(e);        
    });

});


/**
 * Functions that will load after the page is fully rendered
 */
$(window).bind("load", function() {

  /**
  * Open dialog for adding HUC to table
  */
  document.getElementById("add-huc").onclick = function() {
    console.log('add huc');

    // show the dialog
    document.getElementById('addContentDialogTemplate').style.display = "";
  };
    
  /**
  * Cancels the add HUC dialog
  */
  document.getElementById("add-huc-submit").onclick = function() {
  	console.log('huc submit')
    
		// get the content value
    huc = document.getElementById('content').value;
   
    // check for 12-digit string match (i.e. HUC 12)
    var re = /\d{12}/;
    var match = huc.match(re);
    if (match) {
      // add huc to table
      addHucRow(huc);
	} else {
        // display error notification
        var message = 'Error: HUCs must contain exactly 12 numeric characters';
        notify(message);
    }
    
    // hide the dialog
    document.getElementById('content').value = '';
    document.getElementById('addContentDialogTemplate').style.display = "none";
  }
    
   /**
    * Submits the add HUC dialog and applies the result to the table
    */
    document.getElementById("add-huc-cancel").onclick = function() {
    	console.log('huc cancel')
    
    	// clear and hide the dialog
    	document.getElementById('content').value = '';
    	document.getElementById('addContentDialogTemplate').style.display = "none";
    }
    
    /**
    * Removes the selected HUC from the table
    */
    document.getElementById("rm-huc").onclick = function() {
    
    	var rows = $(".mdl-data-dynamictable tbody").find('tr.is-selected');
    	if (rows.length == 0) {
    		console.log('notify that rows need to be selected');
    	} else {
    		console.log('remove selected rows');
    	}
    }
    
   /**
    * Selects and deselects all rows when the header box is checked
    */
    $(document).on("click", "#checkbox-all", function() {
    	_isChecked = $(this).parent("label").hasClass("is-checked");
    	if (_isChecked === false) {
    		$(".mdl-data-dynamictable").find('tr').addClass("is-selected");
    		$(".mdl-data-dynamictable").find('tr td label').addClass("is-checked");
    	} else {
    		$(".mdl-data-dynamictable").find('tr td label').removeClass("is-checked");
    	}
    });
    
    
    
});

/** 
 * Adds new rows to the HUC table
 */
function addHucRow(huc_value) {

  // check if the id already exists in the table.
  // if it does, don't add it again
  existing_row_id = getRowIdByName(huc_value);
  if (existing_row_id != -999)
  { 
     return;
  }

  var table = document.getElementById('huc-table');
  var rid = table.rows.length;
  var chkid = 'chkbx' + rid;
  var row = table.insertRow(rid);

  var cell1 = row.insertCell(0);

  var lbl = document.createElement('label');
  lbl.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded';
  lbl.setAttribute('for', chkid);

  var chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.id = chkid;
  chk.className = 'mdl-checkbox__input';
  lbl.appendChild(chk);

  cell1.appendChild(lbl);

  var cell1 = row.insertCell(1);
  cell1.className = 'mdl-data-table__cell--non-numeric';
  cell1.innerHTML = huc_value;

  var cell2 = row.insertCell(2);
  cell2.innerHTML =  'Loading';


  componentHandler.upgradeAllRegistered();
}

/**
 * Removes a row from the HUC table
 */
function rmHucRow(row_id) {

  var table = document.getElementById("huc-table");
  table.deleteRow(row_id);

}

/** 
 * Gets the row id for a given huc value
 * Returns: index of the matching row, -999 if it doesn't exist in the table
 */
function getRowIdByName(huc_value) {

  var row = $("#huc-table > tbody > tr:contains('"+huc_value+"')");
  if (row.length == 0) {
    return -999;
  } else {
    return row[0].rowIndex;
  }
}

/**
 * Get the rows that are selected via checkbox
 */
function getSelectedRowsByChk() {

}

/** 
 * Clears the selected features on the map
*/
function clearSelection() {
    
    for (var key in Map.hucbounds) {

        // clear the huc boundary list
        delete Map.hucbounds[key];
        
        // clear the olygon overlays
        Map.huclayers[key].clearLayers();
        delete Map.huclayers[key];
    }
    // update the map
    updateMapBBox();
    getLccBounds([]);

    // clear and update the HUC textbox
    document.querySelector('.mdl-textfield').MaterialTextfield.change('');

}

/**
* Queries the global bounding box for a list of hucs ids
* @param {array} hucids - HUC ids to query the bounding box for
* @returns {array} - bounding box for all hucID in the Spherical Lambert Confromal Conic SRS
*/
function getLccBounds(hucs) {

    var ajax = $.ajax({
        url: document.URL + 'wbd/gethucbbox/lcc',
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


/**
* Queries the HUC feature by HUC id using WFS:GetFeature
* @param {string} hucid - a single HUC ids to query
* @returns - null
*/
function getFeatureByHUC(hucid) {


    var defaultParameters = {
        service : 'WFS',
        request : 'GetFeature',
        typeName : 'HUC_WBD:HUC12_US',
        SrsName : 'EPSG:4326',
        Filter : "<ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>HUC12</ogc:PropertyName><ogc:Literal>"+hucid+"</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>"
    };
    var root='https://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WFSServer';
    var parameters = L.Util.extend(defaultParameters);
    var URL = root + L.Util.getParamString(parameters);
    console.log(URL);

    var ajax = $.ajax({
        url: URL,
        success: function (response) {

	    // this also calls togglePolygon.
	    // todo: remove togglePolygon from parseWfsXML function
            res = parseWfsXML(response);
	    
            console.log('hello');

        }
    });
}

function clickHandler(e) {

    // exit early if not zoomed in enough
    var zoom = e.target.getZoom();
    if (zoom < Map.selectable_zoom){
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
//    console.log(URL);

    var ajax = $.ajax({
        url: URL,
        success: function (response) {

            // convert the XML response into something more useable 
            res = parseWfsXML(response);

            // toggle bounding box
            if (res.hucid in Map.hucbounds)
            {
                // remove huc from list if it's already selected
                delete Map.hucbounds[res.hucid];
		
                // add huc ID to the table
                var row_id = getRowIdByName(res.hucid)
                rmHucRow(row_id);

            }
            else{
                // add huc to list of it's not selected
                Map.hucbounds[res.hucid] = res.bbox;
	    
                // remove huc ID from the table
                addHucRow(res.hucid);
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
    // todo: remove togglePolygon from parseWfsXML function
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


/**
 * Displays a notification message at the bottom of the screen 
 * using this #notification element in base.html
 */
function notify(message) {
    var notify = document.querySelector('#notification');
    var data = {message: message}
    notify.MaterialSnackbar.showSnackbar(data);

}
