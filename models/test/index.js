(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var testSchema = new Schema({

    underName: {type: ObjectId, required: true, ref: 'Person Consumer'},
    student: {type: ObjectId, required: true, ref: 'Student'},
    testType: {type: String, index: true, required: true, default: 'Theory', enum: ['Theory', 'Yard', 'Road']},
    preferredLocalities: [String],
    awarded: {

      timeSlot: {

        startDate: {type: Date, index: true, sparse: true},
        endDate: {type: Date, index: true, sparse: true}

      },
      locality: {type: String, trim: true, sparse: true},
      site: {type: String, trim: true, sparse: true}

    },
    telephone: {type: String, trim: true, required: true, index: true}, //used as reference during some forms of payment
    paymentReference: {type: String, trim: true, sparse: true}, //used as reference during some forms of payment
    paymentDue: {type: Number, required: true},
    paymentStatus: {type: String, index: true, required: true, default: 'Due', enum: ['Due', 'Complete']},
    modifiedTime: {type: Date, default: Date.now()},
    created: {type: Date, default: Date.now()}

  });

  module.exports = testSchema;

})();
