/**
 * Created by Lemmeister on 4/18/2017.
 */

var socket = io.connect('http://' + document.domain + ':' + location.port)


$(document).ready(function() {


    var hubcode = $('#hubcodehere').text()
    socket.emit('check_hub_status', hubcode)

    $('#gsconnecthubbtn').click(function() {
        hubcode = $('#gettingstartedinputhub').val();
        console.log("Submitted for checking: " + hubcode)
        socket.emit('check_hub_status', hubcode)
    })


    socket.on('hub_status', function(hub) {
        console.log(hubcode)
        if(hubcode === hub.hubcode) {
            if(hub.online) {
                $('#hub_status').text('Online').addClass('online').removeClass('offline')
            } else {
                $('#hub_status').text('Offline').addClass('offline').removeClass('online')
            }
        } else {
            console.log('FALSE')
        }
    })


})
