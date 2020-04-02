
/**
* Functions that will load after the page is fully rendered
*/
$(window).bind("load", function() {

    var button = document.querySelector('#btn-hs-save-dialog');
    var dialog = document.querySelector('#dialog-hs');
    var btn_dialog_close = document.querySelector('#btn-hs-close');
    var btn_hs_save = document.querySelector('#btn-hs-save');
   
    // handler for modal open
    button.addEventListener('click', function() {
        dialog.showModal();
    });
    
    // Handler for modal close
    btn_dialog_close.addEventListener('click', function() {
        dialog.close()
    });
   
    // Handler for model submit
    btn_hs_save.addEventListener('click', function() {
        dialog.close()
	title = document.getElementById('hs-res-title').value;
	guid = document.getElementById('guid').value;
	console.log(title + ' ' + guid);

    
    });
    
});

function res_title_entered(){
    var text = document.getElementById("hs-res-title").value.trim();
    // check to see if the title contains text
    if (text.length > 0) {
	// activate button
	document.getElementById("btn-hs-save").disabled = false;
    } else {
	// deactivate button
	document.getElementById("btn-hs-save").disabled = true;
    }
}











