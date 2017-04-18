/**
 * Created by Lemmeister on 4/18/2017.
 */

$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port)

    socket.on('connect', function() {
        socket.send("CONNECTED!")
        console.log('CONNECTED!')
    });
})