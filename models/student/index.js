(function(){

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Schema.ObjectId;

  var studentSchema = new Schema({

    name: {

      first: {type: String, trim: true, required: true},
      last: {type: String, trim: true, required: true}

    },
    identification: {type: String, trim: true, required: true},
    nationality: {type: String, trim: true, required: true},
    testInformation: {

      theory: {

        passed: {type: Boolean, required: true, index: true, default: false},
        validUntil: {type: Date, sparse: true}

      },
      yard: {

        passed: {type: Boolean, required: true, index: true, default: false},
        validUntil: {type: Date, sparse: true}

      },
      road: {

        passed: {type: Boolean, required: true, index: true, default: false},
        validUntil: {type: Date, sparse: true}

      }

    },
    created: {type: Date, default: Date.now()}

  });

  //define a combination of fields to be unique
  studentSchema.index({'nationality': 1, 'identification': 1}, {unique: true});

  module.exports = studentSchema;

})();
