(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @IndividualProduct <https://schema.org/IndividualProduct>

  var individualProductSchema = new Schema({

    serialNumber: {type: String, trim: true, unique: true, required: true},
    product: {type: ObjectId, ref: 'Product'},
    IndividualProductType: {type: String, trim: true, enum: ['Device', 'Cradle', 'External Battery', 'RFID Reader Module', 'Finger Print Reader Module', 'RFID Tag'], required: true},
    active: {type: Boolean, default: true, required: true},
    purchaseDate: {type: Date, required: true},
    lastModified: {type: Date, default: Date.now()},
    created: {type: Date, default: Date.now()}

  });

  module.exports = individualProductSchema;

})();
