/**
 * Created by Lemmeister on 4/17/2017.
 */

$(document).ready(function() {

    $('.togglebtn').click(function() {
        var hub_status = $('#hub_statuser').text()
        var device_id = $(this).attr('name').slice(1)
        var hubcode = $('#hubcodehere').text();

        if(hub_status == "Offline") {
            // TODO Off button.
        } else if(hub_status == "Online") {
            // TODO Send request method to switch device to server. [device_id, hubcode]
            
        }

    })

})
