(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Product <https://schema.org/Product>

  var productSchema = new Schema({

    name: {type: String, trim: true, unique: true, required: true},
    description: {type: String, trim: true, required: true},
    url: {type: String, trim: true, unique: true, sparse: true},
    image: {type: String, trim: true, sparse: true},
    releaseDate: {type: Date, required: true},
    model: {type: String, trim: true, required: true},
    gtin: {type: String, trim: true, unique: true, required: true},
    manufacturer: {type: ObjectId, ref: 'Manufacturer', required: true},
    brand: {type: String, trim: true, required: true},
    productType: {type: String, trim: true, enum: ['Device', 'Cradle', 'External Battery', 'RFID Reader Module', 'Finger Print Reader Module', 'RFID Tag'], required: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = productSchema;

})();
