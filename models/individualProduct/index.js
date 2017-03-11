(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @IndividualProduct <https://schema.org/IndividualProduct>

  var individualProductSchema = new Schema({

    serialNumber: {type: String, trim: true, unique: true, required: true},
    product: {type: ObjectId, ref: 'Product'},
    purchaseDate: {type: Date, required: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = individualProductSchema;

})();
