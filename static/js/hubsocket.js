/**
 * Created by Lemmeister on 4/18/2017.
 */

var socket = io.connect('http://' + document.domain + ':' + location.port)


$(document).ready(function() {


    var hubcode = $('#hubcodehere').text()
    socket.emit('check_hub_status', hubcode)

    $('#gsconnecthubbtn').click(function() {
        hubcode = $('#gettingstartedinputhub').val();
        socket.emit('check_hub_status', hubcode)
    })


    socket.on('hub_status', function(hub) {
        if(hubcode === hub.hubcode) {
            if(hub.online) {
                $('.hub_status').text('Online').addClass('online').removeClass('offline')
                $('#hub_statuser').text('Online')
            } else {
                $('.hub_status').text('Offline').addClass('offline').removeClass('online')
                $('#hub_statuser').text('Offline')
            }
        } else {
        }
    })


})
