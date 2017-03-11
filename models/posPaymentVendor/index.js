(function(){

  //extents @Organization <https://schema.org/Organization>

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var posPaymentVendorSchema = new Schema({

    name: {type: String, trim: true},
    description: {type: String, trim: true},
    identification: {type: String, trim: true, unique: true, sparse: true},
    email: {type: String, trim: true, unique: true, required: true},
    telephone: {type: String, trim: true, unique: true, sparse: true},
    apiAuth: {type: String, trim: true, required: true},
    role: {type: String, default: 'posPaymentVendor'},
    wallet: {

      balance: {type: Number, default: 0, index: true, required: true},
      debited: [{type: String}],
      credited: [{type: String}]

    },
    country: {type: String, trim: true, sparse: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = posPaymentVendorSchema;

})();
