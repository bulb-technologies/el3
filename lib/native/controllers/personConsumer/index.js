(function(){

  module.exports = function(cache){

    var express = require('express');
    var app = express();
    var mPersonConsumer = require(_ + 'middleware/personConsumer');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    app.route('/account')
    .get(mPersonConsumer.getOwnAccount, function(req, res){

        res.status(201)
        .json({

            "status": "success",
            "data": {

                "account": req.tmp.consumer

            }

        });

    })
    .patch(mPersonConsumer.updateOwnAccount, function(req, res){ // TODO: Validate and Sanitize

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "message": "Successfully updated."

            }

        });

    });;

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

    app.get('/vehicle/:id/tokens', mValidation.getOwnVehicleTokens, mPersonConsumer.getOwnVehicleTokens, function(req, res){

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

    return app;

  };

})();
