(function(){

  module.exports = function(){

    var express = require('express');
    var app = express();
    var mTransportAdministrator = require(_ + 'middleware/transportAdministrator');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    //create a government Organization
    app.post('/governmentOrganization', mValidation.createGovernmentOrganization, mTransportAdministrator.createGovernmentOrganization, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "governmentOrganization": req.tmp.governmentOrganization

        }

      });

    });

    //create a government Organization administrator
    app.post('/governmentOrganization/administrator', mValidation.createGovernmentOrganizationAdmin, mTransportAdministrator.createGovernmentOrganizationAdmin, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "govOrgAdmin": req.tmp.govOrgAdmin

        }

      });

    });

    return app;

  };

})();
