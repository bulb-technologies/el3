(function(){

  module.exports = function(cache){

    var express = require('express');
    var app = express();
    var mPersonConsumer = require(_ + 'middleware/personConsumer');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    app.route('/account')
    .get(mPersonConsumer.getOwnAccount, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "account": req.tmp.consumer

            }

        });

    })
    .post(mPersonConsumer.updateOwnAccount, function(req, res){ // TODO: Validate and Sanitize  TODO// change to patch

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "message": "Successfully updated."

            }

        });

    });

    app.get('/vehicles', mPersonConsumer.getOwnVehicles, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "vehicles": req.tmp.vehicles

            }

        });

    });

    app.get('/vehicle/:id',mValidation.getOwnVehicle, mPersonConsumer.getOwnVehicle(cache), function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "vehicle": req.tmp.vehicle

            }

        });

    });

    app.get('/tokens', mValidation.getOwnVehicleTokens, mPersonConsumer.getOwnVehicleTokens, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "tokens": req.tmp.tokens

            }

        });

    });

    app.get('/token/:id', mValidation.getOwnVehicleToken, mPersonConsumer.getOwnVehicleToken, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "token": req.tmp.token

            }

        });

    });

    // TODO: get offences by vehicle
    app.get('/offences', mValidation.getOwnVehicleOffences, mPersonConsumer.getOwnVehicleOffences, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "offences": req.tmp.offences

            }

        });

    });

    app.get('/offence/:id', mValidation.getOwnVehicleOffence, mPersonConsumer.getOwnVehicleOffence, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "offence": req.tmp.offence

            }

        });

    });

    return app;

  };

})();
