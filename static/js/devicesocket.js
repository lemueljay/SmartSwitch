var socket = io.connect('http://' + document.domain + ':' + location.port)


$(document).ready(function() {


    socket.on('sensor_status', function(data) {
        $(".temp-data").text(data.temp)
		$(".hum-data").text(data.hum)
		console.log(data)
    })


})