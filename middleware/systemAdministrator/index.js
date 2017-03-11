(function(){

  var customError;
  var middleware = {};
  var async = require('async');
  var models = require(_ + 'models');
  var ProductModel = models.productModel;
  var ManufacturerModel = models.manufacturerModel;
  var IndividualProductModel = models.individualProductModel;
  var GovernmentOrganizationModel = models.governmentOrganizationModel;
  var ScannerBundleModel = models.scannerBundleModel;
  var AdministratorModel = models.administratorModel;

  //define middleware here

  //create a manufacturer
  middleware.createManufacturer = function(req, res, next){

    var details = req.body;

    //create an instance of ManufacturerModel
    var newManufacturer = new ManufacturerModel();

    newManufacturer.name = details.name;
    newManufacturer.email = details.email;
    newManufacturer.telephone = details.telephone;
    newManufacturer.country = details.country;
    newManufacturer.url = (details.url) ? details.url : undefined;

    //check if the address object is defined
    if(details.address != undefined){

      newManufacturer.address.postOfficeBoxNumber = (details.address.postOfficeBoxNumber) ? details.address.postOfficeBoxNumber : undefined;
      newManufacturer.address.postalCode = (details.address.postalCode) ? details.address.postalCode : undefined;
      newManufacturer.address.streetAddress = (details.address.streetAddress) ? details.address.streetAddress : undefined;
      newManufacturer.address.addressRegion = (details.address.addressRegion) ? details.address.addressRegion : undefined;
      newManufacturer.address.addressLocality = (details.address.addressLocality) ? details.address.addressLocality : undefined;

    }

    //save
    newManufacturer.save(function(err){

      if(err){

        next(err);

      }else{

        //create temporary store
        req.tmp = {};
        req.tmp.manufacturer = newManufacturer._id;
        next();

      }

    });

  };

  //create a product
  middleware.createProduct = function(req, res, next){

    var details = req.body;

    async.auto({

      findManufacturer: function(callback){

        ManufacturerModel.findById(details.manufacturer)
        .select('brands')
        .exec(function(err, manufacturer){

          if(err){

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            next(err);

          }else{

            if(manufacturer){

              callback(null, manufacturer);

            }else{

              customError = new Error('Manufacturer not found.');
              customError.status = 404;
              customError.statusType = 'fail';
              callback(customError);

            }

          }

        });

      },

      checkForBrand: ['findManufacturer', function(results, callback){

        var manufacturer = results.findManufacturer;

        if(manufacturer.brands.indexOf(details.brand) == -1){

          customError = new Error('Brand supplied not found under Manufacturer.');
          customError.status = 404;
          customError.statusType = 'fail';
          callback(customError);

        }else{

          callback();

        }

      }],

      createProduct: ['checkForBrand', function(results, callback){

        //create an instance of ProductModel
        var newProduct = new ProductModel();

        newProduct.name = details.name;
        newProduct.description = details.description;
        newProduct.productType = details.productType;
        newProduct.url = (details.url) ? details.url : undefined;
        newProduct.image = (details.image) ? details.image : undefined;
        newProduct.releaseDate = details.releaseDate;
        newProduct.model = details.model;
        newProduct.gtin = details.gtin;
        newProduct.manufacturer = details.manufacturer;
        newProduct.brand = details.brand;

        //save
        newProduct.save(function(err){

          if(err){

            next(err);

          }else{

            //create temporary store
            req.tmp = {};
            req.tmp.product = newProduct._id;
            next();

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

  //create an individual product
  middleware.createIndividualProduct = function(req, res, next){

    var details = req.body;

    async.auto({

      findProduct: function(callback){

        ProductModel.findById(details.product)
        .count(function(err, count){

          if(err){

            //db error
            err.friendly = 'Something went wrong. Please try again.';
            err.status = 500;
            err.statusType = 'error';
            next(err);

          }else{

            if(count){

              callback();

            }else{

              customError = new Error('Product not found.');
              customError.status = 404;
              customError.statusType = 'fail';
              callback(customError);

            }

          }

        });

      },

      createIndividualProduct: ['findProduct', function(results, callback){

        //create an instance of individualProductModel
        var newIndividualProduct = new IndividualProductModel();

        newIndividualProduct.serialNumber = details.serialNumber;
        newIndividualProduct.purchaseDate = details.purchaseDate;
        newIndividualProduct.product = details.product;

        //save
        newIndividualProduct.save(function(err){

          if(err){

            next(err);

          }else{

            //create temporary store
            req.tmp = {};
            req.tmp.individualProduct = newIndividualProduct._id;
            next();

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

  //create a scanner bundle
  middleware.createScannerBundle = function(req, res, next){

    var details = req.body;

    async.auto({

      findGovernmentOrganization: function(callback){

        GovernmentOrganizationModel.findById(details.assignedTo)
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

      findDevice: function(callback){

        IndividualProductModel.findById(details.device)
        .populate({

          'path': 'product',
          'select': '-_id productType'

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

              if(individualProduct.product.productType == 'Device'){

                callback(null, individualProduct);

              }else{

                customError = new Error('Device not found.');
                customError.status = 404;
                customError.statusType = 'fail';
                callback(customError);

              }

            }else{

              customError = new Error('Device not found.');
              customError.status = 404;
              customError.statusType = 'fail';
              callback(customError);

            }

          }

        });

      },

      findCradle: function(callback){

        if(details.cradle){

          IndividualProductModel.findById(details.cradle)
          .populate({

            'path': 'product',
            'select': '-_id productType'

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

                if(individualProduct.product.productType == 'Crade'){

                  callback(null, individualProduct);

                }else{

                  customError = new Error('Cradle not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  callback(customError);

                }

              }else{

                customError = new Error('Cradle not found.');
                customError.status = 404;
                customError.statusType = 'fail';
                callback(customError);

              }

            }

          });

        }else{

          callback();

        }

      },

      findRFIDReaderModule: function(callback){

        if(details.rfidReaderModule){

          IndividualProductModel.findById(details.rfidReaderModule)
          .populate({

            'path': 'product',
            'select': '-_id productType'

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

                if(individualProduct.product.productType == 'RFID Reader Module'){

                  callback(null, individualProduct);

                }else{

                  customError = new Error('RFID Reader Module not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  callback(customError);

                }

              }else{

                customError = new Error('RFID Reader Module not found.');
                customError.status = 404;
                customError.statusType = 'fail';
                callback(customError);

              }

            }

          });

        }else{

          callback();

        }

      },

      findFingerPrintReaderModule: function(callback){

        if(details.fingerPrintReaderModule){

          IndividualProductModel.findById(details.fingerPrintReaderModule)
          .populate({

            'path': 'product',
            'select': '-_id productType'

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

                if(individualProduct.product.productType == 'Finger Print Reader Module'){

                  callback(null, individualProduct);

                }else{

                  customError = new Error('Finger Print Reader Module not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  callback(customError);

                }

              }else{

                customError = new Error('Finger Print Reader Module not found.');
                customError.status = 404;
                customError.statusType = 'fail';
                callback(customError);

              }

            }

          });

        }else{

          callback();

        }

      },

      findExternalBattery: function(callback){

        if(details.cradle){

          IndividualProductModel.findById(details.cradle)
          .populate({

            'path': 'product',
            'select': '-_id productType'

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

                if(individualProduct.product.productType == 'External Battery'){

                  callback(null, individualProduct);

                }else{

                  customError = new Error('External Battery not found.');
                  customError.status = 404;
                  customError.statusType = 'fail';
                  callback(customError);

                }

              }else{

                customError = new Error('External Battery not found.');
                customError.status = 404;
                customError.statusType = 'fail';
                callback(customError);

              }

            }

          });

        }else{

          callback();

        }

      },

      createScannerBundle: ['findGovernmentOrganization', 'findCradle', 'findDevice', 'findRFIDReaderModule', 'findFingerPrintReaderModule', 'findExternalBattery', function(results, callback){

        var organization = results.findGovernmentOrganization;
        var device = results.findDevice;
        var cradle = results.findCradle;
        var rfidReaderModule = results.findRFIDReaderModule;
        var fingerPrintReaderModule = results.findFingerPrintReaderModule;
        var externalBattery = results.findExternalBattery;

        //create an instance of ScannerBundleModel
        var newScannerBundle = new ScannerBundleModel();

        //check if the organization the scanner bundle is assigned to is either police or transport related
        if(organization.organizationType == 'Police Station' || organization.organizationType == 'Police Headquarters'){

            if(!cradle || !rfidReaderModule || !externalBattery){

                customError = new Error('Scanner bundle should contain 1 Device, 1 Cradle, 1 RFID Reader Module & 1 External Battery.');
                customError.status = 403;
                customError.statusType = 'fail';
                callback(customError);

            }else{

                newScannerBundle.device = device._id;
                newScannerBundle.cradle = cradle._id;
                newScannerBundle.rfidReaderModule = rfidReaderModule._id;
                newScannerBundle.externalBattery = externalBattery._id;
                newScannerBundle.assignedTo = organization._id;

                //save
                newScannerBundle.save(function(err){

                    if(err){

                      callback(err);

                    }else{

                      //create temporary store
                      req.tmp = {};
                      req.tmp.scannerBundle = newScannerBundle._id;
                      callback();

                    }

                });

            }

        }else{

            if(cradle || rfidReaderModule || externalBattery){

                customError = new Error('Scanner bundle should contain 1 Device.');
                customError.status = 403;
                customError.statusType = 'fail';
                callback(customError);

            }else{

                newScannerBundle.device = device._id;
                newScannerBundle.assignedTo = organization._id;

                //save
                newScannerBundle.save(function(err){

                    if(err){

                      callback(err);

                    }else{

                      //create temporary store
                      req.tmp = {};
                      req.tmp.scannerBundle = newScannerBundle._id;
                      callback();

                    }

                });

            }

        }

      }]

    }, function(err, results){

      if(err){

        next(err);

      }else{

        next();

      }

    });

  };

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


    if(details.organizationType == 'Police Headquarters' || details.organizationType == 'Transport Headquarters'){

      //check if there exists another police hq in the same country
      GovernmentOrganizationModel.find({'organizationType': details.organizationType, 'country': details.country})
      .count(function(err, count){

          if(err){

              //db error
              err.friendly = 'Something went wrong. Please try again.';
              err.status = 500;
              err.statusType = 'error';
              next(err);

          }else{

              if(count){

                  customError = new Error(details.country +' already has a '+ details.organizationType + '.');
                  customError.status = 409;
                  customError.statusType = 'fail';
                  next(customError);

              }else{

                  newGovOrg.organizationType = details.organizationType;

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

              }

          }

      });

    }else{

        //check if parentOrganization is supplied
        if(details.parentOrganization){

            if(details.organizationType == 'Licensing Office'){

                //check if the parentOrganization supplied is Transport Headquarters
                GovernmentOrganizationModel.find({'_id': details.parentOrganization, 'organizationType': 'Transport Headquarters', 'country': details.country})
                .count(function(err, count){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        next(err);

                    }else{

                        if(count){

                            newGovOrg.organizationType = details.organizationType;
                            newGovOrg.parentOrganization = details.parentOrganization;

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

                        }else{

                            customError = new Error('Parent Organization is not Transport Headquarters.');
                            customError.status = 400;
                            customError.statusType = 'fail';
                            next(customError);

                        }

                    }

                });

            }else{

                //check if the parentOrganization supplied is Transport Headquarters
                GovernmentOrganizationModel.find({'_id': details.parentOrganization, 'organizationType': 'Police Headquarters', 'country': details.country})
                .count(function(err, count){

                    if(err){

                        //db error
                        err.friendly = 'Something went wrong. Please try again.';
                        err.status = 500;
                        err.statusType = 'error';
                        next(err);

                    }else{

                        if(count){

                            newGovOrg.organizationType = details.organizationType;
                            newGovOrg.parentOrganization = details.parentOrganization;

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

                        }else{

                            customError = new Error('Parent Organization is not Police Headquarters.');
                            customError.status = 400;
                            customError.statusType = 'fail';
                            next(customError);

                        }

                    }

                });

            }

        }else{

            customError = new Error('Parent Organization not supplied.');
            customError.status = 400;
            customError.statusType = 'fail';
            next(customError);

        }

    }

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
