(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Thing <https://schema.org/Thing>

  var scannerBundleSchema = new Schema({

    device: {type: ObjectId, ref: 'Individual Product', required: true, unique: true},
    cradle: {type: ObjectId, ref: 'Individual Product', sparse: true, unique: true},
    rfidReaderModule: {type: ObjectId, ref: 'Individual Product', sparse: true, unique: true},
    fingerPrintReaderModule: {type: ObjectId, ref: 'Individual Product', sparse: true, unique: true},
    externalBattery: {type: ObjectId, ref: 'Individual Product', sparse: true, unique: true},
    assignedTo: {type: ObjectId, ref: 'Government Organization', required: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = scannerBundleSchema;

})();
