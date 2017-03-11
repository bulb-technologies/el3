(function(){

  var bcrypt = require('bcrypt');
  var models = require(_ + 'models');
  var customError;
  var middleware = {};

  //define middleware here

  /**
  *  Checks for uid property in session object
  * @return {null}        returns null
  */
  /**middleware.isAuthenticated = function(req, res, next){

    if(req.session.uid){

      next();

    }else{

      //not authenticated error
      customError = new Error('Attempting to access protected resources while not authenticated.');
      customError.friendly = 'You are not authenticated.';
      customError.status = 401;
      customError.statusType = 'fail';
      next(customError);

    }

  };**/

/**
 *  Creates a session uid
 * @return {null}        returns null
 */
    /**middleware.loginAdministrator = function(req, res, next){

        var details = req.body;

        //find admin by email
        AdministratorModel.findOne()
        .where('contact.email').equals(details.email)
        .select('password')
        .exec(function(err, administrator){

            if(err){

                //db error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                next(err);

            }else{

                if(administrator){

                    //check if hash matches the password supplied
                    bcrypt.compare(details.password, administrator.password, function(err, match){

                        if(err){

                            //db error
                            err.friendly = 'Something went wrong. Please try again.';
                            err.status = 500;
                            err.statusType = 'error';
                            next(err);

                        }else{

                            if(match){

                                //attach user id to session
                                req.session.uid = administrator._id;
                                next();

                            }else{

                                //FIXME: Block Mechanic?
                                customError = new Error('Wrong Username or Password.');
                                customError.friendly = 'Wrong Username or Password.';
                                customError.status = 401;
                                customError.statusType = 'fail';
                                next(customError);

                            }

                        }

                    });

                }else{

                    customError = new Error('Administrator not found.');
                    customError.friendly = 'Administrator not found.';
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                }

            }

        });

    };**/

/**
 *  destroys session uid
 * @return {null}        returns null
 */
    /**middleware.logoutAdministrator = function(req, res, next){

        req.session.destroy(function(err){

            if(err){

                //error
                err.friendly = 'Something went wrong. Please try again.';
                err.statusType = 'error';
                next(err);

            }else{

                next();

            }

        });

    };**/

/**
 *  Creates a session uid
 * @return {null}        returns null
 */
  /**  middleware.loginIssuingOfficer = function(req, res, next){

        var details = req.body;

        //find admin by email
        OfficerModel.findOne()
        .where('contact.email').equals(details.email)
        .where('type_').equals('Issuing')
        .select('password')
        .exec(function(err, officer){

            if(err){

                //db error
                err.friendly = 'Something went wrong. Please try again.';
                err.status = 500;
                err.statusType = 'error';
                next(err);

            }else{

                if(officer){

                    //check if hash matches the password supplied
                    bcrypt.compare(details.password, officer.password, function(err, match){

                        if(err){

                            //db error
                            err.friendly = 'Something went wrong. Please try again.';
                            err.status = 500;
                            err.statusType = 'error';
                            next(err);

                        }else{

                            if(match){

                                //attach user id to session
                                req.session.uid = officer._id;
                                next();

                            }else{

                                //FIXME: Block Mechanic?
                                customError = new Error('Wrong credentials supplied.');
                                customError.friendly = 'Wrong credentials supplied.';
                                customError.status = 401;
                                customError.statusType = 'fail';
                                next(customError);

                            }

                        }

                    });

                }else{

                    customError = new Error('Officer not found.');
                    customError.friendly = 'Officer not found.';
                    customError.status = 404;
                    customError.statusType = 'fail';
                    next(customError);

                }

            }

        });

    };**/

/**
 *  destroys session uid
 * @return {null}        returns null
 */
    /**middleware.logoutIssuingOfficer = function(req, res, next){

        req.session.destroy(function(err){

            if(err){

                //error
                err.friendly = 'Something went wrong. Please try again.';
                err.statusType = 'error';
                next(err);

            }else{

                next();

            }

        });

    };**/

    //export middleware
    module.exports = middleware;

})();
