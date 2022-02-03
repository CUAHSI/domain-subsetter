
/**
* Functions that will load after the page is fully rendered
*/
$(window).bind("load", function() {

    var btn_hs_save = document.getElementById('btn-hs-save');
    btn_hs_save.disabled = true;

});

function validate() {
    // activates/deactivates the submit button based on the
    // content of the HydroShare input fields.

    document.getElementById('btn-hs-save').disabled = 
	document.getElementById('hs-title').value.length < 1 ||
	document.getElementById('hs-keywords').value.length < 1 ||
	document.getElementById('hs-abstract').value.length < 1;
}












