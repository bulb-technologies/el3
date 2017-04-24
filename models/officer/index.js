(function(){

  //extents @Person <https://schema.org/Person>

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var officerSchema = new Schema({

    name: {

      first: {type: String, trim: true, required: true},
      last: {type: String, trim: true, required: true}

    },
    identification: {type: String, trim: true, unique: true, required: true},
    role: {type: String, default: 'officer'},
    officerType: {type: String, trim: true, enum: ['Licencing']},
    worksFor: {type: ObjectId, ref: 'Government Organization', required: true},
    created: {type: Date, default: Date.now()}

  });

  module.exports = officerSchema;

})();
