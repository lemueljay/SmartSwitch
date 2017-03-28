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
                firstname: {
                    identifier: 'firstname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your first name.'
                        }
                    ]
                },
                lastname: {
                    identifier: 'lastname',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your last name.'
                        }
                    ]
                },
                username: {
                    identifier: 'username',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your preferred username.'
                        }
                    ]
                },
                password: {
                    identifier: 'password',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter a password'
                        },
                        {
                            type   : 'minLength[6]',
                            prompt : 'Your password must be at least {ruleValue} characters.'
                        }
                    ]
                },
            }
        })
    ;

})