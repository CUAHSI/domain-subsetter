/*
 * Extra functions for the ParFlow Map
 * This script uses code provided by https://github.com/turban/Leaflet.Mask
*/

$(window).bind("load", function() {
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


// coords of PF-CONUS v1.0 domain
latLngs = [];
latLngs.push(new L.LatLng(48.1551, -121.4645));
latLngs.push(new L.LatLng(49.0960, -76.0881));
latLngs.push(new L.LatLng(32.3885, -80.4493));
latLngs.push(new L.LatLng(31.6462, -115.9740 ));
latLngs.push(new L.LatLng(48.1551, -121.4645));
L.mask(latLngs).addTo(Map.map);


///*
// * Add Menu Button
// */
//var menu = L.easyButton('fa-2x fa-bars', function (){toggleMenu();},
//			{position: 'topright'}).addTo(Map.map);
//menu.button.style.width = '40px';
//
///*
// * Add Submit Button
// */
//var btn = '<div id=submit-btn><strong>SUBMIT</strong></div>';
//var btn_submit = L.easyButton(btn,
//	 		     function (){submit();},
//	 		     {position: 'bottomright'}).addTo(Map.map);
//btn_submit.button.style.width = '100px';
//btn_submit.disable();
//// save this button so it can be accessed from other functions
//Map.submit = btn_submit;
//
//
//}); 
//
//function toggleMenu() {
//    var accordion = document.querySelector('#accordion');
//    var panel = document.querySelector('#menu-panel');
//    accordion.MaterialExtAccordion.command( {action: 'toggle', target: panel} );
//}
//
//function submit() {
//
//    document.getElementById('form-submit').submit();
//
//}
