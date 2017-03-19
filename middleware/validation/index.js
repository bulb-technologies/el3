(function(){

  var customError;
  var middleware = {};
  var util = require('util');
  var async = require('async');
  var models = require(_ + 'models');

  //define middleware here

    middleware.createManufacturer = function(req, res, next){

        //santize
        req.sanitizeBody('name').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('country').whitelist(["-',abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('telephone').whitelist(["-0123456789"]);
        req.sanitizeBody('address.postOfficeBoxNumber').whitelist(["0123456789POBOXpobox "]);
        req.sanitizeBody('address.postalCode').whitelist(["0123456789"]);
        req.sanitizeBody('address.streetAddress').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('address.addressRegion').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('address.addressLocality').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);

        //validate
        req.checkBody('name', '@name parameter is undefined.').notEmpty();
        req.checkBody('email', '@email parameter is undefined.').notEmpty();
        req.checkBody('email', '@email value is not a valid email address.').isEmail();
        req.checkBody('telephone', '@telephone parameter is undefined.').notEmpty();
        req.checkBody('country', '@country parameter is undefined.').notEmpty();
        req.checkBody('url', '@url value is not a valid http/https url.').optional().isURL({'protocols': ['https', 'http']});

        //check for errors
        var errors = req.validationErrors();

        if(errors){

              var errorMessages = [];

              async.each(errors, function(errorItem, callback){

                errorMessages.push({

                  "message": errorItem.msg,
                  "param": errorItem.param

                });

                callback();

              }, function(err){

                    //create a new error
                    customError = new Error('Validation Failed: ' + util.inspect(errors));
                    customError.friendly = errorMessages;
                    customError.status = 400;
                    customError.statusType = 'fail';
                    next(customError);

              });

        }else{

            next();

        }

    };

    middleware.createProduct = function(req, res, next){

        //santize
        req.sanitizeBody('name').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('productType').whitelist(["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('model').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('brand').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('gtin').whitelist(["0123456789"]);

        //validate
        req.checkBody('name', '@name parameter is undefined.').notEmpty();
        req.checkBody('model', '@model parameter is undefined.').notEmpty();
        req.checkBody('brand', '@brand parameter is undefined.').notEmpty();
        req.checkBody('gtin', '@gtin parameter is undefined.').notEmpty();
        req.checkBody('productType', '@productType parameter is undefined.').notEmpty();
        req.checkBody('description', '@description parameter is undefined.').notEmpty();
        req.checkBody('description', '@description value is not a valid base64 encoded string.').isBase64();
        req.checkBody('manufacturer', '@manufacturer parameter is undefined.').notEmpty();
        req.checkBody('manufacturer', '@manufacturer value is not a valid mongoId.').isMongoId();
        req.checkBody('url', '@url value is not a valid http/https url.').optional().isURL({'protocols': ['https', 'http']});
        req.checkBody('image', '@image value is not a valid http/https url.').optional().isURL({'protocols': ['https', 'http']});
        req.checkBody('releaseDate', '@releaseDate parameter is undefined.').notEmpty();
        req.checkBody('releaseDate', '@releaseDate value is not a valid ISO8601 formatted date.').isISO8601();

        //check for errors
        var errors = req.validationErrors();

        if(errors){

          var errorMessages = [];

          async.each(errors, function(errorItem, callback){

            errorMessages.push({

              "message": errorItem.msg,
              "param": errorItem.param

            });

            callback();

          }, function(err){

            console.log(errors);

            //create a new error
            customError = new Error('Validation Failed: ' + util.inspect(errors));
            customError.friendly = errorMessages;
            customError.status = 400;
            customError.statusType = 'fail';
            next(customError);

          });

        }else{

          next();

        }

    };

    middleware.createIndividualProduct = function(req, res, next){

    //santize
    req.sanitizeBody('serialNumber').whitelist(["-./0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]);

    //validate
    req.checkBody('serialNumber', '@serialNumber parameter is undefined.').notEmpty();
    req.checkBody('product', '@product parameter is undefined.').notEmpty();
    req.checkBody('product', '@product value is not a valid mongoId.').isMongoId();
    req.checkBody('purchaseDate', '@purchaseDate parameter is undefined.').notEmpty();
    req.checkBody('purchaseDate', '@purchaseDate value is not a valid ISO8601 formatted date.').isISO8601();

    //check for errors
    var errors = req.validationErrors();

    if(errors){

      var errorMessages = [];

      async.each(errors, function(errorItem, callback){

        errorMessages.push({

          "message": errorItem.msg,
          "param": errorItem.param

        });

        callback();

      }, function(err){

        console.log(errors);

        //create a new error
        customError = new Error('Validation Failed: ' + util.inspect(errors));
        customError.friendly = errorMessages;
        customError.status = 400;
        customError.statusType = 'fail';
        next(customError);

      });

    }else{

      next();

    }

    };

    middleware.createScannerBundle = function(req, res, next){

    //validate
    req.checkBody('device', '@device parameter is undefined.').notEmpty();
    req.checkBody('device', '@device value is not a valid mongoId.').isMongoId();
    req.checkBody('assignedTo', '@assignedTo parameter is undefined.').notEmpty();
    req.checkBody('assignedTo', '@assignedTo value is not a valid mongoId.').isMongoId();
    req.checkBody('cradle', '@cradle value is not a valid mongoId.').optional().isMongoId();
    req.checkBody('rfidReaderModule', '@rfidReaderModule value is not a valid mongoId.').optional().isMongoId();
    req.checkBody('fingerPrintReaderModule', '@fingerPrintReaderModule value is not a valid mongoId.').optional().isMongoId();

    //check for errors
    var errors = req.validationErrors();

    if(errors){

      var errorMessages = [];

      async.each(errors, function(errorItem, callback){

        errorMessages.push({

          "message": errorItem.msg,
          "param": errorItem.param

        });

        callback();

      }, function(err){

        console.log(errors);

        //create a new error
        customError = new Error('Validation Failed: ' + util.inspect(errors));
        customError.friendly = errorMessages;
        customError.status = 400;
        customError.statusType = 'fail';
        next(customError);

      });

    }else{

      next();

    }

    };

    middleware.createTax = function(req, res, next){

    //santize
    req.sanitizeBody('name').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
    req.sanitizeBody('feeReference').whitelist(["0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]);
    req.sanitizeBody('country').whitelist(["-',abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);

    //validate
    req.checkBody('name', '@name parameter is undefined.').notEmpty();
    req.checkBody('feeReference', '@feeReference parameter is undefined.').notEmpty();
    req.checkBody('taxType', '@taxType parameter is undefined.').notEmpty();
    req.checkBody('taxType', '@taxType value is not one of Licence or Permit.').isIn(['Licence', 'Permit']);
    req.checkBody('daysUntilMaturity', '@daysUntilMaturity parameter is undefined.').notEmpty();
    req.checkBody('daysUntilMaturity', '@daysUntilMaturity value is not an integer.').isInt();
    req.checkBody('daysValid', '@daysValid parameter is undefined.').notEmpty();
    req.checkBody('daysValid', '@daysValid value is not an integer.').isInt();
    req.checkBody('country', '@country parameter is undefined.').notEmpty();
    req.checkBody('authorization.everyXDays', '@authorization.everyXDays value is not an integer.').optional().isInt();
    req.checkBody('authorization.authorizingOfficerTypes', '@authorization.authorizingOfficerTypes value is not an array.').optional().isArray();
    req.checkBody('authorization.authorizingAdministratorTypes', '@authorization.authorizingAdministratorTypes value is not an array.').optional().isArray();

    //check for errors
    var errors = req.validationErrors();

    if(errors){

      var errorMessages = [];

      async.each(errors, function(errorItem, callback){

        errorMessages.push({

          "message": errorItem.msg,
          "param": errorItem.param

        });

        callback();

      }, function(err){

        console.log(errors);

        //create a new error
        customError = new Error('Validation Failed: ' + util.inspect(errors));
        customError.friendly = errorMessages;
        customError.status = 400;
        customError.statusType = 'fail';
        next(customError);

      });

    }else{

      next();

    }

    };

    middleware.createGovernmentOrganization = function(req, res, next){

        //santize
        req.sanitizeBody('name').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('telephone').whitelist(["-0123456789"]);
        req.sanitizeBody('address.postOfficeBoxNumber').whitelist(["0123456789POBOXpobox "]);
        req.sanitizeBody('address.postalCode').whitelist(["0123456789"]);
        req.sanitizeBody('address.streetAddress').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('address.addressRegion').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('address.addressLocality').whitelist(["-',.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);

        //validate
        req.checkBody('name', '@name parameter is undefined.').notEmpty();
        req.checkBody('email', '@email parameter is undefined.').notEmpty();
        req.checkBody('email', '@email value is not a valid email address.').isEmail();
        req.checkBody('telephone', '@telephone parameter is undefined.').notEmpty();
        req.checkBody('parentOrganization', '@parentOrganization parameter is not a valid mongoId.').optional().isMongoId();
        req.checkBody('organizationType', '@organizationType value is not one of Police Headquarters/Transport Headquarters/Licensing Office/Police Station.').optional().isIn(['Police Headquarters', 'Transport Headquarters', 'Licensing Office', 'Police Station']);


        //check for errors
        var errors = req.validationErrors();

        if(errors){

          var errorMessages = [];

          async.each(errors, function(errorItem, callback){

            errorMessages.push({

              "message": errorItem.msg,
              "param": errorItem.param

            });

            callback();

          }, function(err){

            console.log(errors);

            //create a new error
            customError = new Error('Validation Failed: ' + util.inspect(errors));
            customError.friendly = errorMessages;
            customError.status = 400;
            customError.statusType = 'fail';
            next(customError);

          });

        }else{

          next();

        }

    };

    middleware.createGovernmentOrganizationAdmin = function(req, res, next){

        //santize
        req.sanitizeBody('name.first').whitelist(["-'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('name.last').whitelist(["-'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('identification').whitelist(["-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ "]);

        //validate
        req.checkBody('name.first', '@name.first parameter is undefined.').notEmpty();
        req.checkBody('name.last', '@name.last parameter is undefined.').notEmpty();
        req.checkBody('identification', '@identification parameter is undefined.').notEmpty();
        req.checkBody('email', '@email parameter is undefined.').notEmpty();
        req.checkBody('email', '@email value is not a valid email address.').isEmail();
        req.checkBody('worksFor', '@worksFor parameter is undefined.').notEmpty();
        req.checkBody('worksFor', '@worksFor parameter is not a valid mongoId.').isMongoId();
        req.checkBody('administratorType', '@administratorType is not one of Transport Headquarters, Licensing Office, Police Headquarters or Police Office').isIn(['Transport Headquarters', 'Licensing Office', 'Police Headquarters', 'Police Office']);

        //check for errors
        var errors = req.validationErrors();

        if(errors){

          var errorMessages = [];

          async.each(errors, function(errorItem, callback){

            errorMessages.push({

              "message": errorItem.msg,
              "param": errorItem.param

            });

            callback();

          }, function(err){

            console.log(errors);

            //create a new error
            customError = new Error('Validation Failed: ' + util.inspect(errors));
            customError.friendly = errorMessages;
            customError.status = 400;
            customError.statusType = 'fail';
            next(customError);

          });

        }else{

          next();

        }

    };

    middleware.createOfficer = function(req, res, next){

        //santize
        req.sanitizeBody('name.first').whitelist(["-'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('name.last').whitelist(["-'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ "]);
        req.sanitizeBody('identification').whitelist(["-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ "]);

        //validate
        req.checkBody('name.first', '@name.first parameter is undefined.').notEmpty();
        req.checkBody('name.last', '@name.last parameter is undefined.').notEmpty();
        req.checkBody('identification', '@identification parameter is undefined.').notEmpty();
        req.checkBody('officerType', '@officerType is not one of Testing, Licensing or Police.').isIn(['Testing', 'Licensing', 'Police']);

        //check for errors
        var errors = req.validationErrors();

        if(errors){

        var errorMessages = [];

        async.each(errors, function(errorItem, callback){

          errorMessages.push({

            "message": errorItem.msg,
            "param": errorItem.param

          });

          callback();

        }, function(err){

          console.log(errors);

          //create a new error
          customError = new Error('Validation Failed: ' + util.inspect(errors));
          customError.friendly = errorMessages;
          customError.status = 400;
          customError.statusType = 'fail';
          next(customError);

        });

        }else{

        next();

        }

    };

    middleware.getOwnVehicle = function(req, res, next){

        //validate
        req.checkParams('id', '@id parameter is undefined.').notEmpty();
        req.checkParams('id', '@id value is not a valid mongoId.').isMongoId();

        //check for errors
        var errors = req.validationErrors();

        if(errors){

        var errorMessages = [];

        async.each(errors, function(errorItem, callback){

          errorMessages.push({

            "message": errorItem.msg,
            "param": errorItem.param

          });

          callback();

        }, function(err){

          console.log(errors);

          //create a new error
          customError = new Error('Validation Failed: ' + util.inspect(errors));
          customError.friendly = errorMessages;
          customError.status = 400;
          customError.statusType = 'fail';
          next(customError);

        });

        }else{

        next();

        }

    };

    middleware.getOwnVehicleToken = function(req, res, next){

        //validate
        req.checkParams('id', '@id parameter is undefined.').notEmpty();
        req.checkParams('id', '@id value is not a valid mongoId.').isMongoId();

        //check for errors
        var errors = req.validationErrors();

        if(errors){

        var errorMessages = [];

        async.each(errors, function(errorItem, callback){

          errorMessages.push({

            "message": errorItem.msg,
            "param": errorItem.param

          });

          callback();

        }, function(err){

          console.log(errors);

          //create a new error
          customError = new Error('Validation Failed: ' + util.inspect(errors));
          customError.friendly = errorMessages;
          customError.status = 400;
          customError.statusType = 'fail';
          next(customError);

        });

        }else{

        next();

        }

    };

    middleware.getOwnVehicleTokens = function(req, res, next){

        //validate
        req.checkParams('id', '@id parameter is undefined.').notEmpty();
        req.checkParams('id', '@id value is not a valid mongoId.').isMongoId();
        req.checkQuery('payment_status', '@payment_status value is not one of Complete or Due').optional().isIn(['Complete', 'Due']);

        //check for errors
        var errors = req.validationErrors();

        if(errors){

        var errorMessages = [];

        async.each(errors, function(errorItem, callback){

          errorMessages.push({

            "message": errorItem.msg,
            "param": errorItem.param

          });

          callback();

        }, function(err){

          console.log(errors);

          //create a new error
          customError = new Error('Validation Failed: ' + util.inspect(errors));
          customError.friendly = errorMessages;
          customError.status = 400;
          customError.statusType = 'fail';
          next(customError);

        });

        }else{

        next();

        }

    };

  //export middleware
  module.exports = middleware;

})();
