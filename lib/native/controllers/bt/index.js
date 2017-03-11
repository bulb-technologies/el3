(function(){

    module.exports = function(){

        var express = require('express');
        var app = express();
        var models = require(_ + 'models');
        var corsy = require(_ + 'config/corsy');
        var mTax = require(_ + 'middleware/tax');
        var mUser = require(_ + 'middleware/user');
        var mScanner = require(_ + 'middleware/scanner');
        var mStation = require(_ + 'middleware/station');
        var mLicense = require(_ + 'middleware/license');
        var mValidation = require(_ + 'middleware/validation');
        var mAuthentication = require(_ + 'middleware/authentication');

        //cors middleware
        app.use(corsy);

        //routes

        //create a new login session
        app.post('/login', mAuthentication.loginAdministrator, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "message": "Logged In."

                }

            });

        });

        //remove login session/logout
        app.get('/logout', mAuthentication.isAuthenticated, mAuthentication.logoutAdministrator, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "message": "Logged out."

                }

            });

        });

        //create a new scanner
        app.post('/scanner', mAuthentication.isAuthenticated, mScanner.createScanner, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New Scanner created."

                }

            });

        });

        //get a list of scanners
        app.get('/scanner/list', mAuthentication.isAuthenticated, mScanner.queryScannerList, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "scanners": req.tmp.scanners

                }

            });

        });

        //create a new rfidTag
        app.post('/nfctag', mAuthentication.isAuthenticated, mScanner.createRFIDTag, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New NFC tag created."

                }

            });

        });

        //create a new allergy
        app.post('/allergy', mAuthentication.isAuthenticated, mValidation.preValidateCreateAllergy, mLicense.createAllergy, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New allergy created."

                }

            });

        });

        //update scanner
        app.put('/device/:id', mAuthentication.isAuthenticated, mScanner.patchScanner, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "message": "Scanner updated."

                }

            });

        });

        //create a new station
        app.post('/station', mAuthentication.isAuthenticated, mStation.createStation, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New Station created."

                }

            });

        });

        //create a new tax type
        app.post('/tax', mAuthentication.isAuthenticated, mTax.createTax, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New Tax type created."

                }

            });

        });

        //create a new device
        app.post('/device', mAuthentication.isAuthenticated, mScanner.createDevice, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New device created."

                }

            });

        });

        //fetch a list of stations
        app.get('/station/list', mAuthentication.isAuthenticated, mStation.queryStationList, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "stations": req.tmp.stations

                }

            });

        });

        //fetch a station by id
        app.get('/station/:id', mAuthentication.isAuthenticated, mStation.queryStationById, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "station": req.tmp.station

                }

            });

        });

        //create a new officer
        app.post('/officer', mAuthentication.isAuthenticated, mUser.createOfficer, function(req, res){

            res.status(201)
            .json({

                "status": "success",
                "data": {

                    "message": "New officer created."

                }

            });

        });

        //get a lisf of officers
        app.get('/officer/list', mAuthentication.isAuthenticated, mUser.queryOfficerList, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "officers": req.tmp.officers

                }

            });

        });

        //get officer by id
        app.get('/officer/:id', mAuthentication.isAuthenticated, mUser.queryOfficerById, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "officer": req.tmp.officer

                }

            });

        });

        return app;

    };

})();
