(function(){

    module.exports = function(){

        var router = require('express').Router();

        router.use('/sysadmin', require('./controllers/systemAdministrator')());
        router.use('/licensingofficer', require('./controllers/licensingOfficer')());
        router.use('/transportadmin', require('./controllers/transportAdministrator')());

        return router;

    };

})();
