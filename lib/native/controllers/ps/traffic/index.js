(function(){

    module.exports = function(){

        var express = require('express');
        var app = express();
        var mTax = require(_ + 'middleware/tax');
        var mVehicle = require(_ + 'middleware/vehicle');
        var mValidation = require(_ + 'middleware/validation');
        var corsy = require(_ + 'config/corsy');

        //cors middleware
        app.use(corsy);

        //routes

        //get pending transactions with due date less than the current date
        app.get('/transactions', mValidation.preValidateQueryAccrualsByDate, mTax.queryAccrualsByDate, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "transactions": req.tmp.transactions

                }

            });

        });

        //get count of owing transactions after a certain date
        app.get('/transactions/count', mTax.countAccrualsByDate, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "transactions": req.tmp.count

                }

            });

        });

        //get count of vehicles after a certain date
        app.get('/vehicles/count', mValidation.preValidateCountVehiclesByDate, mVehicle.countVehiclesByDate, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "count": req.tmp.count

                }

            });

        });

        //get vehicles
        app.get('/vehicles', mValidation.preValidateQueryVehicleListByDate, mVehicle.queryVehicleListByDate, function(req, res){

            res.status(200)
            .json({

                "status": "success",
                "data": {

                    "vehicles": req.tmp.vehicles

                }

            });

        });

        return app;

    };

})();
