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
    paymentDueDate: {type: Date, required: true},
    minimumPaymentDue: {type: Number, index: true, sparse: true},
    vehicle: {type: ObjectId, ref: 'Vehicle', required: true},
    taxID: {type: String, trim: true, index: true, required: true},
    taxType: {type: String, required: true, enum: ['Licence', 'Permit']},
    telephone: {type: String, trim: true, sparse: true}, //used as an identifier during some forms of payment
    paymentReference: {type: String, trim: true, sparse: true}, //used as reference during some forms of payment
    latePaymentProof: {type: String, trim: true, sparse: true}, // used a proof of payment for offline scenario
    paymentStatus: {type: String, index: true, required: true, default: 'Due', enum: ['Due', 'Complete']},
    created: {type: Date, default: Date.now()},
    authorized: {type: Boolean, sparse: true},
    lastModified: {type: Date, default: Date.now()}
    //TODO: notes field e.g. where a vehicle is going to in the case of a single trip permit

  });

  module.exports = tokenSchema;

})();
