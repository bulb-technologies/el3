(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var activityLogSchema = new Schema({

   action: {type: String, required: true, enum:['Create', 'Update', 'Delete']},
   actor: {

     officer: {type: ObjectId, ref: 'Officer', sparse: true, index: true},
     administrator: {type: ObjectId, ref: 'Administrator', sparse: true, index: true}

   },
   subject: {

     administrator: {type: String, ref: 'Administrator', sparse: true, index: true},
     abioticConsumer: {type: String, ref: 'Abiotic Consumer', sparse: true, index: true},
     bioticConsumer: {type: String, ref: 'Biotic Consumer', sparse: true, index: true},
     vehicle: {type: String, ref: 'Vehicle', sparse: true, index: true},
     officer: {type: String, ref: 'Officer', sparse: true, index: true},
     governmentOrganization: {type: String, ref: 'Government Organization', sparse: true, index: true},
     product: {type: String, ref: 'Product', sparse: true, index: true},
     tax: {type: String, ref: 'Tax', sparse: true, index: true},
     permit: {type: String, ref: 'Permit', sparse: true, index: true}

   },
   notes: {type: String, trim: true, required: true},
   created: {type: Date, default: Date.now()}

  });

  module.exports = activityLogSchema;

})();
