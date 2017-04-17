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
})