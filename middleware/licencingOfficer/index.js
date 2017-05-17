(function(){

  var customError;
  var middleware = {};
  var fs = require('fs');
  var async = require('async');
  var moment = require('moment');
  var models = require(_ + 'models');
  var jsrsasign = require('jsrsasign');
  var utilities = require(_ + 'utilities');
  var jsonpatch = require('fast-json-patch');
  var TokenModel = models.tokenModel;
  var VehicleModel = models.vehicleModel;
  var ProductModel = models.productModel;
  var ActivityLogModel = models.activityLogModel;
  var IndividualProductModel = models.individualProductModel;
  var PersonConsumerModel = models.personConsumerModel;
  var OrganizationConsumerModel = models.organizationConsumerModel;
  var KEYUTIL = jsrsasign.KEYUTIL;

  //define middleware here

    middleware.createPersonConsumer = function(req, res, next){

      var details = req.body;

      //create an instance of PersonConsumerModel
      var newConsumer = new PersonConsumerModel();
      newConsumer.name.first = details.name.first;
      newConsumer.name.last = details.name.last;
      newConsumer.identification = details.identification;
      newConsumer.telephone = details.telephone;
      newConsumer.country = details.country;

      //save
      newConsumer.save(function(err){

          if(err){

              next(err); // TODO: Properly handle save error to make more readable

          }else{

              //create temporary store
              req.tmp = {};
              req.tmp.consumer = newConsumer._id;
              next();

          }

      });

    };

    middleware.getPersonConsumer = function(req, res, next){

      var details = req.query;

      PersonConsumerModel.findOne({'identification': details.identification})
      .exec(function(err, consumer){

          if(err){

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            next(err);

          }else{

              if(consumer){

                  //create temporary store
                  req.tmp = {};
                  req.tmp.consumer = consumer;
                  next();

              }else{

                  customError = new Error('Consumer not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  next(customError);

              }

          }

      });

    };

    middleware.updatePersonConsumer = function(req, res, next){

        var details = req.body;

        async.auto({

            findConsumer: function(callback){

                PersonConsumerModel.findById(req.params.id)
                .exec(function(err, consumer){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        if(consumer){

                            callback(null, consumer);

                        }else{

                            customError = new Error('Consumer not found.');
                            customError.status = 404;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            },

            validatePatch: ['findConsumer', function(results, callback){

                var consumer = results.findConsumer;

                try{

                    var errors = jsonpatch.validate(details.patches, consumer);

                }catch(e){

                    err.friendly = 'Something went wrong. Please try again.';
                    err.status = 500;
                    err.statusType = 'error';
                    callback(err);

                }

                if(errors === undefined){

                    callback();

                }else{

                    callback(errors);

                }

            }],

            checkForBlacklistedPaths: ['validatePatch', function(results, callback){

                var unwantedPaths = [
                    '/_id',
                    '/__v',
                    '/name/*',
                    '/telephone',
                    '/created',
                    '/nationality',
                    '/emergency/*',
                    '/lastModified',
                    '/identification'
                ];

                async.map(details.patches, function(item, callback){

                    callback(null, item.path);

                }, function(err, results){

                    async.each(unwantedPaths, function(unwantedPath, callback){

                        async.each(results, function(suppliedPath, callback){

                            if(utilities.matchPath(suppliedPath, unwantedPath)){

                                callback(suppliedPath);

                            }else{

                                callback();

                            }

                        }, function(err){

                            if(err){

                                callback(err);

                            }else{

                                callback();

                            }

                        });

                    }, function(err){

                        if(err){

                          //create a new error
                          customError = new Error('Modifying value at path: \"' + err + '\" is forbidden.');
                          customError.status = 403;
                          customError.statusType = 'fail';
                          callback(customError);

                        }else{

                          callback();

                        }

                    });

                });


            }],

            applyPatch: ['checkForBlacklistedPaths', function(results, callback){

              var consumer = results.findConsumer;

              jsonpatch.apply(consumer, details.patches);

              //check if drivers licence rfidTagSerialNumber is modified
              if (consumer.isModified('driversLicence.rfidTagSerialNumber')) {

                //check if rfidTagSerialNumber is registered
                IndividualProductModel.find({"individualProductType": "RFID Tag", "serialNumber": consumer.driversLicence.rfidTagSerialNumber})
                .count(function (err, count) {

                  if (err) {

                    //db error
                    err.friendly = 'Something went wrong. Please try again.';
                    err.status = 500;
                    err.statusType = 'error';
                    callback(err);

                  } else {

                    if (count) {

                      //check if RFID Tag is already in use
                      async.parallel({

                        findInVehicles: function (callback) {

                          VehicleModel.findOne({'rfidTagSerialNumber': consumer.driversLicence.rfidTagSerialNumber})
                          .count(function(err, count){

                            if(err){

                              //db error
                              err.friendly = 'Something went wrong. Please try again.';
                              err.status = 500;
                              err.statusType = 'error';
                              callback(err);

                            }else{

                              if(count){

                                callback(null, true);

                              }else{

                                callback();

                              }

                            }

                          });

                        },

                        findInPersonConsumers: function(callback){

                          PersonConsumerModel.findOne({'driversLicence.rfidTagSerialNumber': consumer.driversLicence.rfidTagSerialNumber})
                          .count(function(err, count){

                            if(err){

                              //db error
                              err.friendly = 'Something went wrong. Please try again.';
                              err.status = 500;
                              err.statusType = 'error';
                              callback(err);

                            }else{

                              if(count){

                                callback(null, true);

                              }else{

                                callback();

                              }

                            }

                          });

                        }

                      }, function(err, results){

                          if(err){

                            callback(err);

                          }else{

                            if(results.findInPersonConsumers !== undefined && results.findInVehicles !== undefined){

                              callback();

                            }else{

                              customError = new Error('RFID Tag already in use.');
                              customError.status = 403;
                              customError.statusType = 'fail';
                              callback(customError);

                            }

                          }

                      });

                    } else {

                      //create a new error
                      customError = new Error('RFID Tag is not registered');
                      customError.status = 403;
                      customError.statusType = 'fail';
                      callback(customError);

                    }

                  }

                });

              } else {

                callback();

              }

            }],

            update: ['applyPatch', function (results, callback) {

              var consumer = results.findConsumer;

              //save
              consumer.save(function(err){

                  if(err){ // TODO: address save errors properly

                      //db error
                      err.friendly = 'Something went wrong. Please try again.';
                      err.status = 500;
                      err.statusType = 'error';
                      callback(err);

                  }else{

                      callback();

                  }

              });

            }],

        }, function(err, results){

            if(err){

                next(err);

            }else{

                next();

            }

        });

    };

    middleware.createOrganizationConsumer = function(req, res, next){

      var details = req.body;

      //create an instance of OrganizationConsumerModel
      var newConsumer = new OrganizationConsumerModel();
      newConsumer.name = details.name;
      newConsumer.identification = details.identification;
      newConsumer.telephone = (details.telephone) ? details.telephone : undefined;
      newConsumer.email = details.email;

      //save
      newConsumer.save(function(err){

          if(err){

              next(err); // TODO: Properly handle save error to make more readable

          }else{

              //create temporary store
              req.tmp = {};
              req.tmp.consumer = newConsumer._id;
              next();

          }

      });

    };

    middleware.getOrganizationConsumer = function(req, res, next){

      var details = req.query;

      OrganizationConsumerModel.findOne({'identification': details.identification})
      .exec(function(err, consumer){

          if(err){

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            next(err);

          }else{

              if(consumer){

                  //create temporary store
                  req.tmp = {};
                  req.tmp.consumer = consumer;
                  next();

              }else{

                  customError = new Error('Consumer not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  next(customError);

              }

          }

      });

    };

    middleware.updateOrganizationConsumer = function(req, res, next){

        var details = req.body;

        async.auto({

            findConsumer: function(callback){

                OrganizationConsumerModel.findById(req.params.id)
                .exec(function(err, consumer){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        if(consumer){

                            callback(null, consumer);

                        }else{

                            customError = new Error('Consumer not found.');
                            customError.status = 404;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            },

            validatePatch: ['findConsumer', function(results, callback){

                var consumer = results.findConsumer;

                try{

                    var errors = jsonpatch.validate(details.patches, consumer);

                }catch(e){

                    err.friendly = 'Something went wrong. Please try again.';
                    err.status = 500;
                    err.statusType = 'error';
                    callback(err);

                }

                if(errors === undefined){

                    callback();

                }else{

                    callback(errors);

                }

            }],

            checkForBlacklistedPaths: ['validatePatch', function(results, callback){

                var unwantedPaths = [
                    '/*'
                ];

                async.map(details.patches, function(item, callback){

                    callback(null, item.path);

                }, function(err, results){

                    async.each(unwantedPaths, function(unwantedPath, callback){

                        async.each(results, function(suppliedPath, callback){

                            if(utilities.matchPath(suppliedPath, unwantedPath)){

                                callback(suppliedPath);

                            }else{

                                callback();

                            }

                        }, function(err){

                            if(err){

                                callback(err);

                            }else{

                                callback();

                            }

                        });

                    }, function(err){

                        if(err){

                            //create a new error
                            customError = new Error('Modifying value at path: \"' + err + '\" is forbidden.');
                            customError.status = 403;
                            customError.statusType = 'fail';
                            callback(customError);

                        }else{

                            callback();

                        }

                    });

                });


            }],

            applyPatchAndUpdate: ['checkForBlacklistedPaths', function(results, callback){

                var consumer = results.findConsumer;

                jsonpatch.apply(consumer, details.patches);

                //save
                consumer.save(function(err){

                    if(err){ // TODO: address save errors properly

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        callback();

                    }

                });

            }]

        }, function(err, results){

            if(err){

                next(err);

            }else{

                next();

            }

        });

    };

    middleware.createVehicle = function(req, res, next){

        var details = req.body;

        async.auto({

            findConsumer: function(callback){

                //find either person or organization consumer
                async.parallel({

                    person: function(callback){

                        PersonConsumerModel.findById(details.owner)
                        .select('_id')
                        .exec(function(err, consumer){

                            if(err){

                                //db error
                                err.friendly = 'Something went wrong. Please try again.';
                                err.status = 500;
                                err.statusType = 'error';
                                callback(err);

                            }else{

                                if(consumer){

                                    callback(null, {'consumerType':'person', 'consumerID': consumer._id});

                                }else{

                                    callback();

                                }

                            }

                        });

                    },

                    organization: function(callback){

                        OrganizationConsumerModel.findById(details.owner)
                        .select('_id')
                        .exec(function(err, consumer){

                            if(err){

                                //db error
                                err.friendly = 'Something went wrong. Please try again.';
                                err.status = 500;
                                err.statusType = 'error';
                                callback(err);

                            }else{

                                if(consumer){

                                    callback(null, {'consumerType':'organization', 'consumerID': consumer._id});

                                }else{

                                    callback();

                                }

                            }

                        });

                    }

                }, function(err, results){

                    if(err){

                        callback(err);

                    }else{

                        //check if there is any result
                        var r = (results.person) ? results.person : results.organization;

                        if(r){

                            callback(null, r);

                        }else{

                            customError = new Error('Consumer not found.');
                            customError.status = 404;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            },

            validateRFID: ['findConsumer', function(results, callback){

                //find where product is rfid tag
                IndividualProductModel.findOne({'serialNumber': details.rfidTagSerialNumber})
                .populate({

                    'path': 'product',
                    'select': 'productType _-id'

                })
                .exec(function(err, individualProduct){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        if(individualProduct){

                            //check if serial belongs to product of type rfid Tag
                            if(individualProduct.product.productType == 'RFID Tag'){

                                callback();

                            }else{

                                customError = new Error('RFID Tag only.');
                                customError.status = 403;
                                customError.statusType = 'fail';
                                callback(customError);

                            }

                        }else{

                            customError = new Error('RFID Tag not found.');
                            customError.status = 404;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            }],

            checkRFIDTagAvailability: ['validateRFID', function(results, callback){

                async.parallel({

                    findInVehicles: function(callback){

                        VehicleModel.findOne({'rfidTagSerialNumber': details.rfidTagSerialNumber})
                        .count(function(err, count){

                            if(err){

                                //db error
                                err.friendly = 'Something went wrong. Please try again.';
                                err.status = 500;
                                err.statusType = 'error';
                                callback(err);

                            }else{

                                if(count){

                                    callback(null, true);

                                }else{

                                    callback();

                                }

                            }

                        });

                    },

                    findInPersonConsumers: function(callback){

                        PersonConsumerModel.findOne({'driversLicence.rfidTagSerialNumber': details.rfidTagSerialNumber})
                        .count(function(err, count){

                            if(err){

                                //db error
                                err.friendly = 'Something went wrong. Please try again.';
                                err.status = 500;
                                err.statusType = 'error';
                                callback(err);

                            }else{

                                if(count){

                                    callback(null, true);

                                }else{

                                    callback();

                                }

                            }

                        });

                    }

                }, function(err, results){

                    if(err){

                        callback(err);

                    }else{

                        if(results.findInPersonConsumers !== undefined && results.findInVehicles !== undefined){

                            callback();

                        }else{

                            customError = new Error('RFID Tag already in use.');
                            customError.status = 403;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            }],

            createVehicle: ['checkRFIDTagAvailability', function(results, callback){

                var consumer = results.findConsumer.consumerID;
                var consumerType = results.findConsumer.consumerType;

                //create an instance of VehicleModel
                var newVehicle = new VehicleModel();

                newVehicle.numberPlate = details.numberPlate;
                newVehicle.vehicleClass = details.vehicleClass;
                newVehicle.rfidTagSerialNumber = details.rfidTagSerialNumber;

                if(consumerType == 'person'){

                    newVehicle.owner.person = consumer;

                }else{

                    newVehicle.owner.organization = consumer;

                }

                //save
                newVehicle.save(function(err){

                    if(err){

                        callback(err); // TODO: Properly handle save error to make more readable

                    }else{

                        //create temporary store
                        req.tmp = {};
                        req.tmp.vehicle = newVehicle._id;
                        callback();

                    }

                });

            }],

            logVehicleCreation: ['createVehicle', function(results, callback){

                //create instance of ActivityLogModel
                var newLog = new ActivityLogModel();
                console.log(newLog);

                /**newChangeLog.action = 'Create';
                newChangeLog.actor = req.session.uid;
                newChangeLog.subject = results.createNewVehicle.id;
                newChangeLog.notes = 'Created vehicle ' + results.createNewVehicle.id;

                //save
                newChangeLog.save(function(err){

                    if(err){

                        //database error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        callback();

                    }

                }); **/

                callback();

            }]

        }, function(err, results){

            if(err){

                next(err);

            }else{

                next();

            }

        });

    };

    middleware.getVehicle = function(req, res, next){

        var details = req.query;

        VehicleModel.findOne({'numberPlate': details.numberplate})
        .populate({

            'path': 'owner.person',
            'select': 'name identification'

        })
        .populate({

            'path': 'owner.organization',
            'select': 'name identification'

        })
        .exec(function(err, vehicle){

            if(err){

              //db error
              err.friendly = 'Something went wrong. Please try again.';
              err.status = 500;
              err.statusType = 'error';
              next(err);

            }else{

                if(vehicle){

                    //create temporary store
                    req.tmp = {};
                    req.tmp.vehicle = vehicle;
                    next();

                }else{

                    customError = new Error('Vehicle not found.');
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                }

            }

        });

    };

    middleware.updateVehicle = function(req, res, next){

        var details = req.body;

        async.auto({

            findVehicle: function(callback){

                VehicleModel.findById(req.params.id)
                .exec(function(err, vehicle){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        if(vehicle){

                            callback(null, vehicle);

                        }else{

                            customError = new Error('Vehicle not found.');
                            customError.status = 404;
                            customError.statusType = 'fail';
                            callback(customError);

                        }

                    }

                });

            },

            validatePatch: ['findVehicle', function(results, callback){

                var vehicle = results.findVehicle;

                try{

                    var errors = jsonpatch.validate(details.patches, vehicle);

                }catch(e){

                    err.friendly = 'Something went wrong. Please try again.';
                    err.status = 500;
                    err.statusType = 'error';
                    callback(err);

                }

                if(errors === undefined){

                    callback();

                }else{

                    callback(errors);

                }

            }],

            checkForBlacklistedPaths: ['validatePatch', function(results, callback){

                var unwantedPaths = [
                    '/_id',
                    '/__v',
                    '/created',
                    '/owner/*',
                    '/numberPlate',
                    '/vehicleUse',
                    '/vehicleClass',
                    '/lastModified'
                ];

                async.map(details.patches, function(item, callback){

                    callback(null, item.path);

                }, function(err, results){

                    async.each(unwantedPaths, function(unwantedPath, callback){

                        async.each(results, function(suppliedPath, callback){

                            if(utilities.matchPath(suppliedPath, unwantedPath)){

                                callback(suppliedPath);

                            }else{

                                callback();

                            }

                        }, function(err){

                            if(err){

                                callback(err);

                            }else{

                                callback();

                            }

                        });

                    }, function(err){

                        if(err){

                            //create a new error
                            customError = new Error('Modifying value at path: \"' + err + '\" is forbidden.');
                            customError.status = 403;
                            customError.statusType = 'fail';
                            callback(customError);

                        }else{

                            callback();

                        }

                    });

                });


            }],

            applyPatchAndUpdate: ['checkForBlacklistedPaths', function(results, callback){

                var vehicle = results.findVehicle;

                jsonpatch.apply(vehicle, details.patches);

                //save
                vehicle.save(function(err){

                    if(err){ // TODO: address save errors properly

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        callback();

                    }

                });

            }]

        }, function(err, results){

            if(err){

                next(err);

            }else{

                next();

            }

        });

    };

    middleware.getTaxes = function(cache){

    return function(req, res, next){

      var details = req.query;

      async.auto({

          getTaxesFromCache: function(callback){

            cache.get(process.env.TAXES_CACHE, function(err, value){

              if(err){

                //node cache error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                callback(err);

              }else{

                var parsedData;
                //create temporary store
                req.tmp = {};

                //parse data as json
                try{

                  parsedData = JSON.parse(value);

                  if(details.type == 'licence'){

                    //return only licence
                    callback(null, parsedData.categories.vehicleLicenses);

                  }else if(details.type == 'permit'){

                    //return only permits
                    callback(null, parsedData.categories.vehiclePermits);

                  }

                }catch(e){

                  callback(e);

                }

              }

            });

        },

        getTokens: ['getTaxesFromCache', function (results, callback) {

          var now = moment();
          var taxes = results.getTaxesFromCache;
          //create temporary store
          req.tmp = {};

          TokenModel.find({'$and': [{'validFrom': {'$lte': now.toISOString()}, 'validUntil': {'$gte': now.toISOString()}}]})
          .exec(function (err, tokens) {

            if (err) {

              //node cache error
              err.friendly = 'Something went wrong. Please try again.';
              err.status = 500;
              err.statusType = 'error';
              callback(err);

            } else {

              if (tokens.length > 0) {

                //traverse taxes
                async.each(taxes, function (tax, callback) {

                  tax.active = 0;

                  //traverse tokens
                  async.each(tokens, function (token, callback) {

                    //find where token matches the tax
                    if (token.taxID == tax.id) {tax.active++;}

                    callback();

                  }, function (err) {

                    callback();

                  });

                }, function (err) {

                  req.tmp.taxes = taxes;
                  callback();

                });

              }else{

                //traverse taxes
                async.each(taxes, function (tax, callback) {

                  //all taxes dont have an active token
                  tax.active = 0;

                  callback();

                }, function (err) {

                  req.tmp.taxes = taxes;
                  callback();

                });

              }

            }

          });

        }]

      }, function(err, results){

          if(err){

            next(err);

          }else{

            next();

          }

      });

    };

    };

    middleware.createToken = function(cache){

      return function(req, res, next){

         var details = req.body;

         //send to worker

         async.auto({

           getTaxesFromCache: function(callback){

             cache.get(process.env.TAXES_CACHE, function(err, value){

                 if(err){

                   //node cache error
                   err.friendly = 'Something went wrong. Please try again.';
                   err.status = 500;
                   err.statusType = 'error';
                   callback(err);

                 }else{

                   if (value) {

                     //parse data as json
                     try{

                       var parsedData = JSON.parse(value);

                       callback(null,  parsedData);

                     }catch(e){

                       callback(e);

                     }

                   } else {

                     customError = new Error('Failed to get tax definitions.');
                     customError.status = 500;
                     customError.statusType = 'error';
                     callback(customError);

                   }

                 }

             });

           },

           findVehicle: function(callback){

             VehicleModel.findById(details.vehicle)
             .exec(function(err, vehicle){

               if(err){

                 //db error
                 err.friendly = 'Something went wrong. Please try again.';
                 err.status = 500;
                 err.statusType = 'error';
                 callback(err);

               }else{

                 if(vehicle){

                   callback(null, vehicle);

                 }else{

                   customError = new Error('Vehicle not found.');
                   customError.status = 404;
                   customError.statusType = 'fail';
                   callback(customError);

                 }

               }

             });

           },

           findTaxAndCheckFee: ['getTaxesFromCache', function(results, callback){

               var i;
               var cachedTaxes = results.getTaxesFromCache.categories;

               if(details.taxType == 'licence' || details.taxType == 'permit'){

                   cachedTaxes = (details.taxType == 'licence') ? cachedTaxes.vehicleLicenses : cachedTaxes.vehiclePermits;

                   async.eachOf(cachedTaxes, function(cachedTax, key, callback){

                     //tax exists
                     if (cachedTax.id == details.tax) {i = key;}
                     callback();

                   }, function(err){

                       if(err){

                           callback(err);

                       }else{

                           if (i != undefined) {

                             var j;

                             //check for fee
                             async.eachOf(cachedTaxes[i].fees, function (fee, key, callback) {

                               //fee exists
                               if (fee.id == details.fee) {j = key;}
                               callback()

                             }, function (err) {

                               if (j != undefined) {

                                 callback(null, {'tax': cachedTaxes[i], 'fee': cachedTaxes[i].fees[j]});

                               } else {

                                 customError = new Error('Fee not found.');
                                 customError.status = 404;
                                 customError.statusType = 'fail';
                                 callback(customError);

                               }

                             });


                           } else {

                             customError = new Error('Tax not found.');
                             customError.status = 404;
                             customError.statusType = 'fail';
                             callback(customError);

                           }

                       }

                   });

              }else{

                  customError = new Error('Invalid tax type.');
                  customError.status = 403;
                  customError.statusType = 'fail';
                  callback(customError);

              }

           }],

           checkForClashes: ['findTaxAndCheckFee', 'findVehicle', function (results, callback) {

             var tax = results.findTaxAndCheckFee.tax;
             var now = moment();

             TokenModel.find({'vehicle': details.vehicle, '$and': [{'validFrom': {'$lte': now.toISOString()}, 'validUntil': {'$gte': now.toISOString()}}]})
             .exec(function (err, tokens) {

               if (err) {

                 //node cache error
                 err.friendly = 'Something went wrong. Please try again.';
                 err.status = 500;
                 err.statusType = 'error';
                 callback(err);

               } else {

                 if (tokens.length > 0) {

                   //traverse taxes
                   async.each(tokens, function (token, callback) {

                     //check for clashes
                     if (tax.clashes.indexOf(token.taxID) === -1) {

                       callback();

                     } else {

                       customError = new Error('Tax being registered for clashes with: ' + token.name);
                       customError.status = 403;
                       customError.statusType = 'fail';
                       callback(customError);

                     }

                   }, function (err) {

                     if (err) {

                       callback(err);

                     } else {

                       callback();

                     }

                   });

                 }else{

                   //nothing to clash with
                   callback();

                 }

               }

             });

           }],

           checkVehicleUse: ['checkForClashes', function (results, callback) {

             var vehicle = results.findVehicle;
             var tax = results.findTaxAndCheckFee.tax;

             if(tax.forVehicleUses.indexOf(vehicle.vehicleUse) !== -1){

                callback();

             }else{

               customError = new Error('Tax is not applicable to vehicle use: ' + vehicle.vehicleUse);
               customError.status = 403;
               customError.statusType = 'fail';
               callback(customError);

             }

           }],

           getDaysValid: ['checkVehicleUse', function(results, callback){

               var tax = results.findTaxAndCheckFee.tax;

                //check if property exists
                if(tax.duration.hasOwnProperty(details.duration)){

                    callback(null, tax.duration[details.duration].daysValid);

                }else{

                    customError = new Error('Supplied duration does not exist for supplied tax.');
                    customError.status = 400;
                    customError.statusType = 'fail';
                    callback(customError);

                }

           }],

           getPrivateKey: function (callback) {

             try {

               //read cert
               var ecPrivateKeyPEM = fs.readFileSync('ECPRV.cert', 'utf8');

               //check if cert has content written to it
               if (ecPrivateKeyPEM.length === 0) {

                 customError = new Error('Private Key PEM not found.');
                 customError.status = 500;
                 customError.statusType = 'fail';
                 callback(customError);

               } else {

                 callback(null, ecPrivateKeyPEM);

               }

             } catch (e) {

               callback(e);

             }

           },

           createToken: ['getDaysValid', 'findVehicle', 'getPrivateKey', function(results, callback){

             var tax = results.findTaxAndCheckFee.tax;
             var fee = results.findTaxAndCheckFee.fee;
             var daysValid = results.getDaysValid;
             var newToken = new TokenModel();

             newToken.name = tax.name;
             newToken.vehicle = details.vehicle;
             newToken.taxID = tax.id;
             newToken.feeID = details.fee;
             newToken.taxType = utilities.capitalizeString(details.taxType);
             newToken.minimumPaymentDue = fee[details.duration].amount;
             newToken.paymentDueDate = new Date();
             newToken.validFrom = new Date();
             newToken.validUntil = moment().add(daysValid, 'd');
             newToken.duration = details.duration;
             newToken.paymentStatus = 'Complete';
             newToken.authorized = true;

             callback(null, newToken);

           }],

           generateAuthPair: ['createToken', function (results, callback) {

             var vehicle = results.findVehicle;
             var newToken = results.createToken;
             var ecPrivateKeyPEM = results.getPrivateKey;

             //data to sign
             var objectToSign = {

               "tid": newToken.taxID,
               "fid": newToken.feeID,
               "vnp": vehicle.numberPlate,
               "vf": newToken.validFrom,
               "vu": newToken.validUntil

             };

             try {

               //stringify objectToSign and base64 encode
               var base64StringToSign = Buffer.from(JSON.stringify(objectToSign)).toString('base64');

               //sign
               var sig = new jsrsasign.crypto.Signature({'alg':'SHA1withECDSA'});
               sig.init(ecPrivateKeyPEM);
               sig.updateString(base64StringToSign);
               var signedString = sig.sign();

               //concat to unsigned string
               var authPair = base64StringToSign + ':' + signedString;

               //create temporary store
               req.tmp = {};
               req.tmp.token = newToken._id;
               req.tmp.authPair = newToken.authPair = authPair; //assign authPair property on newToken

               callback();

             } catch (e) {

               callback(e);

             }

           }],

           saveToken: ['generateAuthPair', function (results, callback) {

             var newToken = results.createToken;

             //save
             newToken.save(function(err){

               if(err){

                 callback(err); // TODO: Properly handle save error to make more readable

               }else{

                 callback();

               }

             });

           }]

         }, function(err, results)  {

             if (err) {

               next(err);

             } else {

               next();

             }

         });

     };

    };

    //export middleware
    module.exports = middleware;

})();
