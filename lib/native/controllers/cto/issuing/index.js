(function(){

    module.exports = function(){

        var express = require('express');
        var app = express();
        var corsy = require(_ + 'config/corsy');
        var mTax = require(_ + 'middleware/tax');
        var mLicense = require(_ + 'middleware/license');
        var mVehicle = require(_ + 'middleware/vehicle');
        var mValidation = require(_ + 'middleware/validation');
        var mAuthentication = require(_ + 'middleware/authentication');

        //cors middleware
        app.use(corsy);

        //routes

        //create a new login session
        app.post('/login', mAuthentication.loginIssuingOfficer, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "message": "Logged In."

                }

            });

        });

        app.use(mAuthentication.isAuthenticated);

        //remove login session/logout
        app.get('/logout', mAuthentication.logoutIssuingOfficer, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "message": "Logged out."

                }

            });

        });

        //create new vehicle
        app.post('/vehicle', mValidation.preValidateCreateVehicle, mVehicle.createVehicle, function(req, res){

            res.status(201)
            .json({

                status: "success",
                data: {

                    "vehicleId": req.tmp.vehicle_id

                }

            });

        });

        //get existing vehicle
        app.get('/vehicle/:number_plate', mValidation.preValidateQueryVehicleByNumberPlate, mVehicle.queryVehicleByNumberPlate, function(req, res){

          res.status(200)
          .json({

              "status": "success",
              "data": {

                  "vehicle": req.tmp.vehicle

              }

          });

        });

        //update existing vehicle
        app.put('/vehicle/:id', mValidation.preValidateUpdateVehicleDetails, mVehicle.updateVehicleDetails, function(req, res){

          res.status(200)
          .json({

              "status": "success",
              "data": {

                  "message": "Vehicle records updated."

              }

          });

        });

        //get tax list by vehicle
        app.get('/tax/list', mTax.queryTaxList, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "taxes": req.tmp.taxList

                }

            });

        });

        //create new license
        app.post('/license', mValidation.preValidateCreateLicense, mLicense.createLicense, function(req, res){

            res.status(201)
            .json({

                status: "success",
                data: {

                    "licenseId": req.tmp.license_id

                }

            });

        });

        //get existing license
        app.get('/license/:id', mValidation.preValidateQueryLicense, mLicense.queryLicense, function(req, res){

          res.status(200)
          .json({

              "status": "success",
              "data": {

                  "license": req.tmp.license

              }

          });

        });

        //update existing license
        app.put('/license/:id', mValidation.preValidateUpdateLicenseDetails, mLicense.updateLicenseDetails, function(req, res){

          res.status(200)
          .json({

              "status": "success",
              "data": {

                  "message": "License records updated."

              }

          });

        });

        return app;

    };

})();
