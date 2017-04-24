(function(){

  //extents @Person <https://schema.org/Person>

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var administratorSchema = new Schema({

    name: {

      first: {type: String, trim: true, required: true},
      last: {type: String, trim: true, required: true}

    },
    identification: {type: String, trim: true, unique: true, required: true},
    email: {type: String, trim: true, unique: true, sparse: true},
    telephone: {type: String, trim: true, unique: true, sparse: true},
    role: {type: String, default: 'administrator'},
    administratorType: {type: String, trim: true, required: true, enum: ['System', 'Transport Headquarters', 'Licencing Office', 'Police Headquarters', 'Police Office', 'POS Payment Vendor']},
    worksFor: {

      governmentOrganization: {type: ObjectId, ref: 'Government Organization', sparse: true},
      posPaymentVendor: {type: ObjectId, ref: 'POS Payment Vendor', sparse: true}

    },
    blocked: {

        value: {type: Boolean, default: false, index: true},
        reason: {type: String, trim: true, sparse: true}

    },
    country: {type: String, trim: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = administratorSchema;

})();
