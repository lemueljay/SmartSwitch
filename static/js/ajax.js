/**
 * Created by Lemmeister on 4/17/2017.
 */

$(document).ready(function() {
    $('#connecthubbtn').click(function() {

        var userid = $("input[name='userid']").val()
        var hubcode = $("input[name='hubcode']").val()

        if(hubcode == null || hubcode == '' || hubcode == ' ') {
           $('#hubcodealert').removeClass('hidden');
        } else {
            $('#connecthubform').addClass('hidden');

            $.ajax({
                type: 'POST',
                url: '/connecthub',
                data: JSON.stringify({'userid': userid, 'hubcode': hubcode}, null, '\t'),
                contentType: 'application/json;charset=UTF-8',
                success: function(data) {
                    $('#connectedhubform').removeClass('hidden');
                    $('#hubcodetitle').text(data.hubcode)
                    $('#hubcodealert').addClass('hidden');
                }
            })
        }
    })

    $('#disconnecthubbtn').click(function() {
        $('#connectedhubform').addClass('hidden')
        var userid = $("input[name='userid']").val()
        var hubcode = $("input[name='hubcode']").val()
        $.ajax({
            type: 'POST',
            url: '/disconnecthub',
            data: JSON.stringify({'userid': userid, 'hubcode': hubcode}, null, '\t'),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $("input[name='userid']").val(null)
                $("input[name='hubcode']").val(null)
                $('#connecthubform').removeClass('hidden');
            }
        })
    })

    $('#gsconnecthubbtn').click(function() {
        $('#gettingstartedboard').addClass('hidden')
        $('#homeboard').removeClass('hidden')
        $('#gsform1').addClass('hidden');
        $('#gsform2').removeClass('hidden');
        var userid = $("input[name='userid']").val()
        var hubcode = $("#gettingstartedinputhub").val()
        $.ajax({
            type: 'POST',
            url: '/connecthub',
            data: JSON.stringify({'userid': userid, 'hubcode': hubcode}, null, '\t'),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $('#hubtext').text(data.hubcode)
                $('#hubcodehere').text(data.hubcode)
                $('#gsform3').removeClass('hidden');
                $('#gsform2').addClass('hidden');
            }
        })
    })

    $('#gsdisconnectbtn').click(function() {
        $('#gettingstartedboard').removeClass('hidden')
        $('#homeboard').addClass('hidden')
        $('#gsform3').addClass('hidden')
        $('#gsform2').removeClass('hidden')
        var userid = $("input[name='userid']").val()
        $.ajax({
            type: 'POST',
            url: '/disconnecthub',
            data: JSON.stringify({'userid': userid}, null, '\t'),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $('#hubtext').text()
                $('#hubcodehere').text('')
                $('#gsform1').removeClass('hidden');
                $('#gsform2').addClass('hidden');
            }
        })
    })



})