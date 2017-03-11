(function(){

    module.exports = function(session){

        var router = require('express').Router();
        
        //router.use('/bt', session.nativeSessionBT, require('./controllers/bt')());
        //router.use('/cto/issuing', session.nativeSessionCTO, require('./controllers/cto/issuing')());
        //router.use('/ps/traffic', require('./controllers/ps/traffic')());

        return router;

    };

})();
