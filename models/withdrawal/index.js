(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var withdrawalSchema = new Schema({

    from: {type: ObjectId, ref: 'Government Organization', index: true, required: true},
    amount: {type: Number, required: true},
    status: {type: String, trim: true, index: true, required: true, default: 'Pending', enum: ['Pending', 'Complete']},
    created: {type: Date, default: Date.now()}

  });

  module.exports = withdrawalSchema;

})();
