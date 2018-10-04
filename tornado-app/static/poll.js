$(document).ready(function(){


    console.log('test');



    // read hidden fields
    var guid = $('#guid').val();
    var runPolling = parseInt($('#run_poll').val());
    if (runPolling){
      console.log('Yes Polling');

//    window.setInterval(function(){
//
	// poll at intervals
        pollInterval = setInterval(function(){
	    check_status(guid);
	}, 2000);

//        console.log(response);
//    }, 5000);



    } else {
      console.log('No Polling');
      }

});


function check_status(guid) {
    console.log('checking status of ' + guid);
    $.ajax({url: "/status",
	    data: {
		'jobid': guid,
	    },
	success: function(result) {
	    res = JSON.parse(result);
	    var stat = res['state'];
	    var dat = res['result'];

	    // update the color
	    if (stat == 'running') {
		$('#message').css("background-color", "rgb(247, 240, 135");
	    } else if (stat == 'finished') {
		$('#message').css("background-color", "rgb(135, 247, 184)");
		$('#result-msg').html(dat['message']);
		var link = '<a href='+dat['filepath']+'>Download Here</a>';
		$('#path').html(link);
	    } else {
		$('#message').css("background-color", "rgb(247, 179, 135)");
	    }

	    $('#status').html(res['state']);
            console.log('status check complete');

	    if ((res['state'] == 'Does not exist') || (res['state'] == 'finished')) {
		clearInterval(pollInterval);
	    }
	}
    });
}

