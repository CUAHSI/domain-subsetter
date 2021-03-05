
$(document).ready(function() {

    var url = new URL(window.location.href);
    var jobid = url.searchParams.get('jobid');
    var model = url.searchParams.get('model');
    var version = url.searchParams.get('version');

//    // get the guid, necessary to poll job status
//    var guid = window.location.href.split('/').pop();

    // This page is expecting the following variables:
    // dat['uuid'] -> channel to connect to
    // dat['next'] -> url redirect when job is complete

    // connect to the websocket endpoint using the UUID
    // passed into the template
    // TODO: remove hardcoded port and job id. These should come from template params, see https://stackoverflow.com/questions/27917471/pass-parameter-with-python-flask-in-external-javascript 
    var host = window.location.host;
    // TODO: implement this more throughly for http and https: https://stackoverflow.com/questions/10406930/how-to-construct-a-websocket-uri-relative-to-the-page-uri
    var ws = new WebSocket("wss://"+host+"/socket/"+jobid);
//var ws = new WebSocket("ws://10.202.2.182/socket/"+jobid);
	ws.onmessage = function(event) {
	    // update the page html whenever a new
	    // message is received
	    var div = document.getElementById('progress-messages');

	    // check to see if the message should be printed, or
	    // if a redirect should occur. This function is expecting
	    // the keyword "NEXT" to indicate that a redirect should
	    // be invoked
	    var msg = event.data
	    if (msg != 'next') {
		div.innerHTML = event.data + '</br>' + div.innerHTML;
	    } else {
		window.location.href = "{{ dat['next'] }}";
	    }
    }


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
