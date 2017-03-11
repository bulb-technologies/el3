(function(){

  var models = {};
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;
  var db = require(_ + 'config/connection');

  //create model compilations.

  models.activityLogModel = db.model('Activity Log', require('./activityLog'));

  models.administratorModel = db.model('Administrator', require('./administrator'));

  models.batchModel = db.model('Batch', require('./batch'));

  models.governmentOrganizationModel = db.model('Government Organization', require('./governmentOrganization'));

  models.individualProductModel = db.model('Individual Product', require('./individualProduct'));

  models.manufacturerModel = db.model('Manufacturer', require('./manufacturer'));

  models.officerModel = db.model('Officer', require('./officer'));

  models.organizationConsumerModel = db.model('Organization Consumer', require('./organizationConsumer'));

  models.tokenModel = db.model('Token', require('./token'));

  models.personConsumerModel = db.model('Person Consumer', require('./personConsumer'));

  models.posDepositModel = db.model('POS Deposit', require('./posDeposit'));

  models.posPaymentModel = db.model('POS Payment', require('./posPayment'));

  models.posPaymentVendorModel = db.model('POS Payment Vendor', require('./posPaymentVendor'));

  models.productModel = db.model('Product', require('./product'));

  models.scannerBundleModel = db.model('Scanner Bundle', require('./scannerBundle'));

  models.vehicleModel = db.model('Vehicle', require('./vehicle'));

  models.withdrawalModel = db.model('Withdrawal', require('./withdrawal'));

  //export models object.
  module.exports = models;

})();
