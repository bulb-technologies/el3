(function(){

  module.exports = function(){

    var express = require('express');
    var app = express();
    var mLicencingOfficeAdministrator = require(_ + 'middleware/licencingOfficeAdministrator');
    var mValidation = require(_ + 'middleware/validation');

    //routes
    //create a Licencing officer
    app.post('/officer', mValidation.createOfficer, mLicencingOfficeAdministrator.createOfficer, function(req, res){

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
