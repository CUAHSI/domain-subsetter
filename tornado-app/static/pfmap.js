// credits: https://github.com/turban/Leaflet.Mask
//
document.addEventListener("DOMContentLoaded", function(){
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



//// transform geojson coordinates into an array of L.LatLng
//var coordinates = usa.features[0].geometry.coordinates;
////for(j=0; j<coordinates.length; j++) {
//for(j=164; j<165; j++) {
//    console.log(j +': '+ coordinates[j][0].length);
//    var latLngs = [];
//    for (i=0; i<coordinates[j][0].length; i++) {
//        latLngs.push(new L.LatLng(coordinates[j][0][i][1], coordinates[j][0][i][0]));
//    }
//
//   L.mask(latLngs).addTo(Map.map);
//}

}); 
