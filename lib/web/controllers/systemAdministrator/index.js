(function(){

  module.exports = function(){

    var express = require('express');
    var app = express();
    var mSystemAdministrator = require(_ + 'middleware/systemAdministrator');
    var mValidation = require(_ + 'middleware/validation');

    //routes

    //creates a Manufacturer
    app.post('/manufacturer', mValidation.createManufacturer, mSystemAdministrator.createManufacturer, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "manufacturer": req.tmp.manufacturer

        }

      });

    });

    //creates a Product
    app.post('/product', mValidation.createProduct, mSystemAdministrator.createProduct, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "product": req.tmp.product

        }

      });

    });

    //create an individual Product
    app.post('/individualProduct', mValidation.createIndividualProduct, mSystemAdministrator.createIndividualProduct, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "individualProduct": req.tmp.individualProduct

        }

      });

    });

    //create an individual Product
    app.post('/scannerBundle', mValidation.createScannerBundle, mSystemAdministrator.createScannerBundle, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "scannerBundle": req.tmp.scannerBundle

        }

      });

    });

    //create a government Organization
    app.post('/governmentOrganization', mValidation.createGovernmentOrganization, mSystemAdministrator.createGovernmentOrganization, function(req, res){

      res.status(201)
      .json({

        "status": "success",
        "data": {

          "governmentOrganization": req.tmp.governmentOrganization

        }

      });

    });

    //create a government Organization administrator
    app.post('/governmentOrganization/administrator', mValidation.createGovernmentOrganizationAdmin, mSystemAdministrator.createGovernmentOrganizationAdmin, function(req, res){

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
