
$(document).ready(function() {

    var url = new URL(window.location.href);
    var jobid = url.searchParams.get('jobid');
    var model = url.searchParams.get('model');
    var version = url.searchParams.get('version');

//    // get the guid, necessary to poll job status
//    var guid = window.location.href.split('/').pop();


    // initial request so there isn't a polling delay 
    get_job_status(model, version, jobid);

	// begin polling every 20000 ms
    pollInterval = setInterval(function(){
	    get_job_status(model, version, jobid);

	}, 20000);

});


function get_job_status(model, version, guid) {
    $.ajax({url: "/jobs/"+guid,
	success: function(result) {
	    res = JSON.parse(result);

        if (res.status == 'finished') {
	    var args = 'model='+model+'&version='+version+'&jobid='+guid;
	    window.location.replace("/results?"+args);

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
