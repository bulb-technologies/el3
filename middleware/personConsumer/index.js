(function(){

    var customError;
    var middleware = {};
    var async = require('async');
    var models = require(_ + 'models');
    var TokenModel = models.tokenModel;
    var VehicleModel = models.vehicleModel;
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

        next();

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
                    .select('licences permits created vehicleClass numberPlate')
                    .lean()
                    .exec(function(err, vehicle){

                        if(err){

                          //db error
                          err.friendly = 'Something went wrong. Please try again.';
                          err.status = 500;
                          err.statusType = 'error';
                          next(err);

                        }else{

                            if(vehicle){

                                callback(null, vehicle);

                            }else{

                                customError = new Error('Vehicle not found.');
                                customError.status = 404;
                                customError.statusType = 'fail';
                                next(customError);

                            }

                        }

                    });

                },

                getTaxesFromCache: ['findVehicle', function(results, callback){

                    cache.get(process.env.TAXES_CACHE, function(err, value){

                        if(err){

                            //node cache error
                            err.friendly = 'Something went wrong. Please try again.';
                            err.status = 500;
                            err.statusType = 'error';
                            callback(err);

                        }else{

                            var parsedData;

                            //parse data as json
                            try{

                                parsedData = JSON.parse(value);

                                callback(null, parsedData);

                            }catch(e){

                                callback(e);

                            }

                        }

                    });

                }],

                populateTaxes: ['getTaxesFromCache', function(results, callback){

                    var vehicle = results.findVehicle;
                    var licences = results.getTaxesFromCache.vehicleLicenses;
                    var permits = results.getTaxesFromCache.vehiclePermits;

                    //find in licences and permits
                    async.parallel({

                        findInLicences: function(callback){

                            var licencesWanted  = [];

                            //traverse licences in vehicle
                            async.each(vehicle.licences, function(licenceInVehicle, callback){

                                //traverse list of cached licences
                                async.each(licences, function(licenceInCache, callback){

                                    if(licenceInCache.id == licenceInVehicle){

                                        licencesWanted.push({'name': licenceInCache.name, 'id': licenceInCache.id});

                                    }

                                    callback();

                                }, function(err){

                                    if(err){

                                        callback(err);

                                    }else{

                                        callback();

                                    }

                                });

                            }, function(err){

                                if(err){

                                    callback(err);

                                }else{

                                    callback(null, licencesWanted);

                                }

                            });

                        },

                        findInPermits: function(callback){

                            var permitsWanted  = [];

                            //traverse permits in vehicle
                            async.each(vehicle.permits, function(permitInVehicle, callback){

                                //traverse list of cached permits
                                async.each(permits, function(permitInCache, callback){

                                    if(permitInCache.id == permitInVehicle){

                                        permitsWanted.push({'name': permitInCache.name, 'id': permitInCache.id});

                                    }

                                    callback();

                                }, function(err){

                                    if(err){

                                        callback(err);

                                    }else{

                                        callback();

                                    }

                                });

                            }, function(err){

                                if(err){

                                    callback(err);

                                }else{

                                    callback(null, permitsWanted);

                                }

                            });

                        }

                    }, function(err, results){

                        if(err){

                            callback(err);

                        }else{

                            //replace in vehicle object
                            vehicle.permits = results.findInPermits;
                            vehicle.licences = results.findInLicences;

                            //create temporary store
                            req.tmp = {};
                            req.tmp.vehicle = vehicle;

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

        }

    };

    middleware.getOwnVehicleTokens = function(req, res, next){

        var details = req.params;

        async.auto({

            findVehicle: function(callback){

                VehicleModel.findOne({'_id': details.id, 'owner.person': '58c2e83ec9df6709149dab5b'}) // TODO: Get id from session
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
                var q = TokenModel.find({'vehicle': results.findVehicle._id, 'taxID': req.query.tax_id});

                if(req.query.payment_status == 'Complete'){

                    q.where({'paymentStatus': 'Complete'})

                }

                if(req.query.payment_status == 'Due'){

                    q.where({'paymentStatus': 'Due'})

                }

                q.select('name validUntil paymentDueDate paymentStatus taxType')
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

    }

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

                            //delete late payment  proof since the token isnt paid for
                            delete token.latePaymentProof;

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

    //export middleware
    module.exports = middleware;

})();
