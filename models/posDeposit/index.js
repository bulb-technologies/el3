(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var posDepositSchema = new Schema({

    from: {type: String, trim: true, index: true, required: true, default: 'Anonymous'},
    to: {type: ObjectId, ref: 'POS Payment Vendor', required: true},
    reference: {type: String, trim: true, index: true, required: true},
    amount: {type: Number, required: true},
    status: {type: String, trim: true, index: true, required: true, default: 'Pending', enum: ['Pending', 'Complete']},
    created: {type: Date, default: Date.now()}

  });

  module.exports = posDepositSchema;

})();
