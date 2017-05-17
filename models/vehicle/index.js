(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  //extents @Vehicle <https://schema.org/Vehicle>

  var vehicleSchema = new Schema({

    numberPlate: {type: String, trim: true, unique: true, required: true},
    owner: {
        person: {type: ObjectId, ref: 'Person Consumer'},
        organization: {type: ObjectId, ref: 'Organization Consumer'}
    },
    vehicleUse: {type: String, required: true, enum: ['Personal', 'Commercial', 'State']},
    rfidTagSerialNumber: {type: String, trim: true, unique: true, required: true},
    vehicleClass: {type: String, index:true, required: true, enum: ['L', 'H', 'XH', 'XXH']},
    created: {type: Date, default: Date.now()},
    lastModified: {type: Date, default: Date.now(), index: true}

  });

  module.exports = vehicleSchema;

})();


//Personal - Used for personal consumption
//Commercial - Used for Commercial Purposes, includes vehicles used by parastatals
//State - Used by Government for non commercial purposes e.g Council Vehicles
