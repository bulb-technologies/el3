(function () {

  var customError;
  var middleware = {};
  var async = require('async');
  var moment = require('moment');
  var models = require(_ + 'models');
  var OffenceModel = models.offenceModel;
  var VehicleModel = models.vehicleModel;
  var utilities = require(_ + 'utilities');
  const PAYMENT_DUE_BUFFER = 30; // TODO: make this an env variable

  //define middleware here

  //create an offence
  middleware.createOffence = function (req, res, next) {

    var details = req.body;
    var now = moment();

    async.auto({

      findVehicle: function(callback){

        VehicleModel.findOne({'numberPlate': details.numberPlate})
        .select('_id')
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

      getOffenceCount: ['findVehicle', function (results, callback) {

        var vehicle = results.findVehicle;

        //find all offences by vehicle in the current year
        OffenceModel.find({'vehicle': vehicle._id, '$and': [{'created': {'$gte': now.startOf('y').toISOString()}, 'created': {'$lte': now.endOf('y').toISOString()}}]})
        .count(function (err, count) {

          if (err) {

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            callback(err);

          } else {

            callback(null, count + 1);

          }

        });

      }],

      createAndSaveOffence: ['getOffenceCount', function (results, callback) {

        var count = results.getOffenceCount;
        var vehicle = results.findVehicle;

        //create instance of OffenceModel
        var newOffence = new OffenceModel();
        newOffence.vehicle = vehicle._id;
        newOffence.ticketReference = details.ticketReference;
        newOffence.minimumPaymentDue = details.amount;
        newOffence.dateCommitted = details.dateCommitted;
        newOffence.telephone = details.telephone;
        newOffence.paymentReference = '1' + now.year().toString() + count; //char @ position 0; 1 denotes a traffic offence payment, while 0 denotes a licence/permit payment
        newOffence.paymentDueDate = moment().add(PAYMENT_DUE_BUFFER, 'd');

        if (details.paymentStatus) {

          newOffence.paymentStatus = details.paymentStatus;

        }

        //save
        newOffence.save(function (err) {

          if (err) {

            callback(err);

          } else {

            //create temporary store
            req.tmp = {};
            req.tmp.offence = newOffence._id;

            callback();

          }

        });

      }]

    }, function (err, results) {

      if (err) {

        next(err);

      } else {

        next();

      }

    });

  };

  //get a list of offence
  middleware.getOffences = function (req, res, next) {

    var details = req.query;

    //use query builder
    var q = OffenceModel.find();

    if (details.from) {

      q.where({'dateCommitted': {'$gte': moment(details.from).toISOString()}});

    }

    if (details.until) {

      q.where({'dateCommitted': {'$lte': moment(details.until).toISOString()}});

    }

    if (details.payment_status) {

      q.where({'paymentStatus': utilities.capitalizeString(details.payment_status)})

    }

    if (details.vehicle) {

      q.where({'vehicle': details.vehicle})

    }

    q.exec(function (err, offences) {

      if (err) {

        //db error
        err.friendly = 'Something went wrong. Please try again.';
        err.status = 500;
        err.statusType = 'error';
        next(err);

      } else {

        //create temporary store
        req.tmp = {};
        req.tmp.offences = offences;

        next();

      }

    });

  };

  //get offence by id
  middleware.getOffenceById = function (req, res, next) {

    var details = req.params;

    OffenceModel.findById(details.id)
    .exec(function(err, offence){

      if(err){

        //db error
        err.friendly = 'Something went wrong. Please try again.';
        err.status = 500;
        err.statusType = 'error';
        next(err);

      }else{

        if(offence){

          //create temporary store
          req.tmp = {};
          req.tmp.offence = offence;

          next();

        }else{

          customError = new Error('Offence not found.');
          customError.status = 404;
          customError.statusType = 'fail';
          next(customError);

        }

      }

    });

  };

  //get offence by ticketReference
  middleware.getOffenceByTicketReference = function (req, res, next) {

    var details = req.params;

    OffenceModel.findOne({'ticketReference': details.ticketReference})
    .exec(function(err, offence){

      if(err){

        //db error
        err.friendly = 'Something went wrong. Please try again.';
        err.status = 500;
        err.statusType = 'error';
        next(err);

      }else{

        if(offence){

          //create temporary store
          req.tmp = {};
          req.tmp.offence = offence;

          next();

        }else{

          customError = new Error('Offence not found.');
          customError.status = 404;
          customError.statusType = 'fail';
          next(customError);

        }

      }

    });

  };

  //get vehicle by numberPlate
  middleware.getVehicleByNumberPlate = function (req, res, next) {

    var details = req.params;

    VehicleModel.findOne({'numberPlate': details.numberPlate})
    .select('owner vehicleClass vehicleUse')
    .populate({

      'path': 'owner.person',
      'select': '-_id name telephone identification'

    })
    .populate({

      'path': 'owner.organization',
      'select': '-_id name email telephone identification'

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

  //export middleware
  module.exports = middleware;

})();
