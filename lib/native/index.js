(function(){

    module.exports = function(session, cache){

        var router = require('express').Router();

        router.use('/personconsumer', require('./controllers/personConsumer')(cache));

        return router;

    };

})();
