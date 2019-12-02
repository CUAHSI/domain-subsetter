var Map = {}

/**
 * Functions that will load after the page is fully rendered
 */
$(window).bind("load", function() {

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


    /*
     * LEAFLET BUTTONS
     */


    // Erase
    L.easyButton('fa-eraser',
                 function (){clearSelection();},
                 'clear selected features').addTo(map);


    L.control.mousePosition({
        prefix:"Lat Long: ",
        separator:", "}).addTo(map);

    // Menu Button
//    var btn = '<span id=menu-btn class="fa fa-2x fa-bars"></i>'
    var btn = '<div id=menu-btn><strong>MENU</strong></div>';
    var menu = L.easyButton(btn, function (){toggleMenu();},
                         {position: 'topright'}).addTo(Map.map);
    menu.button.style.width = '80px';

    // Submit Button
    var btn = '<div id=submit-btn><strong>SUBMIT</strong></div>';
    var btn_submit = L.easyButton(btn,
	                          function (){submit();},
	                          {position: 'bottomright'}).addTo(Map.map);
    btn_submit.button.style.width = '100px';
    // save this button so it can be accessed from other functions
    Map.submit = btn_submit;

   // Layer Control
   L.control.layers(null, mixed).addTo(map);

    /*
     * LEAFLET EVENT HANDLERS
     */
    map.on("click", function(e){
        mapClick(e);        
    });

  /**
  * ADD - HUC TABLE - OPEN
  * Open dialog for adding HUC to table
  */
  document.getElementById("add-huc").onclick = function() {
    console.log('add huc');

    // show the dialog
    document.getElementById('addContentDialogTemplate').style.display = "";
  };
    
  /**
  * ADD - HUC TABLE -SUBMIT
  * Cancels the add HUC dialog
  */
  document.getElementById("add-huc-submit").onclick = function() {
    console.log('huc submit')
    
    // get the content value
    huc = document.getElementById('content').value;
   
    // check for 12-digit string match (i.e. HUC 12)
    var re = /\d{8,12}/;
    var match = huc.match(re);
    if (match) {

      // add this feature to the map
      addFeatureByHUC(huc)

    } else {

        // display error notification
        var message = 'Error: HUCs must contain only 8-12 numeric characters';
        notify(message);
    }
    
    // hide the dialog
    document.getElementById('content').value = '';
    document.getElementById('addContentDialogTemplate').style.display = "none";
  }
    
   /**
    * ADD - HUC TABLE - CANCEL
    * Submits the add HUC dialog and applies the result to the table
    */
    document.getElementById("add-huc-cancel").onclick = function() {
        console.log('huc cancel')
    
        // clear and hide the dialog
        document.getElementById('content').value = '';
        document.getElementById('addContentDialogTemplate').style.display = "none";
    }
    
    /**
    * REMOVE - HUC TABLE - OPEN
    * Opens dialog for removing HUC from to table
    */
    document.getElementById("rm-huc").onclick = function() {

      // check if items are selected
      if ($('#huc-table').find('label').hasClass('is-checked')) {
        // show the dialog
        document.getElementById('rmContentDialogTemplate').style.display = "";
      } else { 
        var message = 'No rows have been selected for removal';
        notify(message);
      }
    };

    /**
    * REMOVE - HUC TABLE - CANCEL
    * Cancels the rm HUC dialog
    */
    document.getElementById("rm-huc-cancel").onclick = function() {
        console.log('huc cancel')
    
        // clear and hide the dialog
        document.getElementById('rmContentDialogTemplate').style.display = "none";
    }

    /**
    * REMOVE - HUC TABLE - SUBMIT
    * submits selected HUCs within the table for removal
    */
    document.getElementById("rm-huc-submit").onclick = function() {
        
        var hucs_to_remove = [];
        // remove items from table
        var table = document.getElementById("huc-table");
        var labels = $('#huc-table tbody tr label');
        for (var i=labels.length-1; i>=0; i--) {
            if (labels[i].classList.contains('is-checked')) {
                var hucid =$('#huc-table tbody tr td')[i*3 +1].innerHTML;
                
                // remove the huc from the table
                table.deleteRow(i);
                
                // toggle the polygon off                
                togglePolygon(hucid, []);

                // remove huc from internal list of features
                delete Map.hucbounds[hucid];
            }
        } 

        // update the boundaries of the global bbox
        updateMapBBox();
        hucs = [];
        for (key in Map.hucbounds){
            hucs.push(key);
        }
        getLccBounds(hucs);
        
        // clear and hide the dialog
        document.getElementById('rmContentDialogTemplate').style.display = "none";
    }
   
    // validate the map
    box = validate_bbox_size()
    toggle_submit_button(box.is_valid);
});


