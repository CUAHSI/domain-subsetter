
// run after page load
document.addEventListener('DOMContentLoaded', function() {

    // get the dialog element on the page
    var dialog = document.querySelector('dialog');
//    var showDialogButton = document.querySelector('#show-dialog');
   
    // add event handlers 
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    
//    showDialogButton.addEventListener('click', function() {
//      dialog.showModal();
//    });
    
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    // show the dialog box at startup
    dialog.showModal();
}, false);

