/**
 * Created by Lemmeister on 3/26/2017.
 */

$(document).ready(function() {

    /*
     * Form validator.
     * */

    $('.ui.form')
        .form({
            fields: {
                username: {
                    identifier: 'username',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Username should not be empty.'
                        }
                    ]
                },
                password: {
                    identifier: 'password',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Password should not be empty.'
                        }
                    ]
                },
            }
        })
    ;

})