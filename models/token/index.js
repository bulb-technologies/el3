(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @GovernmentPermit <https://schema.org/GovernmentPermit>
  //extents @Invoice <https://schema.org/Invoice>

  var tokenSchema = new Schema({

    name: {type: String, trim: true, required: true},
    validFrom: {type: Date, required: true},
    validUntil: {type: Date, required: true},
    duration: {type: String, trim: true, required: true},
    minimumPaymentDue: {type: Number, index: true, sparse: true},
    vehicle: {type: ObjectId, ref: 'Vehicle', required: true},
    taxID: {type: String, trim: true, index: true, required: true},
    feeID: {type: String, trim: true, index: true, required: true},
    taxType: {type: String, required: true, enum: ['Licence', 'Permit']},
    paymentReference: {type: String, trim: true, sparse: true, unique: true}, //used as reference during some forms of payment
    paymentStatus: {type: String, index: true, required: true, default: 'Due', enum: ['Due', 'Complete']},
    note: {type: String, trim:true, sparse: true},
    created: {type: Date, default: Date.now()},
    authorized: {type: Boolean, sparse: true},
    lastModified: {type: Date, default: Date.now()},
    lastToken: {type: ObjectId, sparse: true},
    authPair: {type: String, trim:true, required: true}

  });

  module.exports = tokenSchema;

})();