/* 
 * LEAFLET HANDLERS 
 */


function toggleMenu() {
    var accordion = document.querySelector('#accordion');
    var panel = document.querySelector('#menu-panel');
    accordion.MaterialExtAccordion.command( {action: 'toggle', target: panel} );
}
function submit() {
    document.getElementById('form-submit').submit();
}

function clearHucTable() {
 // Removes all rows from the HUC table

    var table = document.getElementById("huc-table");
    var rows  = $('#huc-table tbody tr');
    for (var i=rows.length-1; i>=0; i--) {
        table.deleteRow(i);
    }
}

function mapClick(e) {

    /*
    * The event handler for map click events
    * @param {event} e - a map mouse click event
    * @returns - null
    */

    // exit early if not zoomed in enough.
    // this ensures that objects are not clicked until zoomed in
    var zoom = e.target.getZoom();
    if (zoom < Map.selectable_zoom){
        return
    }

    // mark the huc as selected.
    // this will allow the bbox to be drawn.
    Map.hucselected = true;

    // get the latitude and longitude of the click event.
    // use this data to query ArcGIS WFS for the selected HUC object.
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
    
    // load the map and table elements async
    toggleHucsAsync(URL, true, null);
}


/*
 * HUC TABLE FUNCTIONS
 */


function addHucRow(huc_value) {
 // Adds new rows to the HUC table

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

function rmHucRow(row_id) {
 // Removes a row from the HUC table
  if (row_id >= 0) {
    var table = document.getElementById("huc-table");
    table.deleteRow(row_id);
  }

}

function getRowIdByName(huc_value) {
 // Gets the row id for a given huc value
 // Returns: index of the matching row, -999 if it doesn't exist in the table

  var row = $("#huc-table > tbody > tr:contains('"+huc_value+"')");
  if (row.length == 0) {
    return -999;
  } else {
    return row[0].rowIndex;
  }
}

function getRowByName(huc_value) {
 // Gets the row object for a given huc value
 // Returns: the row object or -999 if it doesn't exist

  var row = $("#huc-table > tbody > tr:contains('"+huc_value+"')");
  if (row.length == 0) {
    return -999;
  } else {
    return row[0];
  }
}


function clearSelection() {
 // Clears the selected features on the map
    
    for (var key in Map.hucbounds) {

        // clear the huc boundary list
        delete Map.hucbounds[key];
        
        // clear the polygon overlays
        Map.huclayers[key].clearLayers();
        delete Map.huclayers[key];

        // clear the hucs in the html template

    }

    // clear the HUC table
    clearHucTable();

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

function addFeatureToMap(feature) {

    // toggle bounding box
    if (feature.hucid in Map.hucbounds)
    {
        // remove huc from list if it's already selected
        delete Map.hucbounds[feature.hucid];

        // add huc ID to the table
        var row_id = getRowIdByName(feature.hucid)
        rmHucRow(row_id);

    }
    else{
        // add huc to list of it's not selected
        Map.hucbounds[feature.hucid] = feature.bbox;

        // remove huc ID from the table
        addHucRow(feature.hucid);
    }
    // update the boundaries of the global bbox
    updateMapBBox();

    // retrieve the LCC coordinate for this bounding box
    hucs = [];
    for (key in Map.hucbounds){
        hucs.push(key);
    }
    getLccBounds(hucs);
}

/**
* adds features to the map by HUC id using WFS:GetFeature
* @param {string} hucid - a single HUC ids to query
* @returns - null
*/
function addFeatureByHUC(hucid) {

    var remove = null;
    if (hucid.length < 12) {
        hucid += '*';
        console.log(hucid);
        filter = "<ogc:Filter><ogc:PropertyIsLike wildCard=\"*\"><ogc:PropertyName>HUC12</ogc:PropertyName><ogc:Literal>"+hucid+"</ogc:Literal></ogc:PropertyIsLike></ogc:Filter>"
        
        // add the huc row b/c this could take a while
        // and we want the user to know that the HUCs are
        // being queried. 
        // this huc will need to be removed since it's not 12 digits.
        addHucRow(hucid);
        remove = hucid;
    }
    else if(hucid.length == 12) {
        filter = "<ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>HUC12</ogc:PropertyName><ogc:Literal>"+hucid+"</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter>"
    }
    else {
        return;
    }

    var defaultParameters = {
        service : 'WFS',
        request : 'GetFeature',
        typeName : 'HUC_WBD:HUC12_US',
        SrsName : 'EPSG:4326',
        Filter : filter
    };
    var root='https://arcgis.cuahsi.org/arcgis/services/US_WBD/HUC_WBD/MapServer/WFSServer';
    var parameters = L.Util.extend(defaultParameters);
    var URL = root + L.Util.getParamString(parameters);
    console.log(URL);

    // load the map and table elements async
    toggleHucsAsync(URL, false, remove);

}

function toggleHucsAsync(url, remove_if_selected, remove) {

    // call the ArcGIS WFS asyncronously so that the webpage doesn't freeze.
    var ajax = $.ajax({
        url: url,
        success: function (response) {

            // extract the HUC ID and Boundary from the WFS XML response.
            // only process the first element of the response since the user can only
            // select a single map element at a time.
            selected_hucs = parseWfsXML(response);
                
            for (i = 0; i < selected_hucs.length; i ++) {
                try {
                    var res = selected_hucs[i];

                    // toggle bounding box using the following rules:
                    // 1. if the object is already selected, remove it from the 
                    //    map and the table.
                    // 2. if the object is not selected, add it to the map and
                    //    add it to the table.

                    if (res.hucid in Map.hucbounds)
                    {
                        // remove only if explicitly specified to.
                        // this is because the "ADD" dialog should never
                        // remove features, unlike the map click event.
                        if (remove_if_selected) {
                            delete Map.hucbounds[res.hucid];
                            var row_id = getRowIdByName(res.hucid)
                            rmHucRow(row_id);
                            togglePolygon(res.hucid, res.geom);
                        }
                    }
                    else{
                        Map.hucbounds[res.hucid] = res.bbox;
                        addHucRow(res.hucid);
                        togglePolygon(res.hucid, res.geom);
                    
						// add a 'success' message for this table entry
                        var row = getRowByName(res.hucid);
                        var elem = row.getElementsByTagName('td')[2]
                        elem.innerText = 'Loaded';
                        elem.style.color = 'green';
                    }
                } catch(err) {
                    // if there was an error adding the HUC,
                    // add an error message in the table
                    var row = getRowByName(hucid);
                    var elem = row.getElementsByTagName('td')[2]
                    elem.innerText = 'Error';
                    elem.style.color = 'red';
                }
                // refresh page
                $('#huc-table-div').hide().show(0);
                $('#map').hide().show(0);
            }

            // update the boundaries of the global bbox.
            // this is all that we really care about when the
            // subset job is submitted.
            // retrieve the LCC coordinate for this bounding box
            hucs = [];
            updateMapBBox();
            for (key in Map.hucbounds){
                hucs.push(key);
            }
            getLccBounds(hucs);

			// update the hucs list 
			// this is used to create a shapefile
			// that is exported along with the subset
			update_huc_ids(hucs);
			
			
            // remove the specified id
            if (remove != null) {
                var rid = getRowIdByName(remove);
                if (rid != -999) {
                    rmHucRow(rid);
                }
            }


        },
        error: function (response) {
            // if there was an error calling the ArcGIS WFS,
            // add an error message in the table
            var row = getRowByName(hucid);
            var elem = row.getElementsByTagName('td')[2]
            elem.innerText = 'Server Error';
            elem.style.color = 'red';
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
        for (c=0; c<=ptlist.length-1; c+=2){
            coords.push([parseFloat(ptlist[c]),
                         parseFloat(ptlist[c+1])
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
    var response = [];
    var hucs = xml.getElementsByTagName('wfs:member');
    var llat = 100000;
    var ulat = -100000;
    var llon = 100000;
    var ulon = -100000;
    for (hid = 0; hid < hucs.length; hid ++) {

        var data = hucs[hid];
    
        // get geometry
        var points = data.getElementsByTagName('gml:posList')[0];
        var hucID = data.getElementsByTagName('US_WBD_HUC_WBD:HUC12')[0].innerHTML;
        var ptlist = points.innerHTML.split(' ');
    
        // calculate bounding box
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
        r['geom'] = ptlist;
        response.push(r);
    }
    return response;
}

function update_huc_ids(huclist) {

	// convert huc array into csv string
	var hucs = huclist.join(",");

	// set the #hucs hidden field in the html template
	// using jquery
	$('#hucs').val(hucs);

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
//        // disable submit button bc nothing is selected
//        $('#btn-subset-submit').prop( "disabled", false);
	Map.submit.enable();
    } else {
//        // enable submit button 
//        $('#btn-subset-submit').prop( "disabled", true );
	Map.submit.disable();
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
