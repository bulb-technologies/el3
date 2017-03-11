(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Thing <https://schema.org/Thing>

  var batchSchema = new Schema({

    contents: {type: String, required: true},
    type_: {type: String, trim: true, required: true, enum: ['Transaction', 'SMS']},
    created: {type: Date, default: Date.now()}

  });

  module.exports = batchSchema;

})();
