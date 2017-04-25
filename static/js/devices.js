/**
 * Created by Lemmeister on 4/17/2017.
 */


var socket = io.connect('http://' + document.domain + ':' + location.port)


function device_toggleable(data) {
    var hubcode = $('#hubcodehere').text();
    if(hubcode === data.hubcode) {
        if(data.online == true) {
            $('.togglebtn').removeAttr("disabled")
        } else {
            $('.togglebtn').attr("disabled", true)
        }
    } else {

    }

}

function init_device_toggleable() {
    var hub_status = $('#hub_statuser').text();
    if(hub_status === "Online") {
        $('.togglebtn').removeAttr("disabled")
    } else {
        $('.togglebtn').attr("disabled", true)
    }
}


$(document).ready(function() {

    // TODO Scheduler calendar.
    $('#example1').calendar({
        ampm: false,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return year + '/' + month + '/' + day;
            }
        }
    });

    //  Disable switches if offline.
    init_device_toggleable()
    socket.on('device_toggleable', function(data) {
        device_toggleable(data)
    })

    $('.togglebtn').click(function() {
        var hub_status = $('#hub_statuser').text()
        var device_id = $(this).attr('name').slice(1)
        var hubcode = $('#hubcodehere').text();
        if(hub_status === "Offline") {
            // Do nothing.
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
