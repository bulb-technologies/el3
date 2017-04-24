(function(){

    module.exports = function(cache){

        var router = require('express').Router();

        router.use('/sysadmin', require('./controllers/systemAdministrator')());
        router.use('/transportadmin', require('./controllers/transportAdministrator')());

        return router;

    };

})();
