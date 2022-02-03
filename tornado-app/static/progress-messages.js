
$(document).ready(function() {

    var url = new URL(window.location.href);
    var jobid = url.searchParams.get('jobid');
    var model = url.searchParams.get('model');
    var version = url.searchParams.get('version');

    // connect to the websocket endpoint using the UUID
    // passed into the template
    // TODO: remove hardcoded port and job id. These should come from template params, see https://stackoverflow.com/questions/27917471/pass-parameter-with-python-flask-in-external-javascript 
    var host = window.location.host;

    var ws = new WebSocket("ws://"+host+"/socket/"+jobid);
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

});


