/*
 * Extra functions for the ParFlow Map
 * This script uses code provided by https://github.com/turban/Leaflet.Mask
*/

$(window).bind("load", function() {

    // Layers are added to the map by referencing the object created in
    // map.js: Map.map. Currently there is no other way to access the
    // leaflet map object: see https://stackoverflow.com/questions/27351067/find-leaflet-map-objects-present-on-page-without-a-variable-reference

    // mask the entire map 
    L.Mask = L.Polygon.extend({
	options: {
	    stroke: false,
	    color: '#333',
	    fillOpacity: 0.5,
	    clickable: true,
	    outerBounds: new L.LatLngBounds([-90, -360], [90, 360])
	},

	initialize: function (latLngs, options) {
        
        var outerBoundsLatLngs = [
            this.options.outerBounds.getSouthWest(),
            this.options.outerBounds.getNorthWest(),
            this.options.outerBounds.getNorthEast(),
            this.options.outerBounds.getSouthEast()
        ];
        L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latLngs], options);  
	},
    });

    L.mask = function (latLngs, options) {
    return new L.Mask(latLngs, options);
    };


    // unmask the valid bbox for pfconus 1
    // coords of PF-CONUS v1.0 domain
    latLngs = [];
    latLngs.push(new L.LatLng(48.1551, -121.4645));
    latLngs.push(new L.LatLng(49.0960, -76.0881));
    latLngs.push(new L.LatLng(32.3885, -80.4493));
    latLngs.push(new L.LatLng(31.6462, -115.9740 ));
    latLngs.push(new L.LatLng(48.1551, -121.4645));
    L.mask(latLngs).addTo(Map.map);

//    dialog = document.querySelector('dialog');
//    dialog.close();

    $.ajax({
        url: '/hfisauthenticated',
        async: true,
        success: function(response) {
            updateSubmitButtonGroup(response);
            updateHFLogo(response);
        },
        error: function(response) {
            console.log('error checking HF authentication');
        }
	});



   });

function hydroframe_submit() {
    alert('HydroFrame Submit')
//    document.getElementById('form-submit').submit();
}

function updateHFLogo(authData){
   if (authData['authenticated'] == true) {
       $('#hf-logo-logged-in').show();
   } else {
       $('#hf-logo-logged-in').hide();
   }

}
function updateSubmitButtonGroup(authData){

   if (authData['authenticated'] == true) {

        // add HF SUBMIT button 
        // this is hacky but I need to refresh the easyBar and the only way that I can
        // figure out is to remove and recreate it.
        Map.submit.remove()
        
        // Submit Button
        var btn_submit = L.easyButton('<div id=submit-btn><strong>SUBMIT</strong></div>',
                                      function (){submit();},
                                      {id: 'submit'});
        btn_submit.button.style.width = '150px';
        
        var btn_hfsubmit = L.easyButton('<div class=btn-submit id=hf-submit-btn><strong>HydroFrame Submit</strong></div>',
        function (){hydroframe_submit();},
        {id: 'hf-submit'});
        btn_hfsubmit.button.style.width = '150px';
        
        var submit_group = L.easyBar([btn_submit, btn_hfsubmit],
                                     {position: 'bottomright',
                                      id: 'submit-button-group'}).addTo(Map.map);
        
        // save this button so it can be accessed from other functions
        Map.submit = submit_group;
    }
    else if (Map.submit._buttons.length > 1) {
        // this is hacky but I need to refresh the easyBar and the only way that I can
        // figure out is to remove and recreate it.
        Map.submit.remove()
        
        // Submit Button
        var btn_submit = L.easyButton('<div id=submit-btn><strong>SUBMIT</strong></div>',
                                      function (){submit();},
                                      {id: 'submit'});
        btn_submit.button.style.width = '150px';
        
        var submit_group = L.easyBar([btn_submit],
                                     {position: 'bottomright',
                                      id: 'submit-button-group'}).addTo(Map.map);
        
        // save this button so it can be accessed from other functions
        Map.submit = submit_group;
    }
}
