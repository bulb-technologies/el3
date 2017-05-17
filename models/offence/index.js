(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var offenceSchema = new Schema({

    vehicle: {type: ObjectId, required: true, index: true, ref: 'Vehicle'},
    telephone: {type: String, trim: true, required: true, index: true},
    ticketReference: {type: String, trim: true, unique: true, required: true},
    paymentReference: {type: String, trim: true, sparse: true}, //used as reference during some forms of payment
    minimumPaymentDue: {type: Number, required: true},
    paymentStatus: {type: String, index: true, required: true, default: 'Due', enum: ['Due', 'Complete']},
    dateCommitted: {type: Date, required: true},
    paymentDueDate: {type: Date, required: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = offenceSchema;

})();
