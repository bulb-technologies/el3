(function(){

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var offenceSchema = new Schema({

        vehicle: {type: ObjectId, ref: 'Vehicle', required: true},
        ticketReference: {type: String, trim: true, unique: true, required: true},
        minimumPaymentDue: {type: Number, required: true},
        paymentStatus: {type: String, index: true, required: true, default: 'Due', enum: ['Due', 'Complete']},
        committed: {type: Date, required: true},
        created: {type: Date, default: Date.now()}

    });

    module.exports = offenceSchema;

})();
