

$(document).ready(function() {

    var map = L.map('map').setView([38.2, -96], 5);

    // add a button to display select mode
    var areaSelect = L.areaSelect({width:150, height:150});
    areaSelect.addTo(map);
    L.easyButton('fa-map-o', function(btn, lmap){
        toggle_select_mode(areaSelect);
    }).addTo( map );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    areaSelect.on("change",function() {
    	elements = $("div[class^='leaflet-areaselect']");
	if (elements[0].style.display != 'none') {
	    var bounds = this.getBounds();

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
    });
});


function toggle_select_mode(areaSelect){
    elements = $("div[class^='leaflet-areaselect']");
    if (elements[0].style.display == 'none') {
        // enable select mode
	elements[0].style.display = '';
    }
    else {
        // disable select mode
	elements[0].style.display = 'none';
    }
}

