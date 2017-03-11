(function(){

  var customError;
  var middleware = {};
  var async = require('async');
  var models = require(_ + 'models');
  var IndividualProductModel = models.individualProductModel;
  var GovernmentOrganizationModel = models.governmentOrganizationModel;
  var ScannerBundleModel = models.scannerBundleModel;
  var AdministratorModel = models.administratorModel;

  //define middleware here

  //create government organization
  middleware.createGovernmentOrganization = function(req, res, next){

    var details = req.body;

    //create an instance of GovernmentOrganizationModel
    var newGovOrg = new GovernmentOrganizationModel();

    newGovOrg.name = details.name;
    newGovOrg.email = details.email;
    newGovOrg.telephone = details.telephone;

    //check if the address object is defined
    if(details.address != undefined){

        newGovOrg.address.postOfficeBoxNumber = (details.address.postOfficeBoxNumber) ? details.address.postOfficeBoxNumber : undefined;
        newGovOrg.address.postalCode = (details.address.postalCode) ? details.address.postalCode : undefined;
        newGovOrg.address.streetAddress = (details.address.streetAddress) ? details.address.streetAddress : undefined;
        newGovOrg.address.addressRegion = (details.address.addressRegion) ? details.address.addressRegion : undefined;
        newGovOrg.address.addressLocality = (details.address.addressLocality) ? details.address.addressLocality : undefined;

    }

    //Transport Administrator can only create Licensing Offices
    newGovOrg.organizationType = 'Licensing Office';
    newGovOrg.parentOrganization = '58b73c43a14cd60ca85489de'; // TODO: Get parent organization from session

    //save
    newGovOrg.save(function(err){

        if(err){

          next(err);

        }else{

          //create temporary store
          req.tmp = {};
          req.tmp.governmentOrganization = newGovOrg._id;
          next();

        }

    });

  };

  //create government organization administrator
  middleware.createGovernmentOrganizationAdmin = function(req, res, next){

      var details = req.body;

      async.auto({

          findGovernmentOrganization: function(callback){

            GovernmentOrganizationModel.findById(details.worksFor)
            .select('_id')
            .exec(function(err, organization){

              if(err){

                //db error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                next(err);

              }else{

                if(organization){

                  callback(null, organization);

                }else{

                  customError = new Error('Government Organization not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  callback(customError);

                }

              }

            });

        },

        checkForPreExistingAdmin: ['findGovernmentOrganization', function(results, callback){

            var governmentOrganization = results.findGovernmentOrganization;

            AdministratorModel.find({'worksFor.governmentOrganization': governmentOrganization._id})
            .sort('-created')
            .limit(1)
            .exec(function(err, admins){

                if(err){

                    //db error
                    err.friendly = 'Something went wrong. Please try again.';
                    err.status = 500;
                    err.statusType = 'error';
                    next(err);

                }else{

                    if(admins.length){

                        var admin = admins[0];

                        //check if admin is blocked
                        if(admin.state.blocked.value){

                            callback();

                        }else{

                            customError = new Error('An administrator already resides over this organization, block current administrator then appoint a new one.');
                            customError.status = 403;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }else{

                    callback();

                    }

                }

            });

        }],

        createAdmin: ['checkForPreExistingAdmin', function(results, callback){

            var governmentOrganization = results.findGovernmentOrganization;

            //create an instance of AdministratorModel
            var newGovOrgAdmin = new AdministratorModel();
            newGovOrgAdmin.name.first = details.name.first;
            newGovOrgAdmin.name.last = details.name.last;
            newGovOrgAdmin.email = details.email;
            newGovOrgAdmin.identification = details.identification;
            newGovOrgAdmin.administratorType = details.administratorType;
            newGovOrgAdmin.worksFor.governmentOrganization = governmentOrganization._id;

            //save
            newGovOrgAdmin.save(function(err){

              if(err){

                callback(err);

              }else{

                //create temporary store
                req.tmp = {};
                req.tmp.govOrgAdmin = newGovOrgAdmin._id;
                callback();

              }

            });

        }]

      },

          function(err, results){

          if(err){

              next(err);

          }else{

              next();

          }

      });

  };

  //export middleware
  module.exports = middleware;

})();
