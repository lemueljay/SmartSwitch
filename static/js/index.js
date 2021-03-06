/**
 * Created by Lemmeister on 3/23/2017.
 */



function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}


function jqUpdateSize() {
    var width = $(window).width();
    var height = $(window).height();
    if(width <= 1280) {
        $(".sidebar.left").trigger("sidebar:close");
        $('#toggle-sidebar').removeClass('hidden');
        $('.sectioncontainer').addClass('col-xs-12').removeClass('col-xs-push-2 col-xs-10');
    } else {
        $('#toggle-sidebar').addClass('hidden');
        $(".sidebar.left").trigger("sidebar:open");
        $('.sectioncontainer').addClass('col-xs-push-2 col-xs-10').removeClass('col-xs-12');
    }
}


$(document).ready(function() {

    $(document).ready(jqUpdateSize);    // When the page first loads
    $(window).resize(jqUpdateSize);     // When the browser changes size


    /*
    * Handler for navigation clicks.
    * */

    $('#nav-inbox').popup({
        on: 'click',
        boundary: window,
        position   : 'bottom center',
        delay: {
            show: 400,
            hide: 400
        },
        html: '<div style="width: 300px;" class="container popovers">' +
        '<div class="col-xs-12 text-center">MESSAGES<hr></div>' +
        '<div class="col-xs-12 notifbar">' +
        '   <div class="col-xs-12 notif">' +
        '       <div class="col-xs-2 notifleft"><img class="notifimg" src="../static/img/1.jpg"></div>' +
        '       <div class="col-xs-10 notifbody">' +
        '           <div class="notiffheading">Lemuel Jay</div>' +
        '           <div class="notiftext">Cum sociis natoque penatibus et magnis dis parturient montes</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/2.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Jonathan Morris</div>' +
        '           <div class="tasktext">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/3.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Fredric Mitchell Jr.</div>' +
        '           <div class="tasktext">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/4.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Glenn Jecobs</div>' +
        '           <div class="tasktext">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/4.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Bill Phillips</div>' +
        '           <div class="tasktext">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</div>' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '<div class="col-xs-12 text-center popoverfootbar">VIEW ALL</div>' +
        '</div>'
    });

    $('#nav-notif').popup({
        on: 'click',
        boundary: window,
        position   : 'bottom center',
        delay: {
            show: 400,
            hide: 400
        },
        html: '<div style="width: 300px;" class="container popovers">' +
        '<div class="col-xs-12 text-center">NOTIFICATION <i id="markallread" class="material-icons popup-icons pull-right">playlist_add_check</i><hr></div>' +
        '<div class="col-xs-12 notifbar">' +
        '   <div class="col-xs-12 notif">' +
        '       <div class="col-xs-2 notifleft"><img class="notifimg" src="../static/img/1.jpg"></div>' +
        '       <div class="col-xs-10 notifbody">' +
        '           <div class="notiffheading">David Belle</div>' +
        '           <div class="notiftext">Cum sociis natoque penatibus et magnis dis parturient montes</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/2.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Jonathan Morris</div>' +
        '           <div class="tasktext">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/3.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Fredric Mitchell Jr.</div>' +
        '           <div class="tasktext">Phasellus a ante et est ornare accumsan at vel magnauis blandit turpis at augue ultricies</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/4.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Glenn Jecobs</div>' +
        '           <div class="tasktext">Ut vitae lacus sem ellentesque maximus, nunc sit amet varius dignissim, dui est consectetur neque</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/4.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Bill Phillips</div>' +
        '           <div class="tasktext">Proin laoreet commodo eros id faucibus. Donec ligula quam, imperdiet vel ante placerat</div>' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '<div class="col-xs-12 text-center popoverfootbar">VIEW ALL</div>' +
        '</div>'
    });


    $('#nav-tasks').popup({
        on: 'click',
        boundary: window,
        position   : 'bottom center',
        delay: {
            show: 400,
            hide: 400
        },
        html: '' +
        '<div style="width: 300px;" class="container popovers">' +
        '<div class="col-xs-12 text-center">TASKS<hr></div>' +
        '<div class="col-xs-12 notifbar">' +
        '   <div class="col-xs-12 notif">' +
        '       <div class="col-xs-2 notifleft"><img class="notifimg" src="../static/img/1.jpg"></div>' +
        '       <div class="col-xs-10 notifbody">' +
        '           <div class="notiffheading">David Belle</div>' +
        '           <div class="notiftext">Cum sociis natoque penatibus et magnis dis parturient montes</div>' +
        '       </div>' +
        '   </div>' +
        '   <div class="col-xs-12 task">' +
        '       <div class="col-xs-2 taskleft"><img class="taskimg" src="../static/img/2.jpg"></div>' +
        '       <div class="col-xs-10 taskbody">' +
        '           <div class="taskheading">Jonathan Morris</div>' +
        '           <div class="tasktext">Nunc quis diam diamurabitur at dolor elementum, dictum turpis vel</div>' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '<div class="col-xs-12 text-center popoverfootbar">VIEW ALL</div>' +
        '</div>'
    });

    $('#nav-settings').popup({
        boundary: window,
        hoverable: true,
        position   : 'bottom center',
        delay: {
            show: 400,
            hide: 400
        },
        html: '<div style="width: 200px;" class="container popovers">' +
        '<div class="col-xs-12 text-center">SETTINGS<hr></div>' +
        '<div class="col-xs-12 setting" onclick="toggleFullScreen()"><i class="material-icons">fullscreen</i> Toggle Fullscreen</div>' +
        '<div class="col-xs-12 setting"><i class="material-icons">fingerprint</i> Privacy Settings</div>' +
        '<div class="col-xs-12 setting" data-toggle="modal" data-target=".getstartedmodal"><i class="material-icons">device_hub</i> Hub Settings</div>' +
        '<div class="col-xs-12 setting"><i class="material-icons">event_seat</i> Lemmeister\'s Section</div>' +
        '<div class="col-xs-12 setting"><i class="material-icons">code</i> Developer\'s Section</div>' +
        '<div class="col-xs-12 text-center popoverfootbar setting"><a href="/logout">SIGN OUT</a></div>' +
        '</div>'
    });


    $('.connecthubmodal').on('show.bs.modal', function() {
        $('#nav-settings').popup('hide');
    })

    /*
    * Toggle sidebar
    * */

    $(".sidebar.left").sidebar().trigger("sidebar:open");
    // Sidebar on left (default)
    $('#toggle-sidebar').click(function() {
        $(".sidebar.left").trigger("sidebar:toggle");
    })

    $(".sidebar.right").sidebar({side: "right"});
    // Sidebar on left (default)
    $('#nav-chat').click(function() {
        $(".sidebar.right").trigger("sidebar:toggle");
    })

    $('.sidemenu').click(function() {
        $('.sidemenu').each(function() {
            $(this).removeClass('active')
        })

        $(this).addClass('active')

        $('.bodycontent').addClass('hidden')
        var toggleBody = $(this).attr("data-togglebody")
        $('#' + toggleBody + 'section').removeClass('hidden')
        switch(toggleBody) {
            case 'devices':
                $('.devices-list').load('/devices')
        }
    })


})
