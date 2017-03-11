(function(){

    var passwordless = require('passwordless');
    var tokenStore = require('passwordless-mongostore');
    var mailer = require(_ + 'config/mailer');
    var db = require(_ + 'config/connection');
    const pathToMongoDB = 'mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST_1 + ':' + process.env.DB_PORT_1 + '/' + process.env.DB_DATABASE;
    const APP_URL = process.env.HEROKU_WEB_URL;
    const APP_TITLE = process.env.APP_TITLE;
    const TTL = 1000*60*30;


    //initialize passwordless.
    passwordless.init(new tokenStore(pathToMongoDB));

    // Add a new delivery method to Passwordless used to transmit tokens to the user.
    passwordless.addDelivery(
        // Called when token needs to be delivered.
        function(tokenToSend, uidToSend, recipient, callback){

            //send token
            mailer.sendMail({

                from: APP_TITLE + ' <system@el3.bw>', // sender address
                to: recipient, // list of receivers
                subject: 'Login Token', // Subject line
                text: 'Hello!\nAccess your ' + APP_TITLE + ' account here:\n\n'
            + APP_URL + '?token=' + tokenToSend + '&uid='
            + encodeURIComponent(uidToSend) + '\n\nThis token expires in ' + (TTL/(1000*60)) + ' minutes.' // plaintext body

            }, function(error, info){

                if(error){

                    callback(error);

                }else{

                  callback();

                }

            });

        }, {'ttl': TTL});

    module.exports = passwordless;

})();
