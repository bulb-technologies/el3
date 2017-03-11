(function(){

  module.exports = function(){

    var express = require('express');
    var app = express();
    var mLicensingOfficeAdministrator = require(_ + 'middleware/licensingOfficeAdministrator');
    var mValidation = require(_ + 'middleware/validation');

    //routes
    //create a Licensing officer
    app.post('/officer', mValidation.createOfficer, mLicensingOfficeAdministrator.createOfficer, function(req, res){

      res.status(201)
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
