(function(){

  var customError;
  var middleware = {};
  var async = require('async');
  var models = require(_ + 'models');
  var TokenModel = models.tokenModel;
  var VehicleModel = models.vehicleModel;

  //define middleware here

  //get vehicles
  middleware.getVehicles = function(req, res, next){

      //use query builder

      var q = VehicleModel.find();

      q.lean()
      .select('numberPlate rfidTagSerialNumber permits licences')
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

  //get tokens
  middleware.getTokens = function(req, res, next){

      //use query builder

      var q = TokenModel.find();

      q.lean()
      .exec(function(err, tokens){

          if(err){

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            next(err);

          }else{

              //create temporary store
              req.tmp = {};
              req.tmp.tokens = tokens;
              next();

          }

      });

  };

  middleware.getTaxes = function(cache){

      return function(req, res, next){

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
                          var taxesArray = [];

                          //parse data as json
                          try{

                              parsedData = JSON.parse(value);

                              for(var taxType in parsedData){

                                  if(parsedData.hasOwnProperty(taxType)){

                                      //find only arrays
                                      if(Object.prototype.toString.call(parsedData[taxType]) == '[object Array]'){

                                          //concat arrays
                                          taxesArray = taxesArray.concat(parsedData[taxType]);

                                      }

                                  }

                              }

                            //create temporary store
                            req.tmp = {};
                            req.tmp.taxes = taxesArray.map(function(tax){

                                return {"name": tax.name, "id": tax.id}

                            });

                            callback();

                          }catch(e){

                              callback(e);

                          }

                      }

                  });

              }

          }, function(err, results){

              if(err){

                  next(err);

              }else{

                  next();

              }

          });

      };

  }

  //export middleware
  module.exports = middleware;

})();
