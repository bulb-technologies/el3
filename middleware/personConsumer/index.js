(function(){

    var customError;
    var middleware = {};
    var async = require('async');
    var models = require(_ + 'models');
    var TokenModel = models.tokenModel;
    var jsonpatch = require('fast-json-patch');
    var VehicleModel = models.vehicleModel;
    var OffenceModel = models.offenceModel;
    var TestModel = models.testModel;
    var StudentModel = models.studentModel;
    var PersonConsumerModel = models.personConsumerModel;

    //define middleware here

    middleware.getOwnAccount = function(req, res, next){

        PersonConsumerModel.findById('58c2e83ec9df6709149dab5b') // TODO: Get id from session
        .select('-_id -lastModified')
        .lean()
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

    middleware.updateOwnAccount = function(req, res, next){

        var details = req.body;

        async.auto({

            getConsumer: function(callback){

                PersonConsumerModel.findById('58c2e83ec9df6709149dab5b') // TODO: Get id from session
                .exec(function(err, consumer){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        callback(err);

                    }else{

                        callback(null, consumer);

                    }

                });

            },

            validatePatch: ['getConsumer', function(results, callback){

                var consumer = results.getConsumer;

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
                    '/name',
                    '/identification',
                    '/telephone',
                    '/nationality',
                    '/created',
                    '/lastModified',
                    '/emergency/*/created',
                    '/driversLicence/rfidTagSerialNumber'
                ];

                //Short code
                function matchRuleShort(str, rule){
                    return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
                }

                async.map(details.patches, function(item, callback){

                    callback(null, item.path);

                }, function(err, results){

                    async.each(unwantedPaths, function(unwantedPath, callback){

                        async.each(results, function(suppliedPath, callback){

                            if(matchRuleShort(suppliedPath, unwantedPath)){

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

                var consumer = results.getConsumer;

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

    middleware.getOwnVehicles = function(req, res, next){

        VehicleModel.find({'owner.person': '58c2e83ec9df6709149dab5b'}) // TODO: Get id from session
        .select('numberPlate')
        .lean()
        .exec(function(err, vehicles){

            if(err){

              //db error
              err.friendly = 'Something went wrong. Please try again.';
              err.status = 500;
              err.statusType = 'error';
              next(err);

            }else{

                //create temporary store
                req.tmp = {};
                req.tmp.vehicles = vehicles;
                next();

            }

        });

    };

    middleware.getOwnVehicle = function(cache){

      return function(req, res, next){

        var details = req.params;

        async.auto({

            findVehicle: function(callback){

              VehicleModel.findOne({'_id': details.id, 'owner.person': '58c2e83ec9df6709149dab5b'}) // TODO: Get id from session
              .select('created vehicleClass numberPlate')
              .lean()
              .exec(function(err, vehicle){

                if(err){

                  //db error
                  err.friendly = 'Something went wrong. Please try again.';
                  err.status = 500;
                  err.statusType = 'error';
                  next(err);

                }else{

                  if (vehicle) {

                    callback(null, vehicle);

                  } else {

                    customError = new Error('Vehicle not found.');
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                  }

                }

              });

            },

            groupTokens: ['findVehicle', function (results, callback) {

              var vehicle = results.findVehicle;

              TokenModel.aggregate([

                //match
                {"$match": {"vehicle": vehicle._id}},
                {"$group": {"_id": {"name": "$name", "taxType": "$taxType", "taxID": "$taxID"}}}

              ])
              .exec(function (err, result) {

                if (err) {

                  //node cache error
                  err.friendly = 'Something went wrong. Please try again.';
                  err.status = 500;
                  err.statusType = 'error';
                  callback(err);

                } else {

                  //create temporary store
                  req.tmp = {};

                  //map aggregate result to vehicle taxes to show taxes the vehicle is and has been susbribed to
                  if (result.length) {

                    async.map(result, function (element, callback) {

                      callback(null, element._id);

                    }, function (err, results) {

                      vehicle.taxes = results;
                      req.tmp.vehicle = vehicle;
                      callback();

                    });

                  } else {

                    vehicle.taxes = [];
                    req.tmp.vehicle = vehicle;
                    callback();

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

      }

    };

    middleware.getOwnVehicleTokens = function(req, res, next){

        var details = req.query;

        async.auto({

            findVehicle: function(callback){

                VehicleModel.findOne({'_id': details.vehicle, 'owner.person': '58c2e83ec9df6709149dab5b'}) // TODO: Get id from session
                .select('_id')
                .lean()
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

            getTokens: ['findVehicle', function(results, callback){

                //query builder
                var q = TokenModel.find({'vehicle': results.findVehicle._id, 'taxID': details.tax_id});

                if(details.payment_status == 'Complete'){

                    q.where({'paymentStatus': 'Complete'})

                }

                if(details.payment_status == 'Due'){

                    q.where({'paymentStatus': 'Due'})

                }

                q.select('validUntil paymentStatus taxType')
                .lean()
                .exec(function(err, tokens){

                    if(err){

                      //db error
                      err.friendly = 'Something went wrong. Please try again.';
                      err.status = 500;
                      err.statusType = 'error';
                      callback(err);

                  }else{

                      //create temporary store
                      req.tmp = {};
                      req.tmp.tokens = tokens
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

    middleware.getOwnVehicleToken = function(req, res, next){

        var details = req.params;

        TokenModel.findById(details.id)
        .populate({

            'path': 'vehicle',
            'select': 'owner numberPlate'

        })
        .lean()
        .exec(function(err, token){

            if(err){

                //db error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                next(err);

            }else{

                if(token){

                    if(token.vehicle.owner.person.toString() == '58c2e83ec9df6709149dab5b'){ // TODO: Get id from session

                        //delete vehicle property
                        delete token.vehicle;

                        if(token.paymentStatus == 'Due'){

                            //delete payment  proof since the token isnt paid for
                            delete token.authPair;

                        }

                        //create temporary store
                        req.tmp = {};
                        req.tmp.token = token
                        next();

                    }else{

                        customError = new Error('Token doesn\'t belong to vehicle ' + token.vehicle.numberPlate +  '.');
                        customError.status = 403;
                        customError.statusType = 'fail';
                        next(customError);

                    }

                }else{

                    customError = new Error('Token not found.');
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                }

            }

        });

    };

    middleware.getOwnVehicleOffences = function(req, res, next){

        var details = req.query;

        async.auto({

            findVehicle: function(callback){

                VehicleModel.findOne({'_id': details.vehicle, 'owner.person': '58c2e83ec9df6709149dab5b'}) // TODO: Get id from session
                .select('_id')
                .lean()
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

            getOffences: ['findVehicle', function(results, callback){

              var vehicle = results.findVehicle;

                //query builder
                var q = OffenceModel.find({'vehicle': vehicle._id});

                if(details.payment_status == 'complete'){

                    q.where({'paymentStatus': 'Complete'})

                }

                if(details.payment_status == 'due'){

                    q.where({'paymentStatus': 'Due'})

                }

                q.select('dateCommitted paymentStatus paymentDueDate')
                .lean()
                .exec(function(err, offences){

                    if(err){

                      //db error
                      err.friendly = 'Something went wrong. Please try again.';
                      err.status = 500;
                      err.statusType = 'error';
                      callback(err);

                  }else{

                      //create temporary store
                      req.tmp = {};
                      req.tmp.offences = offences
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

    middleware.getOwnVehicleOffence = function(req, res, next){

        var details = req.params;

        OffenceModel.findById(details.id)
        .populate({

            'path': 'vehicle',
            'select': 'owner numberPlate'

        })
        .lean()
        .exec(function(err, offence){

            if(err){

                //db error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                next(err);

            }else{

                if(offence){

                    if(offence.vehicle.owner.person.toString() == '58c2e83ec9df6709149dab5b'){ // TODO: Get id from session

                        //delete vehicle property
                        delete offence.vehicle;

                        //create temporary store
                        req.tmp = {};
                        req.tmp.offence = offence
                        next();

                    }else{

                        customError = new Error('Offence doesn\'t belong to vehicle ' + offence.vehicle.numberPlate +  '.');
                        customError.status = 403;
                        customError.statusType = 'fail';
                        next(customError);

                    }

                }else{

                    customError = new Error('Offence not found.');
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                }

            }

        });

    };

    middleware.createTest = function (req, res, next) {

      var details = req.body;

      //check for duplicate booking
      //check for correct booking order

      async.auto({

        createTest: function (callback) {

          //create instance of testModel
          var newTest = new TestModel();
          console.log(newTest);

          callback();

        }

      }, function (err, results) {

        if (err) {

          next(err);

        } else {

          next();

        }

      });

    };

    middleware.createStudent = function (req, res, next) {

      var details = req.body;

      //create instance of StudentModel
      var newStudent =  new StudentModel();
      newStudent.name.first = details.name.first;
      newStudent.name.last = details.name.last;
      newStudent.identification = details.identification;
      newStudent.nationality = details.nationality;

      //save
      newStudent.save(function (err) {

        if (err) {

          // TODO: Proper error handling
          next(err);

        } else {

          //create temporary store
          req.tmp = {};
          req.tmp.student = newStudent._id;
          next();

        }

      });

    };

    middleware.getStudentByIdentificationAndNationality = function (req, res, next) {

      var details = req.params;

      StudentModel.findOne({'identification': details.identification, 'nationality': details.nationality})
      .exec(function (err, student) {

        if (err) {

          //db error
          err.friendly = 'Something went wrong. Please try again.';
          err.status = 500;
          err.statusType = 'error';
          next(err);

        } else {

          if (student) {

            //create temporary store
            req.tmp = {};
            req.tmp.student = student;
            next();

          } else {

            customError = new Error('Student not found.');
            customError.status = 404;
            customError.statusType = 'fail';
            next(customError);

          }

        }

      });


    };

    //export middleware
    module.exports = middleware;

})();
