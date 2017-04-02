(function(){

  module.exports = function(cache){

    var express = require('express');
    var app = express();
    var mTrafficOfficer= require(_ + 'middleware/trafficOfficer');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    app.get('/vehicles', mTrafficOfficer.getVehicles, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "vehicles": req.tmp.vehicles

            }

        });

    });

    app.get('/tokens', mTrafficOfficer.getTokens, function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "tokens": req.tmp.tokens

            }

        });

    });

    app.get('/taxes', mTrafficOfficer.getTaxes(cache), function(req, res){

        res.status(200)
        .json({

            "status": "success",
            "data": {

                "taxes": req.tmp.taxes

            }

        });

    });

    return app;

  };

})();
