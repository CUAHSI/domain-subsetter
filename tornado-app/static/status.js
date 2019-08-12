
$(document).ready(function() {

    // get the guid, necessary to poll job status
    var guid = window.location.href.split('/').pop();

    // initial request so there isn't a polling delay 
	get_job_status(guid);

	// begin polling every 20000 ms
    pollInterval = setInterval(function(){
	    get_job_status(guid);

	}, 20000);

});


function get_job_status(guid) {
    $.ajax({url: "/jobs/"+guid,
	success: function(result) {
	    res = JSON.parse(result);

        if (res.status == 'finished') {
	    window.location.replace("/results/"+guid);

//            // hide the progress image
//            $('div.progress')[0].style.visibility = 'hidden';
//            
//            // print success message
//            $('#status')[0].innerHTML = 'Job Complete';
//            
//            clearInterval(pollInterval);
//
//            // display file info
//            $('#results')[0].style.display = '';
//            $('#file')[0].innerHTML = res.file;
//            $('#file')[0].setAttribute('href', res.file);

        } else if (res.status == 'failed') {
            
            // hide the progress image
            $('div.progress').toggleClass('processing');

            // display error message
            $('#status')[0].innerHTML = 'An error occurred while processing the request<br>:(';

            clearInterval(pollInterval);
        }
        else {
            // show the progress image
            $('div.progress')[0].style.visibility = 'visible';
        }
    },
    error: function(error) {
            console.log('error');
    }
    });
}
