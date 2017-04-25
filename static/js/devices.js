/**
 * Created by Lemmeister on 4/17/2017.
 */


var socket = io.connect('http://' + document.domain + ':' + location.port)

$(document).ready(function() {

    $('.togglebtn').click(function() {
        var hub_status = $('#hub_statuser').text()
        var device_id = $(this).attr('name').slice(1)
        var hubcode = $('#hubcodehere').text();
        if(hub_status === "Offline") {
            // TODO Disable switching when offline.
        } else if(hub_status === "Online") {
            var device_state = null
            if($(this).prop("checked")) {
                device_state = 'on'
            } else {
                device_state = 'off'
            }
            socket.emit('server_event_listener', {'device_id': device_id, 'device_state': device_state, 'hubcode': hubcode});
        }

    })

})
