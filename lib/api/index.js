(function(){

    module.exports = function(){

        var router = require('express').Router();

        router.use('/licencingofficeadmin', require('./controllers/licencingOfficeAdministrator')());

        return router;

    };

})();
