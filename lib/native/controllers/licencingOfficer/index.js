(function(){

  module.exports = function(cache){

    var express = require('express');
    var app = express();
    var mLicencingOfficer = require(_ + 'middleware/licencingOfficer');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    //create Organization Consumer
    app.route('/personConsumer')
    .post(mLicencingOfficer.createPersonConsumer, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "consumer": req.tmp.consumer

        }

      });

    })
    .get(mLicencingOfficer.getPersonConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "consumer": req.tmp.consumer

          }

        });

    });

    app.route('/personConsumer/:id')
    .post(mLicencingOfficer.updatePersonConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "message": "Update successful."

          }

        });

    })
    .delete(function(req, res, next){

        next(new Error('Not Implemented'));

    });

    //create Organization Consumer
    app.route('/organizationConsumer')
    .post(mLicencingOfficer.createOrganizationConsumer, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "consumer": req.tmp.consumer

        }

      });

    //get Organization Consumer
    })
    .get(mLicencingOfficer.getOrganizationConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "consumer": req.tmp.consumer

          }

        });

    });

    app.route('/organizationConsumer/:id')
    .post(mLicencingOfficer.updateOrganizationConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "message": "Update successful."

          }

        });

    })
    .delete(function(req, res, next){

        next(new Error('Not Implemented'));

    });

    //create Vehicle
    app.route('/vehicle')
    .post(mLicencingOfficer.createVehicle, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "vehicle": req.tmp.vehicle

        }

      });

    //get Vehicle
    })
    .get(mLicencingOfficer.getVehicle, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "vehicle": req.tmp.vehicle

          }

        });

    });

    app.route('/vehicle/:id')
    .post(mLicencingOfficer.updateVehicle, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "message": "Update successful."

          }

        });

    })
    .delete(function(req, res, next){

        next(new Error('Not Implemented'));

    });

    //get taxes from cache
    app.get('/taxes', mLicencingOfficer.getTaxes(cache), function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "taxes": req.tmp.taxes

          }

        });

    });

    //initialize tax token
    app.post('/initializeToken', mLicencingOfficer.initializeToken(cache), function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "message": "initialized"

          }

        });

    });

    return app;

  };

})();
