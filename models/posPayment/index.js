(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var posPaymentSchema = new Schema({

    from: {type: ObjectId, ref: 'Payment Vendor', index: true, required: true},
    to: {type: ObjectId, ref: 'Government Organization', index: true, required: true},
    onBehalfOf: {

      consumerBiotic: {type: Object, ref: 'Biotic Consumer', sparse: true},
      consumerAbiotic: {type: Object, ref: 'Abiotic Consumer', sparse: true}

    },
    amount: {type: Number, required: true},
    permit: {type: Object, ref: 'Permit', required: true},
    status: {type: String, trim: true, index: true, required: true, default: 'Pending', enum: ['Pending', 'Complete']},
    created: {type: Date, default: Date.now()}

  });

  module.exports = posPaymentSchema;

})();
