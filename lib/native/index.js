(function(){

    module.exports = function(session, cache){

        var router = require('express').Router();

        router.use('/personconsumer', require('./controllers/personConsumer')(cache));
        router.use('/trafficofficer', require('./controllers/trafficOfficer')(cache));
        router.use('/licencingofficer', require('./controllers/licencingOfficer')(cache));

        return router;

    };

})();
