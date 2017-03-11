(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Organization <https://schema.org/Organization>

  var manufacturerSchema = new Schema({

    name: {type: String, trim: true, unique: true, required: true},
    email: {type: String, trim: true, unique: true, required: true},
    url: {type: String, trim: true, unique: true, sparse: true},
    telephone: {type: String, trim: true, unique: true, required: true},
    address: {   //extents @PostalAddress <https://schema.org/PostalAddress>

      postOfficeBoxNumber: {type: String, trim: true, sparse: true},
      postalCode: {type: String, trim: true, sparse: true},
      streetAddress: {type: String, trim: true, sparse: true},
      addressRegion: {type: String, trim: true, sparse: true},
      addressLocality: {type: String, trim: true, sparse: true}

    },
    brands: [{type: String, trim: true}],
    country: {type: String, trim: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = manufacturerSchema;

})();
