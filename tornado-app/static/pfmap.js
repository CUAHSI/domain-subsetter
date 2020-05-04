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
}); 
