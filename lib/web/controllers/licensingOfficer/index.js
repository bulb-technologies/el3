(function(){

  module.exports = function(cache){

    var express = require('express');
    var app = express();
    var mLicensingOfficer = require(_ + 'middleware/licensingOfficer');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    //create Organization Consumer
    app.route('/personConsumer')
    .post(mLicensingOfficer.createPersonConsumer, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "consumer": req.tmp.consumer

        }

      });

    })
    .get(mLicensingOfficer.getPersonConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "consumer": req.tmp.consumer

          }

        });

    });

    app.route('/personConsumer/:id')
    .post(mLicensingOfficer.updatePersonConsumer, function(req, res){

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
    .post(mLicensingOfficer.createOrganizationConsumer, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "consumer": req.tmp.consumer

        }

      });

    //get Organization Consumer
    })
    .get(mLicensingOfficer.getOrganizationConsumer, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "consumer": req.tmp.consumer

          }

        });

    });

    app.route('/organizationConsumer/:id')
    .post(mLicensingOfficer.updateOrganizationConsumer, function(req, res){

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
    .post(mLicensingOfficer.createVehicle, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "vehicle": req.tmp.vehicle

        }

      });

    //get Vehicle
    })
    .get(mLicensingOfficer.getVehicle, function(req, res){

        res.status(200)
        .json({

          "status": "success",
          "data": {

            "vehicle": req.tmp.vehicle

          }

        });

    });

    app.route('/vehicle/:id')
    .post(mLicensingOfficer.updateVehicle, function(req, res){

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
    app.get('/taxes', mLicensingOfficer.getTaxes(cache), function(req, res){

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
