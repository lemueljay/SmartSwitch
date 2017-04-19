/**
 * Created by Lemmeister on 4/18/2017.
 */

var socket = io.connect('http://' + document.domain + ':' + location.port)


$(document).ready(function() {


    var hubcodehere = $('#hubcodehere').text()
    console.log(hubcodehere)
    socket.emit('check_hub_status', hubcodehere)

    $('#gsconnecthubbtn').click(function() {
        var hubcode = $('#gettingstartedinputhub').val();
        console.log(hubcode)
        socket.emit('check_hub_status', hubcode)
    })


    socket.on('hub_status', function(hub) {
        var hubcode =$('#hubcodehere').text()
        console.log(hubcode)
        console.log(hub.hubcode)
        if(hubcode === hub.hubcode) {
            if(hub.online) {
                $('#hub_status').text('Online')
            } else {
                $('#hub_status').text('Offline')
            }
        } else {
            console.log('FALSE')
        }
    })


})
