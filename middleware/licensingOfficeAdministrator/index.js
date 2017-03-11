(function(){

  var customError;
  var middleware = {};
  var async = require('async');
  var models = require(_ + 'models');
  var ProductModel = models.productModel;
  var ManufacturerModel = models.manufacturerModel;
  var IndividualProductModel = models.individualProductModel;
  var ScannerBundleModel = models.scannerBundleModel;
  var OfficerModel = models.officerModel;

  //define middleware here

  middleware.createOfficer = function(req, res, next){

      var details = req.body;

      //check if officer type is Licensing or Testing
      if(details.officerType == 'Licensing' ||details.officerType == 'Testing'){

          //create an instance of AdministratorModel
          var newOfficer = new OfficerModel();
          newOfficer.name.first = details.name.first;
          newOfficer.name.last = details.name.last;
          newOfficer.identification = details.identification;
          newOfficer.officerType = details.officerType;
          newOfficer.worksFor = '58b73eb392f1851200961f5b'; // TODO: properly fetch the gov org

          //save
          newOfficer.save(function(err){

              if(err){

                next(err);

              }else{

                //create temporary store
                req.tmp = {};
                req.tmp.officer = newOfficer._id;
                next();

              }


          });

      }else{

          customError = new Error('Creating a Police Officer is out of your scope.');
          customError.status = 403;
          customError.statusType = 'fail';
          next(customError);

      }

  };

  //export middleware
  module.exports = middleware;

})();
