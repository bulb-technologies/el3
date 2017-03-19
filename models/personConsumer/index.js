(function(){

    //extents @Person <http://schema.org/Person>

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.ObjectId;

    var personConsumerSchema = new Schema({

        name: {

            first: {type: String, trim: true, required: true},
            last: {type: String, trim: true, required: true}

        },
        identification: {type: String, trim: true, unique: true, required: true},
        telephone: {type: String, trim: true, unique: true, required: true},
        emergency: {

            kins: [{

                name: {   //extents @Person <http://schema.org/Person>

                    first: {type: String, trim: true, required: true},
                    last: {type: String, trim: true, required: true}

                },
                telephone: {type: String, trim: true, unique: true, required: true},
                created: {type: Date, default: Date.now()}

            }],
            allergies: [{type: String}],
            illnesses: [{type: String}],
            bloodType: {type: String, sparse: true, enum: ['A', 'B', 'AB', 'O']}

        },
        nationality: {type: String, trim: true},
        driversLicence: {

            rfidTagSerialNumber: {type: String, trim: true, unique: true, ref: 'RFID Tag', sparse: true},
            blocked: {type: Boolean, required: true, default: false}

        },
        password: {type: String, trim: true, required: true},
        created: {type: Date, default: Date.now()},
        lastModified: {type: Date, default: Date.now(), index: true}

    });

    module.exports = personConsumerSchema;

})();
