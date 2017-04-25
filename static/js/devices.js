/**
 * Created by Lemmeister on 4/17/2017.
 */


var socket = io.connect('http://' + document.domain + ':' + location.port)

function schedule_device(device_id) {
    var schedule_datetime = $('#datetimeschedule' + device_id).val() + ':00'
    var sdt = schedule_datetime.split(/[ ,]+/)
    var sdate = sdt[0];
    var stime = sdt[1];
    sdate = sdate.split(/[-,]+/)
    var syear = sdate[0];
    var smonth  = sdate[1];
    if(smonth.length < 2) {
        smonth = '0' + smonth
    }
    var sday = sdate[2];
    if(sday.length < 2) {
        sday = '0' + sday
    }
    sdate = syear + '-' + smonth + '-' + sday
    stime = stime.split(/[:,]+/)
    var shour = stime[0]
    var smin = stime[1]
    var sec = stime[2]
    if(shour.length < 2) {
        shour = '0' + shour
    }
    if(smin.length < 2) {
        smin = '0' + smin
    }
    stime = shour + ':' + smin + ':' + sec
    schedule_datetime = sdate + ' ' + stime
    var device_id = device_id
    var schedule_status
    if($('#statusschedule' + device_id).is(':checked')) {
        schedule_status = 'on'
    } else {
        schedule_status = 'off'
    }
    console.log(schedule_datetime)
    $.ajax({
        type: 'POST',
        url: '/schedule',
        data: JSON.stringify({'schedule_datetime': schedule_datetime, 'device_id': device_id, 'schedule_status': schedule_status}, null, '\t'),
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            $('#cancelschedulebtn' + device_id).removeClass('hidden')
            $('#schedulebtn' + device_id).addClass('hidden')
            $('#schedbox' + device_id).addClass('hidden')
        }
    })
}

function unschedule_device(device_id) {
    var device_id = device_id
    $.ajax({
        type: 'POST',
        url: '/unschedule',
        data: JSON.stringify({'device_id': device_id}, null, '\t'),
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            $('#cancelschedulebtn' + device_id).addClass('hidden')
            $('#schedulebtn' + device_id).removeClass('hidden')
            $('#schedbox' + device_id).removeClass('hidden')
            $('#datetimeschedule' + device_id).val(null)
        }
    })
}

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
    $('.examplecalendar').calendar({
        ampm: false,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return year + '-' + month + '-' + day;
            },
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
