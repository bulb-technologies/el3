var path = require('path');
//set _ global
global._ = path.join(__dirname, '/');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var evalidator = require('express-validator');
var bodyParser = require('body-parser');
var auth = require(_ + 'config/auth');
var session = require(_ + 'config/session');
var cache = require(_ + 'config/cache');
var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(evalidator({

    customValidators: {
        isArray: function(value){

            return Array.isArray(value);

        },
        containsMongoIds: function(value){

            if(Array.isArray(value)){

                //if array.length > 0 does it contain only mongoIds?
                if(value.length > 0){

                    return value.every(function(element){

                        return validator.isMongoId(element);

                    });

                }else{

                 return true;

                }

            }else{

                return false;

            }

        },
        xNotEmpty: function(value, arr, param){

            return arr.every(function(element){

                return validator.isIn(param, Object.keys(element));

            });

        },
        isX: function(value, arr, param){

            if(!Array.isArray(param)){

                return false;

            }

            return arr.every(function(element){

                return validator.isIn(element.op, param);

            });

        },
        isPathAbsolute: function(value, arr){

            if(!Array.isArray(arr)){

                return false;

            }

            return arr.every(function(element){

                return path.isAbsolute(element.path);

            });

        }

    }

}));
//app.use(cookieParser());

//add session
//app.use(session);

//passwordless middleware aliased: auth
//app.use(auth.sessionSupport());
//app.use(auth.acceptToken({ successRedirect: '/allocator'}));

//add static middleware
app.use(express.static(path.join(__dirname, 'bower_components')));
//app.use(express.static(path.join(__dirname, 'semantic/dist')));
app.use(express.static(path.join(__dirname, 'public')));

//load lib/submodules
app.use('/', require('./lib/web')(cache));
app.use('/native', require('./lib/native')(session));
app.use('/api', require('./lib/api')());

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
  next(err);

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {

    var msg = (err.friendly) ? err.friendly : err.message;

    console.log(err);

    res.status(err.status || 500);

    if(err.statusType){

      res.json({

        status: err.statusType, // fail
        data: {

          message: msg // If the reasons for failure correspond to POST values, the response object's keys SHOULD correspond to those POST values.

        }

      });

    }else{

      res.json({

        status: 'error',
        message: msg

      });

    }

  });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  var msg = (err.friendly) ? err.friendly : err.message;

  res.status(err.status || 500);

  if(err.statusType){

    res.json({

      status: err.statusType,
      data: {

        message: msg

      }

    });

  }else{

    res.json({

      status: 'error',
      message: msg

    });

  }

});

module.exports = app;
