(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Organization <https://schema.org/Organization>

  var organizationConsumerSchema = new Schema({

    name: {type: String, trim: true},
    identification: {type: String, trim: true, unique: true, sparse: true},
    email: {type: String, trim: true, unique: true, required: true},
    telephone: {type: String, trim: true, unique: true, sparse: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = organizationConsumerSchema;

})();
