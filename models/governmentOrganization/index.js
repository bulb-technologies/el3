(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @GovernmentOrganization <https://schema.org/GovernmentOrganization>

  var governmentOrganizationSchema = new Schema({

    name: {type: String, trim: true, unique: true, required: true},
    email: {type: String, trim: true, unique: true, required: true},
    telephone: {type: String, trim: true, unique: true, required: true},
    parentOrganization: {type: ObjectId, ref: 'Government Organization', sparse: true},
    address: {   //extents @PostalAddress <https://schema.org/PostalAddress>

      postOfficeBoxNumber: {type: String, trim: true, sparse: true},
      postalCode: {type: String, trim: true, sparse: true},
      streetAddress: {type: String, trim: true, sparse: true},
      addressRegion: {type: String, trim: true, sparse: true},
      addressLocality: {type: String, trim: true, sparse: true},

    },
    organizationType: {type: String, trim: true, enum: ['Police Headquarters', 'Transport Headquarters', 'Licencing Office', 'Police Station'], required: true},
    wallet: {

      balance: {type: Number, index: true, sparse: true}, //if set, default is 0
      debited: [{type: String}],
      credited: [{type: String}]

    },
    created: {type: Date, default: Date.now()}

  });

  module.exports = governmentOrganizationSchema;

})();
