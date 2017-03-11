(function(){

    module.exports = function(){

        var router = require('express').Router();

        router.use('/licensingofficeadmin', require('./controllers/licensingOfficeAdministrator')());

        return router;

    };

})();
