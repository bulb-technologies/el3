(function(){

    var mongoose = require('mongoose');
    var options = {};
    const DB_URL = 'mongodb://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST_1 + ':' + process.env.DB_PORT_1 + '/' + process.env.DB_DATABASE;
    var db = mongoose.createConnection(DB_URL, options);
    module.exports = db;

})();
