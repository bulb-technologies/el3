(function(){

  module.exports = function(){

    var express = require('express');
    var app = express();
    var mTrafficOfficeAdministrator = require(_ + 'middleware/trafficOfficeAdministrator');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    //create an offence
    app.post('/offence', mTrafficOfficeAdministrator.createOffence, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "offence": req.tmp.offence

        }

      });

    });

    //get offences
    app.get('/offences', mTrafficOfficeAdministrator.getOffences, function(req, res){

      res.status(200)
      .json({

        "status": "success",
        "data": {

          "offences": req.tmp.offences

        }

      });

    });

    //get offence by id
    app.get('/offence/id/:id', mTrafficOfficeAdministrator.getOffenceById, function(req, res){

      res.status(200)
      .json({

        "status": "success",
        "data": {

          "offence": req.tmp.offence

        }

      });

    });

    //get offence by ticket reference
    app.get('/offence/ticketReference/:ticketReference', mTrafficOfficeAdministrator.getOffenceByTicketReference, function(req, res){

      res.status(200)
      .json({

        "status": "success",
        "data": {

          "offence": req.tmp.offence

        }

      });

    });

    //get offence by numberPlate
    app.get('/vehicle/numberPlate/:numberPlate', mTrafficOfficeAdministrator.getVehicleByNumberPlate, function(req, res){

      res.status(200)
      .json({

        "status": "success",
        "data": {

          "vehicle": req.tmp.vehicle

        }

      });

    });


    return app;

  };

})();
